import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getVenue } from "../../api/venueApi";
import { adminCreateVenue, adminUpdateVenue } from "../../api/adminVenueApi";

export default function AdminVenueForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", location: "" });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    getVenue(id)
      .then((v) => setForm({ name: v.name ?? "", location: v.location ?? "" }))
      .catch((err) => setError(err?.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (isEdit) await adminUpdateVenue(id, form);
      else await adminCreateVenue(form);
      navigate("/admin/venues");
    } catch (err) {
      setError(err?.message ?? "Couldn't save this venue.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-[var(--text-muted)]">Loading…</p>;

  return (
    <div className="max-w-md">
      <Link to="/admin/venues" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] mb-6">
        <ArrowLeft size={14} /> Back to venues
      </Link>
      <h1 className="font-display text-2xl font-semibold mb-6">{isEdit ? "Edit venue" : "New venue"}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Name" value={form.name} onChange={set("name")} required />
        <Field label="Location" value={form.location} onChange={set("location")} required />

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
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create venue"}
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
