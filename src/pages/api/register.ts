import type { NextApiRequest, NextApiResponse } from "next";
import { registerUser } from "@/lib/user-service";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  return registerUser(req.body)
    .then((user) => {
      return res.status(201).json({
        message: "Registration successful",
        user,
      });
    })
    .catch((error) => {
      const message =
        error instanceof Error ? error.message : "Registration failed";

      if (message.includes("configured")) {
        return res.status(500).json({
          error:
            "Server is not configured yet (missing MONGODB_URI). Add environment variables and redeploy.",
        });
      }

      if (
        message.includes("missing") ||
        message.includes("invalid") ||
        message.includes("least")
      ) {
        return res.status(400).json({ error: message });
      }

      if (message.includes("exists")) {
        return res.status(409).json({ error: message });
      }

      return res.status(500).json({ error: "Registration failed" });
    });
}
