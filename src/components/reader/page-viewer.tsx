interface PageViewerProps {
  comicId: number;
  pageIndex: number;
}

export function PageViewer({ comicId, pageIndex }: PageViewerProps) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <img
        src={`/api/comics/${comicId}/pages/${pageIndex}`}
        alt={`Page ${pageIndex + 1}`}
        className="max-h-full max-w-full object-contain"
        draggable={false}
      />
    </div>
  );
}
