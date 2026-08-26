import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, MapPin, Clock } from "lucide-react";
import { getEvent } from "../api/eventApi";
import { useAuth } from "../context/AuthContext";
import DetailSkeleton from "../components/skeletons/DetailSkeleton";
import ErrorState from "../components/ErrorState";
import { formatDate, formatTime } from "../utils/format";

export default function EventDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    getEvent(id)
      .then(setEvent)
      .catch((err) => setError(err?.message ?? "We couldn't find that event."))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const handleSelectSeats = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/events/${id}/seats` } } });
      return;
    }
    navigate(`/events/${id}/seats`);
  };

  if (loading) return <DetailSkeleton />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!event) return null;

  return (
    <div className="max-w-3xl mx-auto px-5 py-14 ef-fade-up">
      <Link to="/events" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] mb-8">
        <ArrowLeft size={14} /> Back to events
      </Link>

      <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-4">{event.name}</h1>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--text-muted)] mb-8">
        <span className="inline-flex items-center gap-1.5"><CalendarDays size={15} /> {formatDate(event.startTime)}</span>
        <span className="inline-flex items-center gap-1.5"><Clock size={15} /> {formatTime(event.startTime)} – {formatTime(event.endTime)}</span>
        <span className="inline-flex items-center gap-1.5"><MapPin size={15} /> {event.venue?.name}{event.venue?.location ? `, ${event.venue.location}` : ""}</span>
      </div>

      <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-6 mb-8">
        <h2 className="font-display text-lg font-semibold mb-3">About this event</h2>
        <p className="text-[var(--text-muted)] whitespace-pre-line leading-relaxed">
          {event.description || "No description provided."}
        </p>
      </div>

      <button
        onClick={handleSelectSeats}
        className="w-full sm:w-auto px-8 py-3 rounded-full bg-[var(--violet)] hover:bg-[var(--violet-2)] transition-colors font-medium"
      >
        Select Seats
      </button>
    </div>
  );
}
