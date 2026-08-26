import api from "./axios";

// POST /auth/login — backend returns the JWT as a RAW STRING body,
// not { token: "..." }. Axios gives us that string directly as response.data.
export async function login(email, password) {
  const res = await api.post("/auth/login", { email, password });
  return res.data; // raw JWT string
}
