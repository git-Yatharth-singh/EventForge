import api from "./axios";

// GET /payment is already filtered to the authenticated user's email on
// the backend (PaymentService#allPayment). This is the only user-scoped
// list endpoint the backend exposes, so it doubles as the source of truth
// for "My Bookings" — see bookingApi's getMyBookings-style usage in
// hooks/useMyBookings.js.
export async function getMyPayments() {
  const res = await api.get("/payment");
  return res.data; // PaymentResponse[]: { id, status, amount, bookingId }
}

export async function getPayment(id) {
  const res = await api.get(`/payment/${id}`);
  return res.data;
}

export async function getPaymentsForBooking(bookingId) {
  const res = await api.get(`/payment/booking/${bookingId}`);
  return res.data;
}

export async function payPayment(id) {
  await api.post(`/payment/${id}/pay`);
}

export async function failPayment(id) {
  await api.post(`/payment/${id}/fail`);
}

export async function cancelPayment(id) {
  await api.post(`/payment/${id}/cancel`);
}
