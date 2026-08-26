import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { getEvents } from "../../api/eventApi";
import { getSeatsForEvent } from "../../api/seatApi";
import { adminCreateSeat, adminUpdateSeatNumber, adminDeleteSeat } from "../../api/adminSeatApi";
import { formatPrice } from "../../utils/format";
import StatusBadge from "../../components/StatusBadge";

export default function AdminSeats() {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [newSeatNo, setNewSeatNo] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    getEvents().then(setEvents).catch(() => {});
  }, []);

  const loadSeats = async (id) => {
    if (!id) { setSeats([]); return; }
    setLoading(true);
    setError("");
    try {
      const ev = events.find((e) => String(e.id) === String(id));
      const list = await getSeatsForEvent(id, ev.venue.id);
      setSeats(list);
    } catch (err) {
      setError(err?.message ?? "Couldn't load seats.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEvent = (id) => {
    setEventId(id);
    loadSeats(id);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newSeatNo.trim() || !newPrice) return;
    setCreating(true);
    setError("");
    try {
      await adminCreateSeat({ seatNo: newSeatNo.trim(), price: Number(newPrice), eventId: Number(eventId) });
      setNewSeatNo("");
      setNewPrice("");
      await loadSeats(eventId);
    } catch (err) {
      setError(err?.message ?? "Couldn't create seat.");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (seat) => {
    setEditingId(seat.id);
    setEditValue(seat.seatNo);
  };

  const saveEdit = async (id) => {
    try {
      await adminUpdateSeatNumber(id, editValue.trim());
      setEditingId(null);
      await loadSeats(eventId);
    } catch (err) {
      alert(err?.message ?? "Couldn't update seat.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this seat?")) return;
    try {
      await adminDeleteSeat(id);
      await loadSeats(eventId);
    } catch (err) {
      alert(err?.message ?? "Couldn't delete seat.");
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-1">Seats</h1>
      <p className="text-[var(--text-muted)] text-sm mb-6">Manage seat inventory for an event.</p>

      <label className="flex flex-col gap-1.5 max-w-sm mb-8">
        <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Event</span>
        <select
          value={eventId}
          onChange={(e) => handleSelectEvent(e.target.value)}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm focus:border-[var(--violet)] outline-none transition-colors"
        >
          <option value="">Select an event…</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
      </label>

      {eventId && (
        <>
          <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-3 mb-6 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Seat No.</span>
              <input
                value={newSeatNo}
                onChange={(e) => setNewSeatNo(e.target.value)}
                placeholder="e.g. A12"
                className="w-28 bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:border-[var(--violet)] outline-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Price</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="500"
                className="w-28 bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:border-[var(--violet)] outline-none"
              />
            </label>
            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--violet)] hover:bg-[var(--violet-2)] transition-colors text-sm font-medium disabled:opacity-60"
            >
              <Plus size={15} /> Add seat
            </button>
          </form>

          {error && (
            <p className="text-sm text-[var(--rose)] bg-[rgba(251,107,107,0.08)] border border-[rgba(251,107,107,0.2)] rounded-lg px-3 py-2 mb-4">
              {error}
            </p>
          )}

          {loading && <p className="text-sm text-[var(--text-muted)]">Loading…</p>}

          {!loading && seats.length === 0 && (
            <p className="text-sm text-[var(--text-muted)]">No seats configured for this event yet.</p>
          )}

          {!loading && seats.length > 0 && (
            <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] divide-y divide-[var(--border)]">
              {seats.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-4 px-5 py-3">
                  {editingId === s.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm w-28 focus:border-[var(--violet)] outline-none"
                        autoFocus
                      />
                      <button onClick={() => saveEdit(s.id)} className="p-1.5 rounded-lg hover:bg-[var(--surface-2)]">
                        <Check size={14} color="var(--emerald)" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg hover:bg-[var(--surface-2)]">
                        <X size={14} color="var(--text-faint)" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <span className="font-mono font-medium w-16">{s.seatNo}</span>
                      <span className="font-mono text-sm text-[var(--text-muted)]">{formatPrice(s.price)}</span>
                      <StatusBadge status={s.status} />
                    </div>
                  )}

                  {editingId !== s.id && (
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => startEdit(s)} className="p-2 rounded-lg border border-[var(--border-strong)] hover:bg-[var(--surface-2)] transition-colors" title="Edit seat number">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg border border-[var(--border-strong)] hover:bg-[rgba(251,107,107,0.1)] hover:border-[rgba(251,107,107,0.3)] transition-colors" title="Delete">
                        <Trash2 size={14} color="var(--rose)" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
