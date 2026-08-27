import { useCallback, useEffect, useState } from "react";
import { getMyPayments } from "../api/paymentApi";
import { getBooking } from "../api/bookingApi";

/**
 * "My Bookings" workaround (documented mismatch, no backend change made):
 * GET /booking returns bookingRepository.findAll() — ALL bookings in the
 * system, not just the current user's, and there is no GET /booking/user/{id}.
 * GET /payment, however, IS filtered to the authenticated user on the
 * backend and every PaymentResponse carries a bookingId. So we derive the
 * current user's bookings from their own payment history: fetch
 * GET /payment, then GET /booking/{id} for each distinct bookingId. This
 * only ever touches bookings the user is already entitled to see, and
 * needs no backend change or invented endpoint. A dedicated
 * GET /booking/user/{id} would be more efficient and is worth adding to
 * the backend, but isn't required for correctness.
 */
export function useMyBookings() {
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const myPayments = await getMyPayments();
      setPayments(myPayments);

      const uniqueBookingIds = [...new Set(myPayments.map((p) => p.bookingId))];
      const fetched = await Promise.all(
        uniqueBookingIds.map((id) =>
          getBooking(id).catch(() => null)
        )
      );

      const paymentByBookingId = new Map(myPayments.map((p) => [p.bookingId, p]));

      const merged = fetched
        .filter(Boolean)
        .map((booking) => ({
          booking,
          payment: paymentByBookingId.get(booking.id) ?? null,
        }))
        .sort(
          (a, b) => new Date(b.booking.createdAt) - new Date(a.booking.createdAt)
        );

      setBookings(merged);
    } catch (err) {
      setError(err?.message ?? "Couldn't load your bookings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { bookings, payments, loading, error, refetch };
}
