import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getEvents } from "../../api/eventApi";
import { adminDeleteEvent } from "../../api/adminEventApi";
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";
import { formatDateTime } from "../../utils/format";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    getEvents().then(setEvents).catch((e) => setError(e?.message)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await adminDeleteEvent(id);
      load();
    } catch (err) {
      alert(err?.message ?? "Couldn't delete event.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold">Events</h1>
          <p className="text-[var(--text-muted)] text-sm">{events.length} total</p>
        </div>
        <Link to="/admin/events/new" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--violet)] hover:bg-[var(--violet-2)] transition-colors text-sm font-medium">
          <Plus size={15} /> New event
        </Link>
      </div>

      {loading && <p className="text-sm text-[var(--text-muted)]">Loading…</p>}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && events.length === 0 && (
        <EmptyState title="No events yet" description="Create your first event to get started." />
      )}

      {!loading && !error && events.length > 0 && (
        <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] divide-y divide-[var(--border)]">
          {events.map((e) => (
            <div key={e.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <p className="font-medium truncate">{e.name}</p>
                <p className="text-xs text-[var(--text-faint)] truncate">
                  {formatDateTime(e.startTime)} · {e.venue?.name ?? "No venue"}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link
                  to={`/admin/events/${e.id}/edit`}
                  className="p-2 rounded-lg border border-[var(--border-strong)] hover:bg-[var(--surface-2)] transition-colors"
                  title="Edit"
                >
                  <Pencil size={14} />
                </Link>
                <button
                  onClick={() => handleDelete(e.id)}
                  disabled={deletingId === e.id}
                  className="p-2 rounded-lg border border-[var(--border-strong)] hover:bg-[rgba(251,107,107,0.1)] hover:border-[rgba(251,107,107,0.3)] transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 size={14} color="var(--rose)" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
