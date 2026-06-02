import type { NextApiRequest, NextApiResponse } from "next";
import { loginUser } from "@/lib/user-service";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  return loginUser(req.body)
    .then(({ token, user }) => {
      return res.status(200).json({
        message: "Sign in successful",
        token,
        user,
      });
    })
    .catch((error) => {
      const message =
        error instanceof Error ? error.message : "Sign in failed";

      if (message.includes("configured")) {
        return res.status(500).json({
          error:
            "Server is not configured yet (missing MONGODB_URI). Add environment variables and redeploy.",
        });
      }

      if (message.includes("missing") || message.includes("invalid")) {
        return res.status(400).json({ error: message });
      }

      if (
        message.includes("not found") ||
        message.includes("incorrect password")
      ) {
        return res.status(401).json({ error: message });
      }

      return res.status(500).json({ error: "Sign in failed" });
    });
}
