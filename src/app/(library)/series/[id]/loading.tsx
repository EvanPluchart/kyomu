import { Skeleton } from "@/components/ui/skeleton";

export default function SeriesDetailLoading() {
  return (
    <div className="space-y-8 animate-fade-in">
      <Skeleton className="h-4 w-24" />
      <div className="flex gap-6">
        <Skeleton className="w-36 sm:w-44 aspect-[2/3] rounded-xl" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-48 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-[2/3] w-full rounded-xl" />
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}
