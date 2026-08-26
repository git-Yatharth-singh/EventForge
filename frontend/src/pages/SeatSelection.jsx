import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Armchair } from "lucide-react";
import { getEvent } from "../api/eventApi";
import { getSeatsForEvent } from "../api/seatApi";
import { createBooking } from "../api/bookingApi";
import { getMyPayments } from "../api/paymentApi";
import SeatMap from "../components/SeatMap";
import SeatMapSkeleton from "../components/skeletons/SeatMapSkeleton";
import ErrorState from "../components/ErrorState";
import { formatDateTime, formatPrice } from "../utils/format";

export default function SeatSelection() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conflictMessage, setConflictMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const ev = await getEvent(eventId);
      setEvent(ev);
      const seatList = await getSeatsForEvent(eventId, ev.venue.id);
      setSeats(seatList);
    } catch (err) {
      setError(err?.message ?? "Couldn't load seats for this event.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const toggleSeat = (seat) => {
    setConflictMessage("");
    setSelectedIds((prev) =>
      prev.includes(seat.id) ? prev.filter((id) => id !== seat.id) : [...prev, seat.id]
    );
  };

  const selectedSeats = seats.filter((s) => selectedIds.includes(s.id));
  const total = selectedSeats.reduce((sum, s) => sum + Number(s.price), 0);

  const handleContinue = async () => {
    if (selectedIds.length === 0) return;
    setSubmitting(true);
    setConflictMessage("");
    try {
      await createBooking(Number(eventId), selectedIds);

      // POST /booking returns void. To reach checkout we look up the
      // payment the backend just created via the user-scoped GET /payment
      // (PaymentResponse has no createdAt, so we take the highest-id
      // PENDING payment as "the one just created").
      const payments = await getMyPayments();
      const pending = payments.filter((p) => p.status === "PENDING");
      const latest = pending.reduce((a, b) => (b.id > a.id ? b : a), pending[0]);

      if (!latest) throw new Error("Booking created, but no pending payment was found.");
      navigate(`/checkout/${latest.id}`);
    } catch (err) {
      // Seat conflict or validation error — refresh availability and drop
      // any seat that's no longer selectable rather than trusting local state.
      setConflictMessage(err?.message ?? "Couldn't reserve those seats.");
      try {
        const ev = await getEvent(eventId);
        const seatList = await getSeatsForEvent(eventId, ev.venue.id);
        setSeats(seatList);
        setSelectedIds((prev) =>
          prev.filter((id) => {
            const s = seatList.find((x) => x.id === id);
            return s && s.status === "AVAILABLE";
          })
        );
      } catch {
        // ignore refresh failure, original error message still shown
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-5 py-14">
        <div className="ef-skeleton h-4 w-24 rounded mb-8" />
        <div className="ef-skeleton h-8 w-1/2 rounded mb-10" />
        <SeatMapSkeleton />
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="max-w-5xl mx-auto px-5 py-14 pb-40 lg:pb-14">
      <Link to={`/events/${eventId}`} className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] mb-6">
        <ArrowLeft size={14} /> Back to event
      </Link>

      <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-1">Select your seats</h1>
      <p className="text-[var(--text-muted)] mb-8">{event?.name}</p>

      {conflictMessage && (
        <p className="text-sm text-[var(--rose)] bg-[rgba(251,107,107,0.08)] border border-[rgba(251,107,107,0.2)] rounded-lg px-4 py-3 mb-6">
          {conflictMessage} Availability has been refreshed — please choose again.
        </p>
      )}

      <div className="grid lg:grid-cols-[1fr_320px] gap-10">
        <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10">
          {seats.length === 0 ? (
            <p className="text-[var(--text-muted)] text-center py-10">
              No seats have been configured for this event yet.
            </p>
          ) : (
            <SeatMap seats={seats} selectedIds={selectedIds} onToggle={toggleSeat} />
          )}
        </div>

        {/* Desktop summary */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <Armchair size={18} color="var(--violet-2)" /> Your seats
            </h2>
            {selectedSeats.length === 0 ? (
              <p className="text-sm text-[var(--text-faint)] mb-6">No seats selected yet.</p>
            ) : (
              <div className="ef-dashed pt-3 mb-4 max-h-64 overflow-y-auto">
                {selectedSeats.map((s) => (
                  <div key={s.id} className="flex items-center justify-between py-1.5 text-sm">
                    <span className="font-mono">Seat {s.seatNo}</span>
                    <span className="font-mono text-[var(--text-muted)]">{formatPrice(s.price)}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="ef-dashed pt-4 mb-6 flex items-center justify-between">
              <span className="text-sm text-[var(--text-muted)]">Total</span>
              <span className="font-mono text-xl font-semibold">{formatPrice(total)}</span>
            </div>
            <button
              onClick={handleContinue}
              disabled={submitting || selectedIds.length === 0}
              className="w-full py-3 rounded-full bg-[var(--violet)] hover:bg-[var(--violet-2)] transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? "Reserving…" : "Continue to Checkout"}
            </button>
          </div>
        </aside>
      </div>

      {/* Mobile summary bar */}
      {selectedIds.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-md">
          <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs text-[var(--text-muted)] mb-0.5 truncate">
                Selected: <span className="font-mono text-[var(--text)]">{selectedSeats.map((s) => s.seatNo).join(", ")}</span>
              </p>
              <p className="font-mono text-lg font-semibold">{formatPrice(total)}</p>
            </div>
            <button
              onClick={handleContinue}
              disabled={submitting}
              className="px-6 py-3 rounded-full bg-[var(--violet)] hover:bg-[var(--violet-2)] transition-colors font-medium disabled:opacity-60 shrink-0"
            >
              {submitting ? "Reserving…" : "Continue"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
