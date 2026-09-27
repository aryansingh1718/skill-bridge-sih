"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "./Logo";
import { useRole } from "@/lib/role-context";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export function Sidebar({
  navItems,
  accent,
  roleLabel,
  initials,
  isOpen,
  onClose,
}: {
  navItems: NavItem[];
  accent: "violet" | "cyan" | "mint";
  roleLabel: string;
  initials: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useRole();

  const accentText = { violet: "text-violet", cyan: "text-cyan", mint: "text-mint" }[accent];
  const accentBorder = { violet: "border-violet", cyan: "border-cyan", mint: "border-mint" }[accent];
  const accentBg = { violet: "bg-violet/15", cyan: "bg-cyan/15", mint: "bg-mint/15" }[accent];

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-auto w-[236px] flex-shrink-0 bg-surface border-r border-border py-[22px] px-4 pb-5 flex flex-col h-screen transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex items-center justify-between px-2 pb-6">
          <Logo size={26} />
          <button onClick={onClose} className="md:hidden text-muted hover:text-text">
            <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none" strokeWidth={1.8} strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav>
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] font-medium border-l-[3px] transition-colors ${
                      isActive
                        ? `text-text ${accentBg} ${accentBorder}`
                        : "text-muted border-transparent hover:bg-[#1B2440] hover:text-text"
                    }`}
                  >
                    <span className={isActive ? accentText : ""}>{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto flex items-center gap-2.5 p-3 border-t border-border">
          <div className={`w-[34px] h-[34px] rounded-full flex items-center justify-center font-display font-bold text-[13px] flex-shrink-0 ${accentBg} ${accentText}`}>
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold truncate">{user?.name}</div>
            <div className="text-[11.5px] text-muted">{roleLabel}</div>
          </div>
          <button onClick={handleLogout} title="Log out" className="text-muted hover:text-text flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </aside>
    </>
  );
}