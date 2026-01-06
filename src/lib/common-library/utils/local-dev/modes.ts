/**
 * LOCAL_MODE detection
 * Returns true if running on developer's local machine
 * Handles: localhost, 127.0.0.1, ::1 (IPv6), and [::1]
 */
const hostname = window?.location.hostname ?? "";
export const LOCAL_MODE =
  hostname === "localhost" ||
  hostname.startsWith("127.") || // 127.0.0.1, 127.0.0.2, etc
  hostname === "::1" || // IPv6 localhost
  hostname === "[::1]"; // IPv6 localhost with brackets
