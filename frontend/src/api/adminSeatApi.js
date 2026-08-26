import api from "./axios";

// POST /seats takes SeatRequest { seatNo, price, eventId }.
export async function adminCreateSeat({ seatNo, price, eventId }) {
  await api.post("/seats", { seatNo, price, eventId });
}

// IMPORTANT: SeatService#updateSeat only ever applies seatNo from the PUT
// body — price and event are silently ignored on update, by backend
// design. The admin UI only exposes seat-number editing; changing a
// seat's price requires deleting and re-creating it.
export async function adminUpdateSeatNumber(id, seatNo) {
  await api.put(`/seats/${id}`, { seatNo });
}

export async function adminDeleteSeat(id) {
  await api.delete(`/seats/${id}`);
}
