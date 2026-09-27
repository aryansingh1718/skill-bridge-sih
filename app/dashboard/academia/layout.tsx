"use client";

import { MobileTopbar } from "@/components/shared/MobileTopbar";
import { Sidebar } from "@/components/shared/SideBar";
import { useRequireRole } from "@/lib/use-require-role";
import { useState } from "react";

const navItems = [
  {
    href: "/dashboard/academia",
    label: "Verify Students",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-current fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    href: "/dashboard/academia/curriculum",
    label: "Curriculum Mapping",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-current fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 5h16M4 5v13a1 1 0 0 0 1 1h6M4 5l4-2h8l4 2" /><path d="M14 13h6M14 17h6M14 9h6" />
      </svg>
    ),
  },
];

export default function AcademiaLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useRequireRole("academia");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <p className="text-muted text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-bg flex-col md:flex-row">
      <MobileTopbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar
        navItems={navItems}
        accent="mint"
        roleLabel="Academia admin"
        initials="SL"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        />
      <main className="flex-1 min-w-0 px-4 sm:px-6 md:px-9 py-6 md:py-8 pb-16">{children}</main>
    </div>
  );
}