// pages/register.tsx
import React, { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Ange din backend-API-endpoint här
    const API_URL = "http://127.0.0.1:3009/api/v1/user";
    // Ändra porten och pathen om nödvändigt

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Ett fel uppstod vid registrering.");
      }

      // Hantera framgångsrikt svar här
      setSuccess("Registrering lyckades! Vänligen logga in.");
      // Omdirigera användaren eller uppdatera state som behövs
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ett oväntat fel inträffade.");
      }
    }
  };

  return (
    <div>
      <h1>Registrera</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Användarnamn"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="E-post"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Lösenord"
          required
        />
        <button type="submit">Registrera</button>
      </form>
    </div>
  );
}
