import { getDb } from "../_lib/mongodb.js";
import crypto from "node:crypto";

const VISITOR_SOURCE_HEADER = "x-visitor-source";
const VISITOR_SOURCE_VALUE = "browser";

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

function readGeo(req) {
  return {
    country: sanitizeString(req.headers["x-vercel-ip-country"], 64) || sanitizeString(req.headers["cf-ipcountry"], 64) || "unknown",
    region: sanitizeString(req.headers["x-vercel-ip-country-region"], 128) || "unknown",
    city: sanitizeString(req.headers["x-vercel-ip-city"], 128) || "unknown",
    latitude: sanitizeString(req.headers["x-vercel-ip-latitude"], 64) || "",
    longitude: sanitizeString(req.headers["x-vercel-ip-longitude"], 64) || "",
  };
}

function buildVisitorKey(input) {
  return crypto.createHash("sha256").update(input).digest("hex").slice(0, 20);
}

function isTrustedBrowserVisit(req, payload) {
  const source = sanitizeString(req.headers[VISITOR_SOURCE_HEADER], 32).toLowerCase();
  if (source !== VISITOR_SOURCE_VALUE) return false;

  const userAgent = sanitizeString(payload.userAgent, 2048).toLowerCase();
  if (!userAgent || userAgent.includes("vercel")) return false;

  const hasBrowserContext =
    sanitizeString(payload.language, 64) &&
    sanitizeString(payload.viewport, 64) &&
    sanitizeString(payload.timezone, 128);

  return Boolean(hasBrowserContext);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    if (!isTrustedBrowserVisit(req, payload)) {
      return res.status(202).json({ ignored: true });
    }

    const db = await getDb();
    const collection = db.collection("visitor_logs");
    const ip = readClientIp(req);
    const geo = readGeo(req);
    const userAgent = sanitizeString(payload.userAgent, 2048);
    const language = sanitizeString(payload.language, 64);
    const timezone = sanitizeString(payload.timezone, 128);
    const visitorKey = buildVisitorKey(`${ip}|${userAgent}|${language}|${timezone}`);

    const doc = {
      ts: new Date(),
      path: sanitizeString(payload.path, 2048) || "/",
      referrer: sanitizeString(payload.referrer, 2048) || "direct",
      userAgent,
      language,
      viewport: sanitizeString(payload.viewport, 64),
      timezone,
      ip,
      ...geo,
      visitorKey,
    };

    await collection.insertOne(doc);
    return res.status(201).json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Failed to record visit" });
  }
}
