import { Db, MongoClient } from "mongodb";
import { dbConfig } from "./config";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  if (!dbConfig.dbUri) {
    return Promise.reject(new Error("MONGODB_URI is not configured"));
  }

  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(dbConfig.dbUri).connect();
  }

  return global._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(dbConfig.dbName);
}

export async function getUsersCollection() {
  const db = await getDb();
  return db.collection(dbConfig.dbColl);
}

export async function getPostsCollection() {
  const db = await getDb();
  return db.collection("blogPosts");
}
