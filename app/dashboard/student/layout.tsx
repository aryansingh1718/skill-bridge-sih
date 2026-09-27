"use client";

import { Sidebar } from "@/components/shared/SideBar";
import { useRequireRole } from "@/lib/use-require-role";
import { useState } from "react";
import { MobileTopbar } from "@/components/shared/MobileTopbar";
const navItems = [
  {
    href: "/dashboard/student",
    label: "Overview",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-current fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/dashboard/student/skills",
    label: "My Skills",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-current fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" y1="20" x2="6" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="18" y1="20" x2="18" y2="14" />
      </svg>
    ),
  },
  {
    href: "/dashboard/student/opportunities",
    label: "Opportunities",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-current fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="8" width="18" height="12" rx="2" /><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  },
  {
    href: "/dashboard/student/applications",
    label: "Applications",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-current fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h9l5 5v13H6z" /><path d="M9 12h6M9 16h6M9 8h3" />
      </svg>
    ),
  },
  {
    href: "/dashboard/student/profile",
    label: "Profile",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-current fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
      </svg>
    ),
  },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useRequireRole("student");
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
        accent="violet"
        roleLabel="Student"
        initials="AS"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="flex-1 min-w-0 px-4 sm:px-6 md:px-9 py-6 md:py-8 pb-16">{children}</main>
    </div>
  );
}