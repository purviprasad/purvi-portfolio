import React, { useEffect, useState } from "react";
import {
  clearVisitorLogs,
  fetchVisitorLogs,
  isAdminAuthenticated,
  loginVisitorAdmin,
  setAdminAuthenticated,
  type VisitorLogEntry,
} from "../utils/visitorAnalytics";

const VisitorLogsPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState<boolean>(() => isAdminAuthenticated());
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<VisitorLogEntry[]>([]);

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

      <p className="text-sm text-[var(--muted)] mb-2">Entries stored in MongoDB. Total records: {logs.length}</p>
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg)] border-b border-[var(--border)]">
            <tr className="text-left">
              <th className="p-3">Time</th>
              <th className="p-3">Path</th>
              <th className="p-3">Referrer</th>
              <th className="p-3">Viewport</th>
              <th className="p-3">Language</th>
              <th className="p-3">Timezone</th>
              <th className="p-3">User Agent</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-[var(--border)] align-top">
                <td className="p-3 whitespace-nowrap">{new Date(log.ts).toLocaleString()}</td>
                <td className="p-3 whitespace-nowrap">{log.path}</td>
                <td className="p-3 max-w-[220px] truncate" title={log.referrer}>
                  {log.referrer}
                </td>
                <td className="p-3 whitespace-nowrap">{log.viewport}</td>
                <td className="p-3 whitespace-nowrap">{log.language}</td>
                <td className="p-3 whitespace-nowrap">{log.timezone}</td>
                <td className="p-3 max-w-[320px] truncate" title={log.userAgent}>
                  {log.userAgent}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td className="p-6 text-[var(--muted)]" colSpan={7}>
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
