"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
}

export function Toast({ message, visible, onClose }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[200] animate-slide-up">
      <div className="flex items-center gap-3 rounded-xl bg-card border border-border px-4 py-3 shadow-2xl">
        <p className="text-sm font-medium">{message}</p>
        <button onClick={onClose} className="cursor-pointer text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
