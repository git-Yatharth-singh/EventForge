import api from "./axios";

// POST /users is publicly permitted by SecurityConfig. Never send a role —
// the backend assigns USER automatically when role is omitted/null.
export async function signup({ name, email, password }) {
  const res = await api.post("/users", { name, email, password });
  return res.data;
}

// GET /users/email/{email} requires authentication. Returns the full User
// entity (id, name, email, password hash, role) — the password field must
// never be stored or rendered by the UI.
export async function getUserByEmail(email) {
  const res = await api.get(`/users/email/${encodeURIComponent(email)}`);
  // eslint-disable-next-line no-unused-vars
  const { password: _password, ...safeUser } = res.data;
  return safeUser;
}
