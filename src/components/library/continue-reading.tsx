import Link from "next/link";
import { HorizontalScroll } from "@/components/library/horizontal-scroll";
import { calculateProgress } from "@/lib/utils";

interface ContinueReadingComic {
  comicId: number;
  comicTitle: string;
  seriesId: number | null;
  seriesTitle: string | null;
  currentPage: number;
  totalPages: number;
}

interface ContinueReadingProps {
  comics: ContinueReadingComic[];
}

export function ContinueReading({ comics }: ContinueReadingProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
        Continuer la lecture
      </h2>
      <HorizontalScroll>
        {comics.map((comic) => {
          const progress = calculateProgress(comic.currentPage, comic.totalPages);

          return (
            <Link
              key={comic.comicId}
              href={`/read/${comic.comicId}`}
              className="group shrink-0 w-36 space-y-2 snap-start cover-glow rounded-xl"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-muted">
                <img
                  src={`/api/comics/${comic.comicId}/thumbnail`}
                  alt={comic.comicTitle}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
                />
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5" />
                {/* Progress bar at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <p className="text-xs font-medium leading-tight line-clamp-2 px-0.5">
                {comic.comicTitle}
              </p>
            </Link>
          );
        })}
      </HorizontalScroll>
    </section>
  );
}
