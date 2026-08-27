export default function BookingCardSkeleton() {
  return (
    <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex justify-between mb-4">
        <div className="ef-skeleton h-4 w-24 rounded" />
        <div className="ef-skeleton h-5 w-20 rounded-full" />
      </div>
      <div className="ef-skeleton h-6 w-1/2 rounded mb-3" />
      <div className="ef-skeleton h-4 w-1/3 rounded" />
    </div>
  );
}
