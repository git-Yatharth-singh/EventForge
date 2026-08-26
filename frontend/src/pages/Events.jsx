import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, CalendarX2 } from "lucide-react";
import { getEvents } from "../api/eventApi";
import EventCard from "../components/EventCard";
import EventCardSkeleton from "../components/skeletons/EventCardSkeleton";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

const SORTS = {
  soonest: (a, b) => new Date(a.startTime) - new Date(b.startTime),
  latest: (a, b) => new Date(b.startTime) - new Date(a.startTime),
  name: (a, b) => a.name.localeCompare(b.name),
};

const RANGE_FILTERS = {
  all: () => true,
  today: (date, now) => sameDay(date, now),
  week: (date, now) => {
    const end = new Date(now);
    end.setDate(end.getDate() + 7);
    return date >= startOfDay(now) && date <= end;
  },
  month: (date, now) => {
    const end = new Date(now);
    end.setMonth(end.getMonth() + 1);
    return date >= startOfDay(now) && date <= end;
  },
};

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function sameDay(a, b) {
  return a.toDateString() === b.toDateString();
}

export default function Events() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [sort, setSort] = useState("soonest");
  const [range, setRange] = useState("all");

  const load = () => {
    setLoading(true);
    setError(null);
    getEvents()
      .then(setEvents)
      .catch((err) => setError(err?.message ?? "Couldn't load events."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setQuery(q);
  }, [searchParams]);

  const handleQueryChange = (val) => {
    setQuery(val);
    setSearchParams(val ? { q: val } : {});
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const now = new Date();

    let list = events;
    if (q) {
      list = list.filter(
        (e) =>
          e.name?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.venue?.name?.toLowerCase().includes(q) ||
          e.venue?.location?.toLowerCase().includes(q)
      );
    }
    list = list.filter((e) => e.startTime && RANGE_FILTERS[range](new Date(e.startTime), now));
    return [...list].sort(SORTS[sort]);
  }, [events, query, sort, range]);

  return (
    <div className="max-w-6xl mx-auto px-5 py-14">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold mb-2">Events</h1>
        <p className="text-[var(--text-muted)]">Every event currently live on EventForge.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
          <input
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search events, venues, cities…"
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full pl-10 pr-4 py-2.5 text-sm focus:border-[var(--violet)] outline-none transition-colors"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm focus:border-[var(--violet)] outline-none transition-colors"
        >
          <option value="soonest">Soonest first</option>
          <option value="latest">Latest first</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {[
          ["all", "All dates"],
          ["today", "Today"],
          ["week", "This week"],
          ["month", "This month"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setRange(key)}
            className={`text-sm font-medium px-3.5 py-1.5 rounded-full border transition-colors ${
              range === key
                ? "bg-[var(--violet)] border-[var(--violet)] text-white"
                : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-strong)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)}
        </div>
      )}

      {!loading && error && <ErrorState message={error} onRetry={load} />}

      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          icon={CalendarX2}
          title={query ? "No matching events" : "No events in this range"}
          description={query ? "Try a different search term." : "Try a wider date range or check back soon."}
        />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((event) => <EventCard key={event.id} event={event} />)}
        </div>
      )}
    </div>
  );
}
