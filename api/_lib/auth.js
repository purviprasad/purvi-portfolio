function decodeBasicAuth(headerValue) {
  if (!headerValue || !headerValue.startsWith("Basic ")) return null;
  const encoded = headerValue.slice("Basic ".length).trim();
  try {
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    const separator = decoded.indexOf(":");
    if (separator === -1) return null;
    return {
      username: decoded.slice(0, separator),
      password: decoded.slice(separator + 1),
    };
  } catch {
    return null;
  }
}

export function requireAdminAuth(req, res) {
  const expectedUser = process.env.ANALYTICS_ADMIN_USERNAME;
  const expectedPass = process.env.ANALYTICS_ADMIN_PASSWORD;

  if (!expectedUser || !expectedPass) {
    res.status(500).json({ error: "Missing analytics admin credentials in server env." });
    return false;
  }

  const auth = decodeBasicAuth(req.headers.authorization);
  if (!auth || auth.username !== expectedUser || auth.password !== expectedPass) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Restricted Analytics"');
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}
