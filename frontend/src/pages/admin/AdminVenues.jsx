import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getVenues } from "../../api/venueApi";
import { adminDeleteVenue } from "../../api/adminVenueApi";
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";

export default function AdminVenues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    getVenues().then(setVenues).catch((e) => setError(e?.message)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this venue? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await adminDeleteVenue(id);
      load();
    } catch (err) {
      alert(err?.message ?? "Couldn't delete venue.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold">Venues</h1>
          <p className="text-[var(--text-muted)] text-sm">{venues.length} total</p>
        </div>
        <Link to="/admin/venues/new" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--violet)] hover:bg-[var(--violet-2)] transition-colors text-sm font-medium">
          <Plus size={15} /> New venue
        </Link>
      </div>

      {loading && <p className="text-sm text-[var(--text-muted)]">Loading…</p>}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && venues.length === 0 && (
        <EmptyState title="No venues yet" description="Create a venue before adding events." />
      )}

      {!loading && !error && venues.length > 0 && (
        <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] divide-y divide-[var(--border)]">
          {venues.map((v) => (
            <div key={v.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <p className="font-medium truncate">{v.name}</p>
                <p className="text-xs text-[var(--text-faint)] truncate">{v.location}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link
                  to={`/admin/venues/${v.id}/edit`}
                  className="p-2 rounded-lg border border-[var(--border-strong)] hover:bg-[var(--surface-2)] transition-colors"
                  title="Edit"
                >
                  <Pencil size={14} />
                </Link>
                <button
                  onClick={() => handleDelete(v.id)}
                  disabled={deletingId === v.id}
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
