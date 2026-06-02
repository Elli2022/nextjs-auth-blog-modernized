import type { NextApiRequest, NextApiResponse } from "next";
import { getPostsCollection } from "@/lib/mongodb";
import { assertDbConfig } from "@/lib/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    assertDbConfig();
  } catch (error) {
    return res.status(500).json({
      error:
        "Server is not configured yet (missing MONGODB_URI). Add environment variables and redeploy.",
    });
  }

  if (req.method === "GET") {
    const email = String(req.query.email || "").trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ error: "missing query parameter: email" });
    }

    const postsCollection = await getPostsCollection();
    const posts = await postsCollection
      .find({ authorEmail: email })
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json({ data: posts });
  }

  if (req.method === "POST") {
    const { title, content, status, authorEmail } = req.body ?? {};

    if (!title || !content || !authorEmail) {
      return res
        .status(400)
        .json({ error: "title, content, and authorEmail are required" });
    }

    const normalizedStatus = status === "published" ? "published" : "draft";
    const now = Date.now();

    const postsCollection = await getPostsCollection();
    const result = await postsCollection.insertOne({
      title: String(title).trim(),
      content: String(content).trim(),
      status: normalizedStatus,
      authorEmail: String(authorEmail).trim().toLowerCase(),
      commentsCount: 0,
      createdAt: now,
      updatedAt: now,
    });

    const saved = await postsCollection.findOne({ _id: result.insertedId });
    return res.status(201).json({ data: saved });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
