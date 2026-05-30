import React, { useState } from "react";
import Link from "next/link";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setError("");

    const API_URL = "http://127.0.0.1:3013/api/v1/user";

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
        setError(result.data || "Ett fel uppstod vid registrering.");
      } else {
        setIsRegistered(true);
      }
    } catch (error) {
      setError("Ett oväntat fel inträffade.");
    }
  };

  return (
    <div>
      {isRegistered ? (
        <div>
          <h1>Välkommen, {formData.username}!</h1>
          <p>Vill du logga in?</p>
          <Link href="/signin">Sign In</Link>
        </div>
      ) : (
        <>
          <h1>Registrera</h1>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleRegister}>
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
        </>
      )}
    </div>
  );
}
