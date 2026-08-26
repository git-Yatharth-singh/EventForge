import { jwtDecode } from "jwt-decode";

// The backend's JwtService signs { sub: email, iat, exp } and nothing
// else. We decode client-side only to read the email/expiry — the token
// is never trusted for authorization, only for knowing who's logged in
// and when to proactively clear a stale session.
export function decodeJwt(token) {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  const payload = decodeJwt(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000;
}

export function getEmailFromToken(token) {
  const payload = decodeJwt(token);
  return payload?.sub ?? null;
}
