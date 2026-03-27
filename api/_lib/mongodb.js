import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "portfolio";

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable.");
}

let cachedClient = globalThis.__portfolioMongoClient;

if (!cachedClient) {
  cachedClient = new MongoClient(uri, { maxPoolSize: 10 });
  globalThis.__portfolioMongoClient = cachedClient;
}

export async function getDb() {
  await cachedClient.connect();
  return cachedClient.db(dbName);
}
