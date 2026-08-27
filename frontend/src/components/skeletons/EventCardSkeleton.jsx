export default function EventCardSkeleton() {
  return (
    <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="ef-skeleton h-4 w-20 rounded mb-4" />
      <div className="ef-skeleton h-6 w-3/4 rounded mb-3" />
      <div className="ef-skeleton h-4 w-full rounded mb-2" />
      <div className="ef-skeleton h-4 w-2/3 rounded mb-6" />
      <div className="ef-skeleton h-9 w-28 rounded-full" />
    </div>
  );
}
