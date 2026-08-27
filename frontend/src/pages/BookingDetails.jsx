import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { getBooking, cancelBooking } from "../api/bookingApi";
import { getBookingSeats } from "../api/bookingSeatApi";
import { getPaymentsForBooking } from "../api/paymentApi";
import StatusBadge from "../components/StatusBadge";
import DetailSkeleton from "../components/skeletons/DetailSkeleton";
import ErrorState from "../components/ErrorState";
import { formatDateTime, formatPrice } from "../utils/format";

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [seats, setSeats] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [actionError, setActionError] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const b = await getBooking(id);
      setBooking(b);
      const [s, p] = await Promise.all([
        getBookingSeats(id),
        getPaymentsForBooking(id),
      ]);
      setSeats(s);
      setPayments(p);
    } catch (err) {
      setError(err?.message ?? "We couldn't find that booking.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(load, [id]);

  const handleCancel = async () => {
    setCancelling(true);
    setActionError("");
    try {
      await cancelBooking(id);
      await load();
    } catch (err) {
      setActionError(err?.message ?? "Couldn't cancel this booking.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <DetailSkeleton />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!booking) return null;

  const status = booking.Status ?? booking.status;
  const latestPayment = payments[payments.length - 1];
  const event = booking.event;

  return (
    <div className="max-w-2xl mx-auto px-5 py-14 ef-fade-up">
      <Link to="/bookings" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] mb-8">
        <ArrowLeft size={14} /> Back to my bookings
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <span className="font-mono text-xs text-[var(--text-faint)]">
            BOOKING #{String(booking.id).padStart(4, "0")}
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold mt-1">{event?.name}</h1>
        </div>
        <StatusBadge status={status} />
      </div>

      {actionError && (
        <p className="text-sm text-[var(--rose)] bg-[rgba(251,107,107,0.08)] border border-[rgba(251,107,107,0.2)] rounded-lg px-4 py-3 mb-6">
          {actionError}
        </p>
      )}

      <div className="ef-ticket-notch rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-6 mb-6">
        <div className="flex flex-col gap-1.5 text-sm text-[var(--text-muted)] mb-5">
          <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} /> {formatDateTime(event?.startTime)}</span>
          <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> {event?.venue?.name}{event?.venue?.location ? `, ${event.venue.location}` : ""}</span>
        </div>

        <div className="ef-dashed pt-4">
          {seats.map((bs) => (
            <div key={bs.id} className="flex items-center justify-between py-1.5 text-sm">
              <span className="font-mono">Seat {bs.seat.seatNo}</span>
              <span className="font-mono text-[var(--text-muted)]">{formatPrice(bs.seat.price)}</span>
            </div>
          ))}
        </div>

        <div className="ef-dashed pt-4 mt-2 flex items-center justify-between">
          <span className="text-sm text-[var(--text-muted)]">Total</span>
          <span className="font-mono text-xl font-semibold">{formatPrice(booking.totalAmount)}</span>
        </div>
      </div>

      {latestPayment && (
        <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5 mb-6 flex items-center justify-between">
          <span className="text-sm text-[var(--text-muted)]">Payment status</span>
          <StatusBadge status={latestPayment.status} />
        </div>
      )}

      <div className="flex gap-3">
        {status === "PENDING" && latestPayment && (
          <button
            onClick={() => navigate(`/checkout/${latestPayment.id}`)}
            className="px-6 py-2.5 rounded-full bg-[var(--violet)] hover:bg-[var(--violet-2)] transition-colors font-medium"
          >
            Continue Payment
          </button>
        )}
        {status === "PENDING" && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="px-6 py-2.5 rounded-full border border-[var(--border-strong)] hover:bg-[var(--surface-2)] transition-colors font-medium disabled:opacity-60"
          >
            {cancelling ? "Cancelling…" : "Cancel Booking"}
          </button>
        )}
      </div>
    </div>
  );
}
