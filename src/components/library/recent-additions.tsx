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
    <section className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
        Récemment ajoutés
      </h2>
      <HorizontalScroll>
        {comics.map((comic) => (
          <Link
            key={comic.id}
            href={`/read/${comic.id}`}
            className="group shrink-0 w-36 space-y-2 snap-start cover-glow rounded-xl"
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-muted">
              <img
                src={`/api/comics/${comic.id}/thumbnail`}
                alt={comic.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
              />
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5" />
            </div>
            <div className="px-0.5">
              <p className="text-xs font-medium leading-tight line-clamp-2">
                {comic.title}
              </p>
              {comic.seriesTitle && comic.seriesTitle !== comic.title && (
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {comic.seriesTitle}
                </p>
              )}
            </div>
          </Link>
        ))}
      </HorizontalScroll>
    </section>
  );
}
