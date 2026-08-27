import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CalendarDays, MapPin, Timer, ShieldCheck } from "lucide-react";
import { getPayment, payPayment, cancelPayment, failPayment } from "../api/paymentApi";
import { getBooking } from "../api/bookingApi";
import { getBookingSeats } from "../api/bookingSeatApi";
import DetailSkeleton from "../components/skeletons/DetailSkeleton";
import ErrorState from "../components/ErrorState";
import { formatDateTime, formatPrice, formatCountdown } from "../utils/format";

const HOLD_MINUTES = 10;

export default function Checkout() {
  const { paymentId } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [booking, setBooking] = useState(null);
  const [bookingSeats, setBookingSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState("");
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(Date.now());

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const p = await getPayment(paymentId);
      setPayment(p);

      if (p.status !== "PENDING") {
        routeForStatus(p.status, p, navigate);
        return;
      }

      const b = await getBooking(p.bookingId);
      setBooking(b);
      const seats = await getBookingSeats(b.id);
      setBookingSeats(seats);
    } catch (err) {
      setError(err?.message ?? "Couldn't load your checkout.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const deadline = useMemo(() => {
    if (!booking?.createdAt) return null;
    return new Date(booking.createdAt).getTime() + HOLD_MINUTES * 60 * 1000;
  }, [booking]);

  const msRemaining = deadline ? deadline - now : null;
  const isVisuallyExpired = msRemaining != null && msRemaining <= 0;

  const runAction = async (apiCall) => {
    setBusy(true);
    setActionError("");
    try {
      await apiCall(payment.id);
      // These endpoints are silent no-ops if the payment already left
      // PENDING (e.g. the backend's 60s job expired it first) — so we
      // always re-fetch the real status instead of assuming success.
      const fresh = await getPayment(payment.id);
      setPayment(fresh);
      routeForStatus(fresh.status, fresh, navigate);
    } catch (err) {
      setActionError(err?.message ?? "That action didn't go through. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <DetailSkeleton />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!payment || !booking) return null;

  const event = booking.event;
  const totalSeats = bookingSeats.length;

  return (
    <div className="max-w-2xl mx-auto px-5 py-14 ef-fade-up">
      <h1 className="font-display text-3xl font-semibold mb-1">Checkout</h1>
      <p className="text-[var(--text-muted)] mb-8">
        This is a temporary reservation. Complete payment before your hold expires.
      </p>

      {/* Countdown */}
      <div className={`rounded-[var(--radius)] border p-5 mb-6 flex items-center justify-between ${
        isVisuallyExpired
          ? "border-[rgba(251,107,107,0.3)] bg-[rgba(251,107,107,0.06)]"
          : "border-[var(--border)] bg-[var(--surface)]"
      }`}>
        <div className="flex items-center gap-3">
          <Timer size={18} color={isVisuallyExpired ? "var(--rose)" : "var(--amber)"} />
          <div>
            <p className="text-sm font-medium">{isVisuallyExpired ? "Hold likely expired" : "Reservation hold"}</p>
            <p className="text-xs text-[var(--text-faint)]">Backed by a 600s Redis TTL — this timer is a visual guide only.</p>
          </div>
        </div>
        <span className="font-mono text-2xl font-semibold tabular-nums">
          {msRemaining != null ? formatCountdown(msRemaining) : "--:--"}
        </span>
      </div>

      {/* Order summary */}
      <div className="ef-ticket-notch rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-6 mb-6">
        <h2 className="font-display text-lg font-semibold mb-4">{event?.name}</h2>
        <div className="flex flex-col gap-1.5 text-sm text-[var(--text-muted)] mb-5">
          <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} /> {formatDateTime(event?.startTime)}</span>
          <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> {event?.venue?.name}</span>
        </div>

        <div className="ef-dashed pt-4">
          {bookingSeats.map((bs) => (
            <div key={bs.id} className="flex items-center justify-between py-1.5 text-sm">
              <span className="font-mono">Seat {bs.seat.seatNo}</span>
              <span className="font-mono text-[var(--text-muted)]">{formatPrice(bs.seat.price)}</span>
            </div>
          ))}
        </div>

        <div className="ef-dashed pt-4 mt-2 flex items-center justify-between">
          <span className="text-sm text-[var(--text-muted)]">{totalSeats} seat{totalSeats === 1 ? "" : "s"} total</span>
          <span className="font-mono text-xl font-semibold">{formatPrice(payment.amount)}</span>
        </div>
      </div>

      <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5 mb-6">
        <p className="text-sm font-medium mb-1">Payment</p>
        <p className="text-xs text-[var(--text-muted)] mb-4 inline-flex items-center gap-1.5">
          <ShieldCheck size={13} /> Simulated checkout — no real card is charged, no payment gateway is involved.
        </p>
        <p className="text-2xl font-mono font-semibold mb-1">{formatPrice(payment.amount)}</p>
        <p className="text-xs text-[var(--text-faint)] mb-5">Status: {payment.status}</p>

        {actionError && (
          <p className="text-sm text-[var(--rose)] bg-[rgba(251,107,107,0.08)] border border-[rgba(251,107,107,0.2)] rounded-lg px-3 py-2 mb-4">
            {actionError}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => runAction(payPayment)}
            disabled={busy}
            className="flex-1 py-3 rounded-full bg-[var(--violet)] hover:bg-[var(--violet-2)] transition-colors font-medium disabled:opacity-60"
          >
            {busy ? "Processing…" : "Complete Payment"}
          </button>
          <button
            onClick={() => runAction(cancelPayment)}
            disabled={busy}
            className="flex-1 py-3 rounded-full border border-[var(--border-strong)] hover:bg-[var(--surface-2)] transition-colors font-medium disabled:opacity-60"
          >
            Cancel Payment
          </button>
        </div>
        <button
          onClick={() => runAction(failPayment)}
          disabled={busy}
          className="w-full mt-3 py-2 text-xs text-[var(--text-faint)] hover:text-[var(--text-muted)] transition-colors"
        >
          Simulate failure (dev)
        </button>
      </div>
    </div>
  );
}

function routeForStatus(status, payment, navigate) {
  if (status === "SUCCESS") {
    navigate("/payment/success", { state: { bookingId: payment.bookingId, paymentId: payment.id } });
  } else if (status === "EXPIRED") {
    navigate("/payment/expired", { state: { bookingId: payment.bookingId } });
  } else if (status === "FAILED" || status === "CANCELLED") {
    navigate("/payment/failure", { state: { bookingId: payment.bookingId, reason: status } });
  }
}
