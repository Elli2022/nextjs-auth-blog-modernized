// src/pages/dashboard.tsx
import React, { useState, useEffect } from "react";
import LogoutButton from "../components/ui/LogoutButton";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBlogPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isLoggedIn) {
      console.error("Du måste logga in för att kunna skriva ett blogginlägg!");
      return;
    }

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token) {
      console.error("Ingen token hittades i localStorage");
      return;
    }

    const API_URL = "http://127.0.0.1:3013/api/v1/user/blog";

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          title: formData.title,
          content: formData.content,
          author: formData.author,
        }),
      });

      if (!response.ok) {
        throw new Error("Fel vid skickande av blogginlägg");
      }

      const result = await response.json();
      console.log("Blogginlägg skickat:", result);
      setFormData({ title: "", content: "", author: "" });
    } catch (error) {
      console.error(
        "Ett fel inträffade vid skickande av blogginlägget:",
        error
      );
    }
  };

  const handleLogout = async () => {
    try {
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }
      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      setIsLoggedIn(false);
      console.log("Utloggning genomförd. Token och cache är rensade.");
      router.push("/signin");
    } catch (error) {
      console.error("Ett fel uppstod under utloggningen:", error);
    }
  };

  return (
    <div>
      <h1>Skapa ett Blogginlägg</h1>
      {!isLoggedIn ? (
        <p>Du måste logga in för att kunna skriva ett blogginlägg!</p>
      ) : (
        <>
          <LogoutButton onLogout={handleLogout} />
          <form onSubmit={handleBlogPost}>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Titel"
              required
            />
            <input
              type="text"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Innehåll"
              required
            />
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Författare"
              required
            />
            <button type="submit">Skicka</button>
          </form>
        </>
      )}
    </div>
  );
}
