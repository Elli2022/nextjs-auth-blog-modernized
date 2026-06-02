import type { NextApiRequest } from "next";
import type { GetServerSidePropsContext } from "next";
import { assertAuthConfig, jwtSecret } from "./config";
import { getSessionCookieName, verifySessionToken } from "./auth";

export type SessionUser = {
  email: string;
  username: string;
};

type RequestWithCookies = NextApiRequest | GetServerSidePropsContext["req"];

export function getSessionFromRequest(
  req: RequestWithCookies
): SessionUser | null {
  try {
    assertAuthConfig();
    const token = req.cookies[getSessionCookieName()];
    if (!token) return null;
    return verifySessionToken(token, jwtSecret);
  } catch {
    return null;
  }
}

export function requireSessionRedirect() {
  return { redirect: { destination: "/signin", permanent: false } } as const;
}

export function guestRedirectIfSession(req: RequestWithCookies) {
  const session = getSessionFromRequest(req);
  if (session) {
    return { redirect: { destination: "/dashboard", permanent: false } } as const;
  }
  return null;
}
