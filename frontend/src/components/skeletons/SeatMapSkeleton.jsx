export default function SeatMapSkeleton() {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-8 gap-2.5 max-w-xl">
      {Array.from({ length: 24 }).map((_, i) => (
        <div key={i} className="ef-skeleton aspect-square rounded-lg" />
      ))}
    </div>
  );
}
