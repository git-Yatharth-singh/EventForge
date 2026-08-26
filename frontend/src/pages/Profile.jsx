import { useAuth } from "../context/AuthContext";
import { User, Mail, Shield } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-xl mx-auto px-5 py-14 ef-fade-up">
      <h1 className="font-display text-3xl font-semibold mb-1">Profile</h1>
      <p className="text-[var(--text-muted)] mb-8">Your EventForge account details.</p>

      <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] divide-y divide-[var(--border)]">
        <ProfileRow icon={User} label="Name" value={user?.name} />
        <ProfileRow icon={Mail} label="Email" value={user?.email} />
        <ProfileRow icon={Shield} label="Role" value={user?.role ?? user?.Role} />
      </div>

      <p className="text-xs text-[var(--text-faint)] mt-4">
        Profile editing isn't available yet — EventForge doesn't currently expose an update-profile endpoint.
      </p>
    </div>
  );
}

function ProfileRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <span className="w-9 h-9 rounded-lg bg-[var(--violet-dim)] flex items-center justify-center shrink-0">
        <Icon size={16} color="var(--violet-2)" />
      </span>
      <div>
        <p className="text-xs text-[var(--text-faint)] uppercase tracking-wide">{label}</p>
        <p className="font-medium">{value ?? "—"}</p>
      </div>
    </div>
  );
}
