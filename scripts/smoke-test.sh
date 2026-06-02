#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-https://my-nextjs-project-modernized.netlify.app}"
COOKIE_JAR="$(mktemp)"
TEST_EMAIL="smoke.$(date +%s)@example.com"
TEST_USER="smoke_user_$(date +%s)"
TEST_PASS="secret123"

cleanup() { rm -f "$COOKIE_JAR"; }
trap cleanup EXIT

echo "Smoke test against: $BASE_URL"

echo "1) Register"
REG=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/register" \
  -H "content-type: application/json" \
  -d "{\"username\":\"$TEST_USER\",\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASS\"}")
REG_CODE=$(echo "$REG" | tail -n1)
REG_BODY=$(echo "$REG" | sed '$d')
echo "   HTTP $REG_CODE"
[[ "$REG_CODE" == "201" ]] || { echo "$REG_BODY"; exit 1; }

echo "2) Login"
LOGIN=$(curl -s -w "\n%{http_code}" -c "$COOKIE_JAR" -X POST "$BASE_URL/api/login" \
  -H "content-type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASS\"}")
LOGIN_CODE=$(echo "$LOGIN" | tail -n1)
LOGIN_BODY=$(echo "$LOGIN" | sed '$d')
echo "   HTTP $LOGIN_CODE"
[[ "$LOGIN_CODE" == "200" ]] || { echo "$LOGIN_BODY"; exit 1; }

echo "3) Session"
SESSION=$(curl -s -w "\n%{http_code}" -b "$COOKIE_JAR" "$BASE_URL/api/session")
SESSION_CODE=$(echo "$SESSION" | tail -n1)
SESSION_BODY=$(echo "$SESSION" | sed '$d')
echo "   HTTP $SESSION_CODE"
echo "$SESSION_BODY" | grep -q '"authenticated":true' || { echo "$SESSION_BODY"; exit 1; }

echo "4) Create post"
CREATE=$(curl -s -w "\n%{http_code}" -b "$COOKIE_JAR" -X POST "$BASE_URL/api/posts" \
  -H "content-type: application/json" \
  -d '{"title":"Smoke post","content":"Created by smoke test","status":"draft"}')
CREATE_CODE=$(echo "$CREATE" | tail -n1)
CREATE_BODY=$(echo "$CREATE" | sed '$d')
echo "   HTTP $CREATE_CODE"
[[ "$CREATE_CODE" == "201" ]] || { echo "$CREATE_BODY"; exit 1; }
POST_ID=$(node -e "const d=JSON.parse(process.argv[1]); console.log(d.data._id)" "$CREATE_BODY")

echo "5) List posts"
LIST=$(curl -s -w "\n%{http_code}" -b "$COOKIE_JAR" "$BASE_URL/api/posts")
LIST_CODE=$(echo "$LIST" | tail -n1)
LIST_BODY=$(echo "$LIST" | sed '$d')
echo "   HTTP $LIST_CODE"
[[ "$LIST_CODE" == "200" ]] || { echo "$LIST_BODY"; exit 1; }
echo "$LIST_BODY" | grep -q "$POST_ID" || { echo "Post id missing in list"; exit 1; }

echo "6) Update post"
UPDATE=$(curl -s -w "\n%{http_code}" -b "$COOKIE_JAR" -X PUT "$BASE_URL/api/posts/$POST_ID" \
  -H "content-type: application/json" \
  -d '{"title":"Smoke post updated","content":"Updated content","status":"published"}')
UPDATE_CODE=$(echo "$UPDATE" | tail -n1)
UPDATE_BODY=$(echo "$UPDATE" | sed '$d')
echo "   HTTP $UPDATE_CODE"
[[ "$UPDATE_CODE" == "200" ]] || { echo "$UPDATE_BODY"; exit 1; }

echo "7) Delete post"
DELETE=$(curl -s -w "\n%{http_code}" -b "$COOKIE_JAR" -X DELETE "$BASE_URL/api/posts/$POST_ID")
DELETE_CODE=$(echo "$DELETE" | tail -n1)
DELETE_BODY=$(echo "$DELETE" | sed '$d')
echo "   HTTP $DELETE_CODE"
[[ "$DELETE_CODE" == "200" ]] || { echo "$DELETE_BODY"; exit 1; }

echo "8) Logout"
LOGOUT=$(curl -s -w "\n%{http_code}" -b "$COOKIE_JAR" -c "$COOKIE_JAR" -X POST "$BASE_URL/api/logout")
LOGOUT_CODE=$(echo "$LOGOUT" | tail -n1)
echo "   HTTP $LOGOUT_CODE"
[[ "$LOGOUT_CODE" == "200" ]] || exit 1

echo "9) Protected posts without session"
UNAUTH=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/posts")
UNAUTH_CODE=$(echo "$UNAUTH" | tail -n1)
echo "   HTTP $UNAUTH_CODE"
[[ "$UNAUTH_CODE" == "401" ]] || exit 1

echo "All smoke tests passed."
