import { FormEvent, useMemo, useState } from "react";
import type { GetServerSideProps } from "next";
import { getPostsCollection } from "@/lib/mongodb";
import { assertAuthConfig, assertDbConfig, jwtSecret } from "@/lib/config";
import { getSessionCookieName, verifySessionToken } from "@/lib/auth";

type Post = {
  _id: string;
  title: string;
  content: string;
  status: "draft" | "published";
  commentsCount?: number;
};

type AuthUser = {
  email: string;
  username: string;
};

type DashboardProps = {
  user: AuthUser;
  initialPosts: Post[];
};

export default function Dashboard({ user, initialPosts }: DashboardProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function fetchPosts() {
    const response = await fetch("/api/posts");
    const payload = await response.json();
    if (response.ok) {
      setPosts(payload.data ?? []);
    }
  }

  async function handleCreatePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          status,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setMessage(payload.error ?? "Could not create post");
        return;
      }
      setTitle("");
      setContent("");
      setStatus("draft");
      setMessage("Post saved");
      await fetchPosts();
    } finally {
      setLoading(false);
    }
  }

  const stats = useMemo(() => {
    const totalPosts = posts.length;
    const drafts = posts.filter((post) => post.status === "draft").length;
    const published = posts.filter((post) => post.status === "published").length;
    const comments = posts.reduce(
      (acc, post) => acc + Number(post.commentsCount || 0),
      0
    );
    return { totalPosts, drafts, published, comments };
  }, [posts]);

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {`Welcome ${user.username}. Create and manage your own posts below.`}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Posts", value: String(stats.totalPosts) },
          { title: "Drafts", value: String(stats.drafts) },
          { title: "Published", value: String(stats.published) },
          { title: "Comments", value: String(stats.comments) },
        ].map((card) => (
          <article
            key={card.title}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {card.title}
            </p>
            <p className="mt-2 text-2xl font-semibold">{card.value}</p>
          </article>
        ))}
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={handleCreatePost}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <h2 className="text-xl font-semibold">Write a post</h2>
          <div className="mt-4 space-y-4">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Post title"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-blue-300 transition focus:ring dark:border-slate-700 dark:bg-slate-950"
              required
            />
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Write your post content..."
              className="min-h-40 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-blue-300 transition focus:ring dark:border-slate-700 dark:bg-slate-950"
              required
            />
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as "draft" | "published")
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-blue-300 transition focus:ring dark:border-slate-700 dark:bg-slate-950"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              {loading ? "Saving..." : "Save post"}
            </button>
            {message ? (
              <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>
            ) : null}
          </div>
        </form>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold">Your posts</h2>
          <div className="mt-4 space-y-3">
            {posts.length ? (
              posts.map((post) => (
                <article
                  key={post._id}
                  className="rounded-lg border border-slate-200 p-4 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-semibold">{post.title}</h3>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {post.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {post.content}
                  </p>
                </article>
              ))
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-300">
                No posts yet. Create your first draft on the left.
              </p>
            )}
          </div>
        </section>
      </section>
    </section>
  );
}

export const getServerSideProps: GetServerSideProps<DashboardProps> = async ({
  req,
}) => {
  try {
    assertDbConfig();
    assertAuthConfig();

    const token = req.cookies[getSessionCookieName()];
    if (!token) {
      return { redirect: { destination: "/signin", permanent: false } };
    }

    const user = verifySessionToken(token, jwtSecret);
    const postsCollection = await getPostsCollection();
    const posts = await postsCollection
      .find({ authorEmail: user.email })
      .sort({ createdAt: -1 })
      .toArray();

    return {
      props: {
        user,
        initialPosts: JSON.parse(JSON.stringify(posts)),
      },
    };
  } catch (error) {
    return { redirect: { destination: "/signin", permanent: false } };
  }
};
