"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "./role-context";
import { Role } from "@/types";

export function useRequireRole(expectedRole: Role) {
  const { user, isLoading } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user || user.role !== expectedRole) {
      router.replace("/login");
    }
  }, [user, isLoading, expectedRole, router]);

  return { user, isLoading };
}