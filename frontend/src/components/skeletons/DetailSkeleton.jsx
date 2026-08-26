export default function DetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-16">
      <div className="ef-skeleton h-4 w-24 rounded mb-6" />
      <div className="ef-skeleton h-10 w-2/3 rounded mb-4" />
      <div className="ef-skeleton h-4 w-1/2 rounded mb-10" />
      <div className="ef-skeleton h-40 w-full rounded-[var(--radius)]" />
    </div>
  );
}
