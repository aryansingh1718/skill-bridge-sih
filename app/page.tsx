"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/lib/role-context";

export default function Home() {
  const { user, isLoading } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      router.replace(`/dashboard/${user.role}`);
    } else {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg">
      <p className="text-muted text-sm">Loading...</p>
    </main>
  );
}