import { FormEvent, useMemo, useState } from "react";
import type { GetServerSideProps } from "next";
import { getPostsCollection } from "@/lib/mongodb";
import { assertDbConfig } from "@/lib/config";
import {
  getSessionFromRequest,
  requireSessionRedirect,
  type SessionUser,
} from "@/lib/session";
import FormAlert from "@/components/FormAlert";

type Post = {
  _id: string;
  title: string;
  content: string;
  status: "draft" | "published";
  commentsCount?: number;
};

type DashboardProps = {
  user: SessionUser;
  initialPosts: Post[];
};

export default function Dashboard({ user, initialPosts }: DashboardProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState<"success" | "error" | "info">(
    "info"
  );

  function showAlert(text: string, variant: "success" | "error" | "info") {
    setMessage(text);
    setAlertVariant(variant);
  }

  async function fetchPosts() {
    const response = await fetch("/api/posts");
    if (response.status === 401) {
      window.location.href = "/signin";
      return;
    }
    const payload = await response.json();
    if (response.ok) {
      setPosts(payload.data ?? []);
    } else {
      showAlert(payload.error ?? "Could not load posts", "error");
    }
  }

  function resetComposer() {
    setTitle("");
    setContent("");
    setStatus("draft");
    setEditingId(null);
  }

  function startEdit(post: Post) {
    setEditingId(post._id);
    setTitle(post.title);
    setContent(post.content);
    setStatus(post.status);
    showAlert("Editing post — save to apply changes.", "info");
  }

  async function handleSubmitPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const isEditing = Boolean(editingId);
      const response = await fetch(
        isEditing ? `/api/posts/${editingId}` : "/api/posts",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, status }),
        }
      );
      const payload = await response.json();

      if (!response.ok) {
        showAlert(payload.error ?? "Could not save post", "error");
        return;
      }

      resetComposer();
      showAlert(isEditing ? "Post updated" : "Post created", "success");
      await fetchPosts();
    } catch {
      showAlert("Unexpected error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePost(postId: string) {
    const confirmed = window.confirm("Delete this post permanently?");
    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      const payload = await response.json();
      if (!response.ok) {
        showAlert(payload.error ?? "Could not delete post", "error");
        return;
      }
      if (editingId === postId) resetComposer();
      showAlert("Post deleted", "success");
      await fetchPosts();
    } catch {
      showAlert("Unexpected error. Please try again.", "error");
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
          Welcome {user.username}. Create, edit, and publish your posts below.
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
          onSubmit={handleSubmitPost}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <h2 className="text-xl font-semibold">
            {editingId ? "Edit post" : "Write a post"}
          </h2>
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
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {loading
                  ? "Saving..."
                  : editingId
                    ? "Update post"
                    : "Save post"}
              </button>
              {editingId ? (
                <button
                  type="button"
                  onClick={resetComposer}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
              ) : null}
            </div>
            {message ? (
              <FormAlert message={message} variant={alertVariant} />
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
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold">{post.title}</h3>
                    <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {post.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {post.content}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(post)}
                      className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePost(post._id)}
                      className="rounded-md bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/40"
                    >
                      Delete
                    </button>
                  </div>
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
    const session = getSessionFromRequest(req);
    if (!session) return requireSessionRedirect();

    const postsCollection = await getPostsCollection();
    const posts = await postsCollection
      .find({ authorEmail: session.email })
      .sort({ createdAt: -1 })
      .toArray();

    return {
      props: {
        user: session,
        initialPosts: JSON.parse(JSON.stringify(posts)),
      },
    };
  } catch {
    return requireSessionRedirect();
  }
};
