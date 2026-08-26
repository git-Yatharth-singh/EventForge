import api from "./axios";

export async function getBookingSeats(bookingId) {
  const res = await api.get(`/booking-seats/booking/${bookingId}`);
  return res.data;
}
