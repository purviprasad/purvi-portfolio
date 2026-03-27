import { ObjectId } from "mongodb";
import { requireAdminAuth } from "../_lib/auth.js";
import { getDb } from "../_lib/mongodb.js";

function normalizeLog(doc) {
  return {
    id: doc._id instanceof ObjectId ? doc._id.toString() : String(doc._id),
    ts: doc.ts instanceof Date ? doc.ts.toISOString() : new Date(doc.ts).toISOString(),
    path: doc.path || "/",
    referrer: doc.referrer || "direct",
    userAgent: doc.userAgent || "",
    language: doc.language || "",
    viewport: doc.viewport || "",
    timezone: doc.timezone || "",
    ip: doc.ip || "unknown",
  };
}

export default async function handler(req, res) {
  if (!requireAdminAuth(req, res)) return;

  const db = await getDb();
  const collection = db.collection("visitor_logs");

  if (req.method === "GET") {
    const rawLimit = Number(req.query.limit);
    const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 1000) : 500;
    const docs = await collection.find({}).sort({ ts: -1 }).limit(limit).toArray();
    return res.status(200).json({ logs: docs.map(normalizeLog) });
  }

  if (req.method === "DELETE") {
    await collection.deleteMany({});
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", "GET, DELETE");
  return res.status(405).json({ error: "Method not allowed" });
}
