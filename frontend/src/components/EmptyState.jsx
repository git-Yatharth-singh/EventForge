export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-3 py-20 px-6">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-[var(--surface)] flex items-center justify-center mb-1">
          <Icon size={20} color="var(--text-muted)" />
        </div>
      )}
      <p className="font-display text-lg font-medium">{title}</p>
      {description && <p className="text-sm text-[var(--text-muted)] max-w-sm">{description}</p>}
      {action}
    </div>
  );
}
