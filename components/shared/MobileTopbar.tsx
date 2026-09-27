"use client";

import { Logo } from "./Logo";

export function MobileTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="md:hidden sticky top-0 z-30 flex items-center justify-between bg-surface border-b border-border px-4 py-3">
      <Logo size={22} />
      <button onClick={onMenuClick} className="text-text">
        <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none" strokeWidth={1.8} strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </header>
  );
}