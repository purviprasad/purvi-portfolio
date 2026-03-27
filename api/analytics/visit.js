import { getDb } from "../_lib/mongodb.js";

function readClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers["x-real-ip"];
  if (typeof realIp === "string") return realIp;
  return "unknown";
}

function sanitizeString(input, maxLen) {
  if (typeof input !== "string") return "";
  return input.slice(0, maxLen);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const db = await getDb();
    const collection = db.collection("visitor_logs");

    const doc = {
      ts: new Date(),
      path: sanitizeString(payload.path, 2048) || "/",
      referrer: sanitizeString(payload.referrer, 2048) || "direct",
      userAgent: sanitizeString(payload.userAgent, 2048),
      language: sanitizeString(payload.language, 64),
      viewport: sanitizeString(payload.viewport, 64),
      timezone: sanitizeString(payload.timezone, 128),
      ip: readClientIp(req),
    };

    await collection.insertOne(doc);
    return res.status(201).json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Failed to record visit" });
  }
}
