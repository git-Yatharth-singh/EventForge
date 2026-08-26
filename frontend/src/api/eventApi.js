import api from "./axios";

// GET /events requires authentication (SecurityConfig only permits
// POST /auth/login and POST /users without a JWT).
export async function getEvents() {
  const res = await api.get("/events");
  return res.data;
}

export async function getEvent(id) {
  const res = await api.get(`/events/${id}`);
  return res.data;
}
