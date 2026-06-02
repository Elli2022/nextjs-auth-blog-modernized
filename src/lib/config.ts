export const dbConfig = {
  dbName: process.env.MONGODB_DB_NAME || "nextjs_auth_blog_db",
  dbUri: process.env.MONGODB_URI || process.env.MONGODB_DB_URL || "",
  dbColl: process.env.MONGODB_COLLECTION || "users",
};

export const jwtSecret = process.env.JWT_SECRET || "";

export function assertDbConfig() {
  if (!dbConfig.dbUri) {
    throw new Error("MONGODB_URI is not configured");
  }
}

export function assertAuthConfig() {
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }
}
