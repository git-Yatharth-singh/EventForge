import api from "./axios";

// POST /booking returns VOID — the backend never sends back a booking id
// or object. It creates a PENDING Booking + BookingSeat rows + a PENDING
// Payment in one transaction. Body must be exactly { eventId, seatIds } —
// never send userId; the backend resolves the user from the JWT.
export async function createBooking(eventId, seatIds) {
  await api.post("/booking", { eventId, seatIds });
}

// GET /booking/{id} — ownership is enforced by the backend on DELETE but
// NOT on this read, so it must only ever be called with an id the current
// user already legitimately knows (e.g. one surfaced via their own
// GET /payment history), never by iterating arbitrary ids in the UI.
export async function getBooking(id) {
  const res = await api.get(`/booking/${id}`);
  return res.data;
}

// DELETE /booking/{id} — backend verifies ownership and that status is
// PENDING before cancelling.
export async function cancelBooking(id) {
  await api.delete(`/booking/${id}`);
}
