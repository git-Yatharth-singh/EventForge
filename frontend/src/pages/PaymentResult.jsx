import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, Clock4 } from "lucide-react";
import { getBooking } from "../api/bookingApi";
import { getBookingSeats } from "../api/bookingSeatApi";
import { formatDateTime, formatPrice } from "../utils/format";

const VARIANTS = {
  success: {
    icon: CheckCircle2,
    color: "var(--emerald)",
    title: "Booking Confirmed",
    body: "Your seats are locked in — see you there.",
  },
  failure: {
    icon: XCircle,
    color: "var(--rose)",
    title: "Payment Failed",
    body: "Your reservation has been released. Nothing was charged.",
  },
  cancelled: {
    icon: XCircle,
    color: "var(--text-muted)",
    title: "Payment Cancelled",
    body: "Your seat hold has been released.",
  },
  expired: {
    icon: Clock4,
    color: "var(--amber)",
    title: "Reservation Expired",
    body: "Your 10-minute reservation window has ended.",
  },
};

export default function PaymentResult({ variant }) {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const resolvedVariant = variant === "failure" && state.reason === "CANCELLED" ? "cancelled" : variant;
  const meta = VARIANTS[resolvedVariant] ?? VARIANTS.failure;
  const Icon = meta.icon;

  const [booking, setBooking] = useState(null);
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    if (!state.bookingId) return;
    getBooking(state.bookingId).then(setBooking).catch(() => {});
    getBookingSeats(state.bookingId).then(setSeats).catch(() => {});
  }, [state.bookingId]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md text-center ef-fade-up">
        <Icon size={48} color={meta.color} className="mx-auto mb-5" />
        <h1 className="font-display text-2xl font-semibold mb-2">{meta.title}</h1>
        <p className="text-[var(--text-muted)] mb-8">{meta.body}</p>

        {resolvedVariant === "success" && booking && (
          <div className="ef-ticket-notch text-left rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-6 mb-8">
            <Row label="Booking ID" value={`#${String(booking.id).padStart(4, "0")}`} mono />
            <Row label="Event" value={booking.event?.name} />
            <Row label="Date" value={formatDateTime(booking.event?.startTime)} />
            <Row label="Venue" value={booking.event?.venue?.name} />
            <Row label="Seats" value={seats.map((s) => s.seat.seatNo).join(", ") || "—"} mono />
            <div className="ef-dashed pt-3 mt-1 flex items-center justify-between">
              <span className="text-sm text-[var(--text-muted)]">Amount paid</span>
              <span className="font-mono text-lg font-semibold">{formatPrice(booking.totalAmount)}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {resolvedVariant === "success" && booking && (
            <button
              onClick={() => navigate(`/bookings/${booking.id}`)}
              className="px-6 py-2.5 rounded-full bg-[var(--violet)] hover:bg-[var(--violet-2)] transition-colors font-medium"
            >
              View Booking
            </button>
          )}
          {resolvedVariant === "expired" && (
            <Link
              to="/events"
              className="px-6 py-2.5 rounded-full bg-[var(--violet)] hover:bg-[var(--violet-2)] transition-colors font-medium"
            >
              Choose Seats Again
            </Link>
          )}
          {(resolvedVariant === "failure" || resolvedVariant === "cancelled") && (
            <Link
              to="/events"
              className="px-6 py-2.5 rounded-full bg-[var(--violet)] hover:bg-[var(--violet-2)] transition-colors font-medium"
            >
              Try Another Event
            </Link>
          )}
          <Link
            to="/events"
            className="px-6 py-2.5 rounded-full border border-[var(--border-strong)] hover:bg-[var(--surface)] transition-colors font-medium"
          >
            Back to Events
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, mono }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-[var(--text-muted)]">{label}</span>
      <span className={mono ? "font-mono" : "font-medium"}>{value ?? "—"}</span>
    </div>
  );
}
