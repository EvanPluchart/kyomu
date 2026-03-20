import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  visible: boolean;
}

export function ProgressBar({
  currentPage,
  totalPages,
  onPageChange,
  visible,
}: ProgressBarProps) {
  const progress = totalPages > 0 ? ((currentPage + 1) / totalPages) * 100 : 0;

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const page = Math.floor(percentage * totalPages);
    onPageChange(Math.max(0, Math.min(page, totalPages - 1)));
  }

  return (
    <div
      className={cn(
        "absolute bottom-0 left-0 right-0 z-50 transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      {/* Zone cliquable */}
      <div
        className="h-10 cursor-pointer px-4 flex items-end"
        onClick={handleClick}
      >
        <div className="w-full h-1 rounded-full bg-white/20 overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
