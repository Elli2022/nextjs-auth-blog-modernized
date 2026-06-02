import type { NextApiRequest, NextApiResponse } from "next";
import { getPostsCollection } from "@/lib/mongodb";
import { assertAuthConfig, assertDbConfig, jwtSecret } from "@/lib/config";
import { getSessionCookieName, verifySessionToken } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    assertDbConfig();
    assertAuthConfig();
  } catch (error) {
    return res.status(500).json({
      error:
        "Server is not configured yet (missing MONGODB_URI). Add environment variables and redeploy.",
    });
  }

  const sessionToken = req.cookies[getSessionCookieName()];
  if (!sessionToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  let sessionUser: { email: string; username: string };
  try {
    sessionUser = verifySessionToken(sessionToken, jwtSecret);
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    const postsCollection = await getPostsCollection();
    const posts = await postsCollection
      .find({ authorEmail: sessionUser.email })
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json({ data: posts });
  }

  if (req.method === "POST") {
    const { title, content, status } = req.body ?? {};

    if (!title || !content) {
      return res
        .status(400)
        .json({ error: "title and content are required" });
    }

    const normalizedStatus = status === "published" ? "published" : "draft";
    const now = Date.now();

    const postsCollection = await getPostsCollection();
    const result = await postsCollection.insertOne({
      title: String(title).trim(),
      content: String(content).trim(),
      status: normalizedStatus,
      authorEmail: sessionUser.email,
      commentsCount: 0,
      createdAt: now,
      updatedAt: now,
    });

    const saved = await postsCollection.findOne({ _id: result.insertedId });
    return res.status(201).json({ data: saved });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
