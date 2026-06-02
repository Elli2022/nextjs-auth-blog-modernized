import type { NextApiRequest, NextApiResponse } from "next";
import { assertAuthConfig, jwtSecret } from "@/lib/config";
import { getSessionCookieName, verifySessionToken } from "@/lib/auth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    assertAuthConfig();
  } catch (error) {
    return res.status(200).json({ authenticated: false });
  }

  const token = req.cookies[getSessionCookieName()];
  if (!token) {
    return res.status(200).json({ authenticated: false });
  }

  try {
    const user = verifySessionToken(token, jwtSecret);
    return res.status(200).json({ authenticated: true, user });
  } catch (error) {
    return res.status(200).json({ authenticated: false });
  }
}
