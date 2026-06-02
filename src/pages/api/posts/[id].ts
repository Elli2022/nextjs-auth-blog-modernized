import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { getPostsCollection } from "@/lib/mongodb";
import { assertDbConfig } from "@/lib/config";
import { getSessionFromRequest } from "@/lib/session";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    assertDbConfig();
  } catch {
    return res.status(500).json({
      error:
        "Server is not configured yet (missing MONGODB_URI). Add environment variables and redeploy.",
    });
  }

  const sessionUser = getSessionFromRequest(req);
  if (!sessionUser) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const id = String(req.query.id || "");
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid post id" });
  }

  const postsCollection = await getPostsCollection();
  const postId = new ObjectId(id);

  const existing = await postsCollection.findOne({
    _id: postId,
    authorEmail: sessionUser.email,
  });

  if (!existing) {
    return res.status(404).json({ error: "Post not found" });
  }

  if (req.method === "PUT") {
    const { title, content, status } = req.body ?? {};
    if (!title || !content) {
      return res.status(400).json({ error: "title and content are required" });
    }

    const normalizedStatus = status === "published" ? "published" : "draft";
    await postsCollection.updateOne(
      { _id: postId },
      {
        $set: {
          title: String(title).trim(),
          content: String(content).trim(),
          status: normalizedStatus,
          updatedAt: Date.now(),
        },
      }
    );

    const updated = await postsCollection.findOne({ _id: postId });
    return res.status(200).json({ data: updated });
  }

  if (req.method === "DELETE") {
    await postsCollection.deleteOne({ _id: postId });
    return res.status(200).json({ message: "Post deleted" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
