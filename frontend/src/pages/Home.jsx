import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search, Ticket, Armchair, CalendarCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getEvents } from "../api/eventApi";
import EventCard from "../components/EventCard";
import EventCardSkeleton from "../components/skeletons/EventCardSkeleton";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(isAuthenticated);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    getEvents()
      .then((data) =>
        setEvents(
          [...data]
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
            .slice(0, 6)
        )
      )
      .catch((err) => setError(err?.message))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(query.trim() ? `/events?q=${encodeURIComponent(query.trim())}` : "/events");
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full bg-[radial-gradient(circle,rgba(124,92,255,0.28),transparent_60%)] blur-2xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-5 pt-24 pb-20 md:pt-32 md:pb-24 text-center">
          <span className="ef-fade-up inline-flex items-center gap-2 font-mono text-xs text-[var(--violet-2)] border border-[var(--violet-dim)] rounded-full px-3 py-1 mb-7">
            <Ticket size={12} /> Live events, real seats
          </span>
          <h1 className="ef-fade-up font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] mb-6 text-balance">
            Discover Events.
            <br />
            Reserve Your Seat.
          </h1>
          <p className="ef-fade-up text-lg text-[var(--text-muted)] max-w-lg mx-auto mb-10">
            Find your next experience, choose your seat, and secure your booking in seconds.
          </p>

          <form onSubmit={handleSearch} className="ef-fade-up flex items-center gap-2 max-w-lg mx-auto mb-8">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search concerts, shows, venues…"
                className="w-full bg-[var(--surface)] border border-[var(--border-strong)] rounded-full pl-11 pr-4 py-3.5 text-sm focus:border-[var(--violet)] outline-none transition-colors shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3.5 rounded-full bg-[var(--violet)] hover:bg-[var(--violet-2)] transition-colors font-medium shrink-0"
            >
              Search
            </button>
          </form>

          <div className="ef-fade-up flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--violet)] hover:bg-[var(--violet-2)] transition-colors font-medium"
            >
              Explore Events <ArrowRight size={16} />
            </Link>
            <a href="#how-it-works" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* Featured events */}
      <section className="max-w-6xl mx-auto px-5 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-semibold">Upcoming events</h2>
          <Link to="/events" className="text-sm font-medium text-[var(--violet-2)] inline-flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {!isAuthenticated && (
          <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
            <p className="text-[var(--text-muted)] mb-4">
              Log in to see what's on right now.
            </p>
            <Link to="/login" className="text-sm font-medium text-[var(--violet-2)]">
              Log in to browse events →
            </Link>
          </div>
        )}

        {isAuthenticated && loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)}
          </div>
        )}

        {isAuthenticated && !loading && error && (
          <p className="text-sm text-[var(--rose)]">{error}</p>
        )}

        {isAuthenticated && !loading && !error && events.length === 0 && (
          <p className="text-[var(--text-muted)]">No events yet — check back soon.</p>
        )}

        {isAuthenticated && !loading && events.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        )}
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-5 pb-24 scroll-mt-20">
        <h2 className="font-display text-2xl font-semibold text-center mb-10">How EventForge works</h2>
        <div className="grid md:grid-cols-3 gap-5">
          <Step
            n="01"
            icon={Ticket}
            title="Discover an event"
            description="Browse live events by date, venue, or search — every listing comes straight from the EventForge catalog."
          />
          <Step
            n="02"
            icon={Armchair}
            title="Choose your seats"
            description="Pick exactly where you want to sit on a real-time seat map and see your total update instantly."
          />
          <Step
            n="03"
            icon={CalendarCheck}
            title="Confirm your booking"
            description="Complete checkout and your booking is confirmed — with a ticket you can pull up any time."
          />
        </div>
      </section>

      {/* CTA banner */}
      <section className="max-w-6xl mx-auto px-5 pb-24">
        <div className="rounded-[var(--radius)] border border-[var(--border)] bg-gradient-to-br from-[var(--violet-dim)] to-[var(--surface)] px-8 py-14 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-3">
            Your next night out is a few taps away.
          </h2>
          <p className="text-[var(--text-muted)] mb-8 max-w-md mx-auto">
            Create an account and start booking seats to the events you don't want to miss.
          </p>
          <Link
            to={isAuthenticated ? "/events" : "/signup"}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[var(--violet)] hover:bg-[var(--violet-2)] transition-colors font-medium"
          >
            {isAuthenticated ? "Explore Events" : "Get Started"} <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function Step({ n, icon: Icon, title, description }) {
  return (
    <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="flex items-center justify-between mb-5">
        <span className="font-mono text-xs text-[var(--text-faint)]">{n}</span>
        <span className="w-9 h-9 rounded-lg bg-[var(--violet-dim)] flex items-center justify-center">
          <Icon size={16} color="var(--violet-2)" />
        </span>
      </div>
      <h3 className="font-display text-base font-semibold mb-2">{title}</h3>
      <p className="text-sm text-[var(--text-muted)]">{description}</p>
    </div>
  );
}
