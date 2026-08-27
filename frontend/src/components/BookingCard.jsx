import { Link } from "react-router-dom";
import { CalendarDays, MapPin, Armchair } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatDateTime, formatPrice } from "../utils/format";

export default function BookingCard({ booking, seatCount, onCancel, cancelling }) {
  const { id, event, Status, status, totalAmount } = booking;
  const bookingStatus = Status ?? status;

  return (
    <div className="ef-fade-up rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex items-start justify-between mb-3">
        <span className="font-mono text-xs text-[var(--text-faint)]">
          BOOKING #{String(id).padStart(4, "0")}
        </span>
        <StatusBadge status={bookingStatus} />
      </div>

      <h3 className="font-display text-lg font-semibold mb-3">
        {event?.name ?? "Event"}
      </h3>

      <div className="flex flex-col gap-1.5 text-sm text-[var(--text-muted)] mb-4">
        <div className="flex items-center gap-1.5">
          <CalendarDays size={14} /> {formatDateTime(event?.startTime)}
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={14} /> {event?.venue?.name ?? "Venue TBA"}
        </div>
        {seatCount != null && (
          <div className="flex items-center gap-1.5">
            <Armchair size={14} /> {seatCount} seat{seatCount === 1 ? "" : "s"}
          </div>
        )}
      </div>

      <div className="ef-dashed pt-4 flex items-center justify-between">
        <span className="font-mono text-base font-semibold">{formatPrice(totalAmount)}</span>
        <div className="flex gap-2">
          {bookingStatus === "PENDING" && (
            <>
              <Link
                to={`/bookings/${id}`}
                className="text-sm font-medium px-3.5 py-1.5 rounded-full bg-[var(--violet)] hover:bg-[var(--violet-2)] transition-colors text-white"
              >
                Continue payment
              </Link>
              <button
                onClick={() => onCancel?.(id)}
                disabled={cancelling}
                className="text-sm font-medium px-3.5 py-1.5 rounded-full border border-[var(--border-strong)] hover:bg-[var(--surface-2)] transition-colors disabled:opacity-50"
              >
                {cancelling ? "Cancelling…" : "Cancel"}
              </button>
            </>
          )}
          {bookingStatus !== "PENDING" && (
            <Link
              to={`/bookings/${id}`}
              className="text-sm font-medium px-3.5 py-1.5 rounded-full border border-[var(--border-strong)] hover:bg-[var(--surface-2)] transition-colors"
            >
              View details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
