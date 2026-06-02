import crypto from "crypto";
import sanitizeHtml from "sanitize-html";
import { assertDbConfig } from "./config";
import { getUsersCollection } from "./mongodb";

type RegisterInput = {
  username: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

function sanitize(value: string) {
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} });
}

function isEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function hashPassword(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function registerUser(input: RegisterInput) {
  assertDbConfig();

  const username = sanitize(input.username?.trim() || "");
  const email = sanitize(input.email?.trim().toLowerCase() || "");
  const password = input.password || "";

  if (!username) throw new Error("missing parameter: username");
  if (!password) throw new Error("missing parameter: password");
  if (!email || !isEmail(email)) throw new Error("invalid email");
  if (password.length < 6) throw new Error("password must be at least 6 characters");

  const users = await getUsersCollection();
  const existing = await users.findOne({ $or: [{ username }, { email }] });

  if (existing) {
    throw new Error("user already exists");
  }

  const now = Date.now();
  const user = {
    username,
    email,
    password: hashPassword(password),
    role: "user",
    created: now,
    modified: now,
  };

  const result = await users.insertOne(user);
  const saved = await users.findOne({ _id: result.insertedId });

  if (!saved) {
    throw new Error("failed to persist user");
  }

  const { password: _password, ...safeUser } = saved;
  return safeUser;
}

export async function loginUser(input: LoginInput) {
  assertDbConfig();

  const email = sanitize(input.email?.trim().toLowerCase() || "");
  const password = input.password || "";

  if (!email || !isEmail(email)) throw new Error("invalid email");
  if (!password) throw new Error("missing parameter: password");

  const users = await getUsersCollection();
  const user = await users.findOne({ email });

  if (!user) {
    throw new Error("user not found");
  }

  const hashedPassword = hashPassword(password);
  if (user.password !== hashedPassword) {
    throw new Error("incorrect password");
  }

  const token = crypto.randomBytes(32).toString("hex");
  const { password: _password, ...safeUser } = user;

  return { token, user: safeUser };
}
