export const dbConfig = {
  dbName: process.env.MONGODB_DB_NAME || "db_my_app",
  dbUri: process.env.MONGODB_URI || process.env.MONGODB_DB_URL || "",
  dbColl: process.env.MONGODB_COLLECTION || "coll_users",
};

export function assertDbConfig() {
  if (!dbConfig.dbUri) {
    throw new Error("MONGODB_URI is not configured");
  }
}
