"use client";

interface DoublePageReaderProps {
  comicId: number;
  currentPage: number;
  totalPages: number;
  rtl: boolean;
}

export function DoublePageReader({
  comicId,
  currentPage,
  totalPages,
  rtl,
}: DoublePageReaderProps) {
  // La première page (couverture) est affichée seule
  const isCover = currentPage === 0;

  // En mode double page, on affiche la page courante et la suivante
  const leftPage = isCover ? null : (rtl ? currentPage + 1 : currentPage);
  const rightPage = isCover ? null : (rtl ? currentPage : currentPage + 1);

  // Si la page suivante dépasse le total, afficher une seule page
  const showDouble = !isCover && currentPage + 1 < totalPages;

  if (isCover || !showDouble) {
    // Single page display
    return (
      <div className="flex h-full w-full items-center justify-center">
        <img
          src={`/api/comics/${comicId}/pages/${currentPage}`}
          alt={`Page ${currentPage + 1}`}
          className="max-h-full max-w-full object-contain"
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center gap-1">
      <div className="flex h-full flex-1 items-center justify-end">
        <img
          src={`/api/comics/${comicId}/pages/${leftPage!}`}
          alt={`Page ${leftPage! + 1}`}
          className="max-h-full max-w-full object-contain"
          draggable={false}
        />
      </div>
      <div className="flex h-full flex-1 items-center justify-start">
        <img
          src={`/api/comics/${comicId}/pages/${rightPage!}`}
          alt={`Page ${rightPage! + 1}`}
          className="max-h-full max-w-full object-contain"
          draggable={false}
        />
      </div>
    </div>
  );
}
