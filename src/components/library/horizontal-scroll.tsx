import type { ReactNode } from "react";

interface HorizontalScrollProps {
  children: ReactNode;
}

export function HorizontalScroll({ children }: HorizontalScrollProps) {
  return (
    <div className="relative">
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x scroll-fade pl-1">
        {children}
      </div>
    </div>
  );
}
