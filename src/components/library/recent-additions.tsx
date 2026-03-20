import Link from "next/link";
import { HorizontalScroll } from "@/components/library/horizontal-scroll";

interface RecentComic {
  id: number;
  title: string;
  seriesId: number;
  seriesTitle: string | null;
}

interface RecentAdditionsProps {
  comics: RecentComic[];
}

export function RecentAdditions({ comics }: RecentAdditionsProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">Récemment ajoutés</h2>
      <HorizontalScroll>
        {comics.map((comic) => (
          <Link
            key={comic.id}
            href={`/read/${comic.id}`}
            className="group shrink-0 w-32 space-y-2"
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted">
              <img
                src={`/api/comics/${comic.id}/thumbnail`}
                alt={comic.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <p className="text-xs font-medium leading-tight line-clamp-2">
              {comic.title}
            </p>
            {comic.seriesTitle && (
              <p className="text-xs text-muted-foreground truncate">
                {comic.seriesTitle}
              </p>
            )}
          </Link>
        ))}
      </HorizontalScroll>
    </section>
  );
}
