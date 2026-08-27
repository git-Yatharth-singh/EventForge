import { Link } from "react-router-dom";
import { MapPin, ArrowUpRight } from "lucide-react";
import { getEventPoster } from "../utils/poster";

export default function EventCard({ event }) {
  const poster = getEventPoster(event);
  const date = event.startTime ? new Date(event.startTime) : null;

  return (
    <Link
      to={`/events/${event.id}`}
      className="group ef-fade-up rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden flex flex-col hover:border-[var(--border-strong)] transition-colors"
    >
      {/* Poster */}
      <div
        className="relative h-36 sm:h-40 flex items-end p-4 overflow-hidden"
        style={{ background: poster.background }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {date && (
          <div className="absolute top-3 left-3 rounded-lg bg-black/40 backdrop-blur-sm px-2.5 py-1.5 text-center leading-none">
            <div className="font-mono text-[10px] uppercase tracking-wide text-white/70">
              {date.toLocaleDateString(undefined, { month: "short" })}
            </div>
            <div className="font-display text-lg font-semibold text-white">
              {date.getDate()}
            </div>
          </div>
        )}
        <h3 className="relative font-display text-xl font-semibold leading-snug text-white drop-shadow-sm">
          {event.name}
        </h3>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-5 flex-1">
          {event.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] min-w-0">
            <MapPin size={14} className="shrink-0" />
            <span className="truncate">{event.venue?.name ?? "Venue TBA"}</span>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--violet-2)] group-hover:gap-2 transition-all shrink-0 ml-3">
            Details <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
