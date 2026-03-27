export interface VisitorLogEntry {
  id: string;
  ts: string;
  path: string;
  referrer: string;
  userAgent: string;
  language: string;
  viewport: string;
  timezone: string;
}

const LOGS_KEY = "portfolio-visitor-logs";
const ADMIN_SESSION_KEY = "portfolio-visitor-admin-session";
const MAX_LOGS = 500;

function safeParseLogs(value: string | null): VisitorLogEntry[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry) => typeof entry === "object" && entry !== null) as VisitorLogEntry[];
  } catch {
    return [];
  }
}

export function getVisitorLogs(): VisitorLogEntry[] {
  if (typeof window === "undefined") return [];
  return safeParseLogs(localStorage.getItem(LOGS_KEY));
}

export function recordVisit(path: string): void {
  if (typeof window === "undefined") return;

  const now = Date.now();
  const dedupeKey = `${path}::${Math.floor(now / 2000)}`;
  if ((window as Window & { __lastVisitDedupe?: string }).__lastVisitDedupe === dedupeKey) return;
  (window as Window & { __lastVisitDedupe?: string }).__lastVisitDedupe = dedupeKey;

  const entry: VisitorLogEntry = {
    id: `${now}-${Math.random().toString(36).slice(2, 9)}`,
    ts: new Date(now).toISOString(),
    path,
    referrer: document.referrer || "direct",
    userAgent: navigator.userAgent,
    language: navigator.language || "unknown",
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown",
  };

  const logs = getVisitorLogs();
  logs.unshift(entry);
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs.slice(0, MAX_LOGS)));
}

export function clearVisitorLogs(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LOGS_KEY);
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
}

export function setAdminAuthenticated(value: boolean): void {
  if (typeof window === "undefined") return;
  if (value) sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
  else sessionStorage.removeItem(ADMIN_SESSION_KEY);
}
