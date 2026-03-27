import React, { useEffect, useState } from "react";
import {
  clearVisitorLogs,
  fetchVisitorLogs,
  isAdminAuthenticated,
  loginVisitorAdmin,
  setAdminAuthenticated,
  type VisitorLogEntry,
} from "../utils/visitorAnalytics";

type VisitorGroup = {
  key: string;
  visitorKey: string;
  logs: VisitorLogEntry[];
  latest: VisitorLogEntry;
  location: string;
  paths: string[];
};

const tableHeaders = ["Visitor", "Last Seen", "Location", "Hits", "Paths", "IP", "Timezone", "User Agent"];

const skeletonWidths = ["w-28", "w-24", "w-28", "w-12", "w-32", "w-20", "w-24", "w-40"];

function formatLocation(log: VisitorLogEntry): string {
  return [log.city, log.region, log.country].filter(Boolean).join(", ") || "unknown";
}

function buildGroupKey(log: VisitorLogEntry): string {
  return log.visitorKey || `${log.ip || "unknown"}|${log.userAgent}|${log.language}|${log.timezone}`;
}

function groupLogsByVisitor(logs: VisitorLogEntry[]): VisitorGroup[] {
  const groups = new Map<string, VisitorLogEntry[]>();

  for (const log of logs) {
    const key = buildGroupKey(log);
    const current = groups.get(key);
    if (current) {
      current.push(log);
    } else {
      groups.set(key, [log]);
    }
  }

  return Array.from(groups.entries()).map(([key, visitorLogs]) => {
    const sortedLogs = [...visitorLogs].sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
    const latest = sortedLogs[0];
    const paths = Array.from(new Set(sortedLogs.map((log) => log.path))).slice(0, 3);

    return {
      key,
      visitorKey: latest.visitorKey || "-",
      logs: sortedLogs,
      latest,
      location: formatLocation(latest),
      paths,
    };
  });
}

const VisitorLogsPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState<boolean>(() => isAdminAuthenticated());
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<VisitorLogEntry[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  useEffect(() => {
    if (!auth) return;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchVisitorLogs();
        setLogs(data);
      } catch {
        setError("Unable to fetch logs. Please login again.");
        setAdminAuthenticated(false);
        setAuth(false);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [auth]);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await loginVisitorAdmin(username, password);
    if (ok) {
      setAuth(true);
      setError("");
      setLoading(false);
      return;
    }
    setLoading(false);
    setError("Invalid username or password.");
  };

  const onLogout = () => {
    setAdminAuthenticated(false);
    setAuth(false);
    setUsername("");
    setPassword("");
  };

  const onClear = async () => {
    setLoading(true);
    try {
      await clearVisitorLogs();
      const fresh = await fetchVisitorLogs();
      setLogs(fresh);
      setError("");
    } catch {
      setError("Failed to clear logs.");
    } finally {
      setLoading(false);
    }
  };

  const onExport = () => {
    const data = JSON.stringify(logs, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `visitor-logs-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const showTableSkeleton = loading && logs.length === 0;
  const groupedLogs = groupLogsByVisitor(logs);

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((current) => (current.includes(groupKey) ? current.filter((key) => key !== groupKey) : [...current, groupKey]));
  };

  if (!auth) {
    return (
      <main className="min-h-screen px-4 py-20 flex items-center justify-center">
        <form onSubmit={onLogin} className="w-full max-w-sm glass-card rounded-2xl p-6 border border-[var(--border)]">
          <h1 className="text-xl font-bold text-[var(--text)] mb-4">Restricted Analytics</h1>
          <div className="space-y-3">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 outline-none"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 outline-none"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[var(--brand)] text-white font-semibold py-2.5 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </div>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 sm:px-6 py-10 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--text)]">Visitor Analytics Logs</h1>
        <div className="flex gap-2">
          <button type="button" onClick={onExport} className="px-3 py-2 rounded-lg border border-[var(--border)]">
            Export JSON
          </button>
          <button type="button" disabled={loading} onClick={onClear} className="px-3 py-2 rounded-lg border border-[var(--border)] disabled:opacity-60">
            Clear Logs
          </button>
          <button type="button" onClick={onLogout} className="px-3 py-2 rounded-lg bg-[var(--brand)] text-white">
            Logout
          </button>
        </div>
      </div>

      <p className="text-sm text-[var(--muted)] mb-2">
        Entries stored in MongoDB. Total records: {logs.length} across {groupedLogs.length} visitors.
      </p>
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg)] border-b border-[var(--border)]">
            <tr className="text-left">
              {tableHeaders.map((header) => (
                <th key={header} className="p-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {showTableSkeleton &&
              Array.from({ length: 6 }, (_, rowIndex) => (
                <tr key={`skeleton-${rowIndex}`} className="border-b border-[var(--border)] align-top animate-pulse">
                  {skeletonWidths.map((widthClass, cellIndex) => (
                    <td key={`${rowIndex}-${cellIndex}`} className="p-3">
                      <div className={`h-4 rounded bg-[color:color-mix(in_srgb,var(--border)_75%,transparent)] ${widthClass}`} />
                    </td>
                  ))}
                </tr>
              ))}
            {groupedLogs.map((group) => {
              const isExpanded = expandedGroups.includes(group.key);

              return (
                <React.Fragment key={group.key}>
                  <tr className="border-b border-[var(--border)] align-top">
                    <td className="p-3 min-w-[180px]">
                      <button
                        type="button"
                        onClick={() => toggleGroup(group.key)}
                        className="flex items-start gap-3 text-left"
                      >
                        <span className="mt-0.5 text-[var(--muted)]">{isExpanded ? "−" : "+"}</span>
                        <div>
                          <div className="font-mono text-xs whitespace-nowrap">{group.visitorKey}</div>
                          <div className="text-xs text-[var(--muted)]">{isExpanded ? "Hide individual hits" : "Show individual hits"}</div>
                        </div>
                      </button>
                    </td>
                    <td className="p-3 whitespace-nowrap">{new Date(group.latest.ts).toLocaleString()}</td>
                    <td className="p-3 whitespace-nowrap">{group.location}</td>
                    <td className="p-3 whitespace-nowrap font-semibold">{group.logs.length}</td>
                    <td className="p-3">
                      <div className="max-w-[240px] truncate" title={group.logs.map((log) => log.path).join(", ")}>
                        {group.paths.join(", ")}
                        {group.logs.length > group.paths.length ? " ..." : ""}
                      </div>
                    </td>
                    <td className="p-3 whitespace-nowrap">{group.latest.ip || "-"}</td>
                    <td className="p-3 whitespace-nowrap">{group.latest.timezone}</td>
                    <td className="p-3 max-w-[320px] truncate" title={group.latest.userAgent}>
                      {group.latest.userAgent}
                    </td>
                  </tr>
                  {isExpanded &&
                    group.logs.map((log) => (
                      <tr key={log.id} className="border-b border-[var(--border)]/60 bg-[var(--bg)]/40 align-top text-xs text-[var(--muted)]">
                        <td className="p-3 pl-12">
                          <div className="font-mono">{log.visitorKey || "-"}</div>
                        </td>
                        <td className="p-3 whitespace-nowrap">{new Date(log.ts).toLocaleString()}</td>
                        <td className="p-3 whitespace-nowrap">{formatLocation(log)}</td>
                        <td className="p-3 whitespace-nowrap">1</td>
                        <td className="p-3 whitespace-nowrap">{log.path}</td>
                        <td className="p-3 whitespace-nowrap">{log.ip || "-"}</td>
                        <td className="p-3 whitespace-nowrap">{log.timezone}</td>
                        <td className="p-3 max-w-[320px] truncate" title={`${log.referrer} | ${log.viewport} | ${log.userAgent}`}>
                          {log.referrer} • {log.viewport}
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              );
            })}
            {!showTableSkeleton && logs.length === 0 && (
              <tr>
                <td className="p-6 text-[var(--muted)]" colSpan={tableHeaders.length}>
                  No logs yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default VisitorLogsPage;
