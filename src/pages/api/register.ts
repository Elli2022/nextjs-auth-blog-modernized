import type { NextApiRequest, NextApiResponse } from "next";

type User = {
  username: string;
  email: string;
  password: string;
  createdAt: string;
};

const users: User[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, email, password } = req.body ?? {};

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (typeof password !== "string" || password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters" });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const existing = users.find((user) => user.email === normalizedEmail);
  if (existing) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const newUser: User = {
    username: String(username).trim(),
    email: normalizedEmail,
    password: String(password),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  return res.status(201).json({
    message: "Registration successful",
    user: {
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.createdAt,
    },
  });
}
