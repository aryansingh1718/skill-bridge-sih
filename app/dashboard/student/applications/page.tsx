"use client";

import { useEffect, useState } from "react";
import { useRole } from "@/lib/role-context";
import { getStudentApplications } from "@/lib/queries";
import { Application, ApplicationStatus } from "@/types";
import { Card } from "@/components/shared/Card";
import { RowItem } from "@/components/shared/RowItem";
import { Badge } from "@/components/shared/Badge";

const statusLabel: Record<ApplicationStatus, string> = {
  under_review: "Under review",
  shortlisted: "Shortlisted",
  interview: "Interview scheduled",
  rejected: "Not selected",
};
const statusVariant: Record<
  ApplicationStatus,
  "review" | "shortlisted" | "interview" | "rejected"
> = {
  under_review: "review",
  shortlisted: "shortlisted",
  interview: "interview",
  rejected: "rejected",
};

export default function StudentApplicationsPage() {
  const { user } = useRole();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getStudentApplications(user.id).then((a) => {
      setApplications(a);
      setLoading(false);
    });
  }, [user]);

  if (loading) return <p className="text-muted text-sm">Loading applications...</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-[23px] font-bold tracking-tight">Applications</h1>
        <p className="text-muted text-[13.5px] mt-1">
          Track the status of roles you&apos;ve applied to.
        </p>
      </div>

      <Card>
        <div className="space-y-2.5">
          {applications.length === 0 && (
            <p className="text-muted text-sm">You haven&apos;t applied to anything yet.</p>
          )}
          {applications.map((app) => (
            <RowItem
              key={app.id}
              title={app.opportunity?.title ?? "Opportunity"}
              meta={`Applied ${new Date(app.applied_at).toLocaleDateString()}`}
            >
              <Badge variant={statusVariant[app.status]}>{statusLabel[app.status]}</Badge>
            </RowItem>
          ))}
        </div>
      </Card>
    </div>
  );
}