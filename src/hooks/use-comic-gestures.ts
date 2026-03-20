"use client";

import { useRef, useCallback } from "react";
import { useGesture } from "@use-gesture/react";

interface UseComicGesturesOptions {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onTapCenter: () => void;
}

interface GestureState {
  scale: number;
  x: number;
  y: number;
}

export function useComicGestures({
  onSwipeLeft,
  onSwipeRight,
  onTapCenter,
}: UseComicGesturesOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<GestureState>({ scale: 1, x: 0, y: 0 });
  const lastTapRef = useRef<number>(0);

  const applyTransform = useCallback(() => {
    const el = containerRef.current?.querySelector("img");
    if (!el) return;
    const { scale, x, y } = stateRef.current;
    el.style.transform = `scale(${scale}) translate(${x}px, ${y}px)`;
    el.style.transition = "none";
  }, []);

  const animateTransform = useCallback(() => {
    const el = containerRef.current?.querySelector("img");
    if (!el) return;
    const { scale, x, y } = stateRef.current;
    el.style.transition = "transform 0.2s ease-out";
    el.style.transform = `scale(${scale}) translate(${x}px, ${y}px)`;
  }, []);

  const resetZoom = useCallback(() => {
    stateRef.current = { scale: 1, x: 0, y: 0 };
    animateTransform();
  }, [animateTransform]);

  const bind = useGesture(
    {
      onDrag: ({ movement: [mx, my], velocity: [vx], direction: [dx], last }) => {
        const state = stateRef.current;

        // Si zoomé, pan
        if (state.scale > 1) {
          state.x = mx / state.scale;
          state.y = my / state.scale;
          applyTransform();
          return;
        }

        // Si pas zoomé, swipe
        if (last) {
          if (Math.abs(mx) > 50 && vx > 0.3) {
            if (dx < 0) onSwipeLeft();
            else onSwipeRight();
          }
        }
      },
      onPinch: ({ offset: [scale], last }) => {
        const state = stateRef.current;
        state.scale = Math.max(1, Math.min(4, scale));

        if (last && state.scale <= 1.1) {
          state.scale = 1;
          state.x = 0;
          state.y = 0;
          animateTransform();
        } else {
          applyTransform();
        }
      },
      onClick: ({ event }) => {
        const now = Date.now();
        const timeSinceLastTap = now - lastTapRef.current;
        lastTapRef.current = now;

        // Double tap detection
        if (timeSinceLastTap < 300) {
          const state = stateRef.current;
          if (state.scale > 1) {
            resetZoom();
          } else {
            state.scale = 2;
            animateTransform();
          }
          return;
        }

        // Single tap — wait to confirm it's not a double tap
        setTimeout(() => {
          if (Date.now() - lastTapRef.current >= 280) {
            // Single tap confirmed
            const el = containerRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const x = (event as MouseEvent).clientX - rect.left;
            const width = rect.width;
            const third = width / 3;

            if (stateRef.current.scale > 1) return; // Don't navigate when zoomed

            if (x < third) onSwipeRight(); // Previous (tap left)
            else if (x > third * 2) onSwipeLeft(); // Next (tap right)
            else onTapCenter();
          }
        }, 300);
      },
    },
    {
      drag: { filterTaps: true },
      pinch: { scaleBounds: { min: 1, max: 4 } },
    },
  );

  return { containerRef, bind, resetZoom };
}
