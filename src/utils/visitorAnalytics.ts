export interface VisitorLogEntry {
  id: string;
  ts: string;
  path: string;
  referrer: string;
  userAgent: string;
  language: string;
  viewport: string;
  timezone: string;
  ip?: string;
}

const ADMIN_SESSION_KEY = "portfolio-visitor-admin-session";
const ADMIN_AUTH_TOKEN_KEY = "portfolio-visitor-admin-auth-token";

function buildBasicAuthToken(username: string, password: string): string {
  return btoa(`${username}:${password}`);
}

function getStoredAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(ADMIN_AUTH_TOKEN_KEY);
}

export async function fetchVisitorLogs(limit = 500): Promise<VisitorLogEntry[]> {
  const token = getStoredAuthToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(`/api/analytics/logs?limit=${limit}`, {
    headers: { Authorization: `Basic ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch logs");
  const data = (await res.json()) as { logs?: VisitorLogEntry[] };
  return Array.isArray(data.logs) ? data.logs : [];
}

export async function recordVisit(path: string): Promise<void> {
  if (typeof window === "undefined") return;

  const now = Date.now();
  const dedupeKey = `${path}::${Math.floor(now / 2000)}`;
  if ((window as Window & { __lastVisitDedupe?: string }).__lastVisitDedupe === dedupeKey) return;
  (window as Window & { __lastVisitDedupe?: string }).__lastVisitDedupe = dedupeKey;

  const payload = {
    path,
    referrer: document.referrer || "direct",
    userAgent: navigator.userAgent,
    language: navigator.language || "unknown",
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown",
  };

  try {
    await fetch("/api/analytics/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Best-effort analytics; never block page usage.
  }
}

export async function clearVisitorLogs(): Promise<void> {
  const token = getStoredAuthToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch("/api/analytics/logs", {
    method: "DELETE",
    headers: { Authorization: `Basic ${token}` },
  });
  if (!res.ok) throw new Error("Failed to clear logs");
}

export async function loginVisitorAdmin(username: string, password: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const token = buildBasicAuthToken(username, password);
  const res = await fetch("/api/analytics/logs?limit=1", {
    headers: { Authorization: `Basic ${token}` },
  });
  if (!res.ok) return false;
  sessionStorage.setItem(ADMIN_AUTH_TOKEN_KEY, token);
  setAdminAuthenticated(true);
  return true;
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "1" && !!sessionStorage.getItem(ADMIN_AUTH_TOKEN_KEY);
}

export function setAdminAuthenticated(value: boolean): void {
  if (typeof window === "undefined") return;
  if (value) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
    return;
  }
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  sessionStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
}
