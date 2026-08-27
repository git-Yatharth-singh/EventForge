import { useState } from "react";
import { TicketX } from "lucide-react";
import { useMyBookings } from "../hooks/useMyBookings";
import { cancelBooking } from "../api/bookingApi";
import BookingCard from "../components/BookingCard";
import BookingCardSkeleton from "../components/skeletons/BookingCardSkeleton";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function MyBookings() {
  const { bookings, loading, error, refetch } = useMyBookings();
  const [cancellingId, setCancellingId] = useState(null);
  const [actionError, setActionError] = useState("");

  const handleCancel = async (id) => {
    setCancellingId(id);
    setActionError("");
    try {
      await cancelBooking(id);
      await refetch();
    } catch (err) {
      setActionError(err?.message ?? "Couldn't cancel that booking.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-5 py-14">
      <h1 className="font-display text-3xl font-semibold mb-1">My Bookings</h1>
      <p className="text-[var(--text-muted)] mb-8">Everything you've reserved on EventForge.</p>

      {actionError && (
        <p className="text-sm text-[var(--rose)] bg-[rgba(251,107,107,0.08)] border border-[rgba(251,107,107,0.2)] rounded-lg px-4 py-3 mb-6">
          {actionError}
        </p>
      )}

      {loading && (
        <div className="grid sm:grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => <BookingCardSkeleton key={i} />)}
        </div>
      )}

      {!loading && error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && bookings.length === 0 && (
        <EmptyState
          icon={TicketX}
          title="No bookings yet"
          description="Once you reserve seats for an event, they'll show up here."
        />
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-5">
          {bookings.map(({ booking }) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancel}
              cancelling={cancellingId === booking.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
