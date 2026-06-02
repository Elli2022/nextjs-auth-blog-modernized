import jwt from "jsonwebtoken";

type SessionPayload = {
  email: string;
  username: string;
};

const SESSION_COOKIE_NAME = "session_token";

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME;
}

export function signSessionToken(payload: SessionPayload, secret: string) {
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifySessionToken(token: string, secret: string): SessionPayload {
  return jwt.verify(token, secret) as SessionPayload;
}
