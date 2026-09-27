export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-card rounded-lg ${className}`} />;
}

export function PageSkeleton() {
  return (
    <div>
      <SkeletonBlock className="h-7 w-52 mb-2" />
      <SkeletonBlock className="h-4 w-72 mb-6" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
        {[0, 1, 2, 3].map((i) => (
          <SkeletonBlock key={i} className="h-24" />
        ))}
      </div>
      <SkeletonBlock className="h-48 mb-4" />
      <SkeletonBlock className="h-48" />
    </div>
  );
}