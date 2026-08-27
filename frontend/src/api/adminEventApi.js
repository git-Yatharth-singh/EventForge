import api from "./axios";

// Admin CRUD for events. Not authorization-restricted by the backend today
// (SecurityConfig doesn't enforce ADMIN on these routes) — access is gated
// only in this frontend. See README for details.
export async function adminCreateEvent({ name, description, startTime, endTime, venueId }) {
  await api.post("/events", {
    name,
    description,
    startTime,
    endTime,
    venue: { id: venueId },
  });
}

export async function adminUpdateEvent(id, { name, description, startTime, endTime, venueId }) {
  await api.put(`/events/${id}`, {
    name,
    description,
    startTime,
    endTime,
    venue: { id: venueId },
  });
}

export async function adminDeleteEvent(id) {
  await api.delete(`/events/${id}`);
}
