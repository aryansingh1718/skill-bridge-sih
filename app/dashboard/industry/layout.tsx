"use client";

import { useRequireRole } from "@/lib/use-require-role";
import { Sidebar } from "@/components/shared/SideBar";
import { useState } from "react";
import { MobileTopbar } from "@/components/shared/MobileTopbar";

const navItems = [
  {
    href: "/dashboard/industry",
    label: "Overview",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-current fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/dashboard/industry/opportunities",
    label: "My Opportunities",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-current fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="8" width="18" height="12" rx="2" /><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  },
  {
    href: "/dashboard/industry/applicants",
    label: "Applicants",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-current fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.2 2.8-5 6-5s6 1.8 6 5" /><circle cx="17" cy="8" r="2.6" /><path d="M15.5 12c2.3.4 4 1.9 4 4.2" />
      </svg>
    ),
  },
  {
    href: "/dashboard/industry/requirements",
    label: "Skill Requirements",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-current fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="6" x2="19" y2="6" /><circle cx="9" cy="6" r="2" /><line x1="5" y1="12" x2="19" y2="12" /><circle cx="15" cy="12" r="2" /><line x1="5" y1="18" x2="19" y2="18" /><circle cx="11" cy="18" r="2" />
      </svg>
    ),
  },
];

export default function IndustryLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useRequireRole("industry");
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
        accent="cyan"
        roleLabel="Industry partner"
        initials="NS"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
       />
      <main className="flex-1 min-w-0 px-4 sm:px-6 md:px-9 py-6 md:py-8 pb-16">{children}</main>
    </div>
  );
}