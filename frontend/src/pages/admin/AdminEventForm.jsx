import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getEvent } from "../../api/eventApi";
import { getVenues } from "../../api/venueApi";
import { adminCreateEvent, adminUpdateEvent } from "../../api/adminEventApi";

function toLocalInputValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminEventForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [venues, setVenues] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", startTime: "", endTime: "", venueId: "" });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getVenues().then(setVenues).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    getEvent(id)
      .then((e) =>
        setForm({
          name: e.name ?? "",
          description: e.description ?? "",
          startTime: toLocalInputValue(e.startTime),
          endTime: toLocalInputValue(e.endTime),
          venueId: e.venue?.id ?? "",
        })
      )
      .catch((err) => setError(err?.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, venueId: Number(form.venueId) };
      if (isEdit) await adminUpdateEvent(id, payload);
      else await adminCreateEvent(payload);
      navigate("/admin/events");
    } catch (err) {
      setError(err?.message ?? "Couldn't save this event.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-[var(--text-muted)]">Loading…</p>;

  return (
    <div className="max-w-xl">
      <Link to="/admin/events" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] mb-6">
        <ArrowLeft size={14} /> Back to events
      </Link>
      <h1 className="font-display text-2xl font-semibold mb-6">{isEdit ? "Edit event" : "New event"}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Name" value={form.name} onChange={set("name")} required />
        <TextArea label="Description" value={form.description} onChange={set("description")} />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Start time" type="datetime-local" value={form.startTime} onChange={set("startTime")} required />
          <Field label="End time" type="datetime-local" value={form.endTime} onChange={set("endTime")} required />
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Venue</span>
          <select
            value={form.venueId}
            onChange={set("venueId")}
            required
            className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm focus:border-[var(--violet)] outline-none transition-colors"
          >
            <option value="" disabled>Select a venue…</option>
            {venues.map((v) => (
              <option key={v.id} value={v.id}>{v.name} — {v.location}</option>
            ))}
          </select>
        </label>

        {error && (
          <p className="text-sm text-[var(--rose)] bg-[rgba(251,107,107,0.08)] border border-[rgba(251,107,107,0.2)] rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-2 py-2.5 rounded-full bg-[var(--violet)] hover:bg-[var(--violet-2)] transition-colors font-medium disabled:opacity-60"
        >
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create event"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">{label}</span>
      <input
        {...props}
        className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm focus:border-[var(--violet)] outline-none transition-colors"
      />
    </label>
  );
}

function TextArea({ label, ...props }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">{label}</span>
      <textarea
        {...props}
        rows={4}
        className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm focus:border-[var(--violet)] outline-none transition-colors resize-none"
      />
    </label>
  );
}
