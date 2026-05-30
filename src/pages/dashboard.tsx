import React, { useState, useEffect } from "react";
import LogoutButton from "../components/ui/LogoutButton"; // Uppdatera sökvägen till LogoutButton

export default function Dashboard() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false); // Lägg till en state för att spåra inloggning

  useEffect(() => {
    // Kontrollera om användaren är inloggad när komponenten laddas
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Uppdatera isLoggedIn baserat på om token finns
  }, []);

  // Hantera förändringar i formuläret
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlogPost = async (e: any) => {
    e.preventDefault();

    if (!isLoggedIn) {
      // Användaren är inte inloggad, visa meddelandet
      console.error("Du måste logga in för att kunna skriva ett blogginlägg!");
      return;
    }

    // Hämta token och userId från localStorage
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); // Lägg till detta

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
          Authorization: `Bearer ${token}`, // Lägg till token i headern
        },
        body: JSON.stringify({
          userId, // Inkludera userId i din request
          title: formData.title,
          content: formData.content,
          author: formData.author,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Fel vid skickande av blogginlägg:", errorData.error);
        return;
      }

      // Hantera framgångsrik postning
      const result = await response.json();
      console.log("Blogginlägg skickat:", result);
      setFormData({ title: "", content: "", author: "" }); // Rensa formuläret
    } catch (error) {
      console.error(
        "Ett fel inträffade vid skickande av blogginlägget:",
        error
      );
    }
  };

  const handleLogout = () => {
    // Ta bort token från cache om den finns
    caches.keys().then(function (cacheNames) {
      cacheNames.forEach(function (cacheName) {
        caches.open(cacheName).then(function (cache) {
          cache.keys().then(function (keys) {
            keys.forEach(function (key) {
              if (key.url === "/path/to/token.json") {
                cache.delete(key);
              }
            });
          });
        });
      });
    });

    // Ta bort token från localStorage när användaren loggar ut
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    // Skriv ett meddelande i konsolen när token och cache rensas
    console.log("Token och cache har rensats, användaren har loggat ut");
  };

  return (
    <div>
      <h1>Skapa ett Blogginlägg</h1>
      {!isLoggedIn && (
        <p>Du måste logga in för att kunna skriva ett blogginlägg!</p>
      )}
      {isLoggedIn && <LogoutButton />}{" "}
      {/* Lägg till Logga ut-knappen om inloggad */}
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
        {isLoggedIn && <button type="submit">Skicka</button>}{" "}
        {/* Visa skicka-knappen om inloggad */}
      </form>
    </div>
  );
}
