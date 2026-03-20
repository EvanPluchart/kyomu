import { VolumeCard } from "@/components/library/volume-card";

interface VolumeData {
  id: number;
  title: string;
  number: number | null;
  format: string;
  pageCount: number | null;
  currentPage: number | null;
  totalPages: number | null;
  status: string | null;
}

interface VolumeGridProps {
  comics: VolumeData[];
}

export function VolumeGrid({ comics }: VolumeGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {comics.map((comic) => (
        <VolumeCard key={comic.id} comic={comic} />
      ))}
    </div>
  );
}
