interface PageViewerProps {
  comicId: number;
  pageIndex: number;
  onTap: (zone: "left" | "center" | "right") => void;
}

export function PageViewer({ comicId, pageIndex, onTap }: PageViewerProps) {
  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const third = width / 3;

    if (x < third) onTap("left");
    else if (x > third * 2) onTap("right");
    else onTap("center");
  }

  return (
    <div
      className="flex h-full w-full items-center justify-center cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={`/api/comics/${comicId}/pages/${pageIndex}`}
        alt={`Page ${pageIndex + 1}`}
        className="max-h-full max-w-full object-contain"
        draggable={false}
      />
    </div>
  );
}
