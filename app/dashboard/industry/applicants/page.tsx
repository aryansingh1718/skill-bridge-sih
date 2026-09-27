"use client";

import { useEffect, useState } from "react";
import { useRole } from "@/lib/role-context";
import { getApplicationsForIndustry, updateApplicationStatus } from "@/lib/queries";
import { Application, ApplicationStatus } from "@/types";
import { Card } from "@/components/shared/Card";
import { useToast } from "@/components/shared/Toast";

const statusOptions: { value: ApplicationStatus; label: string }[] = [
  { value: "under_review", label: "Under review" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "interview", label: "Interview scheduled" },
  { value: "rejected", label: "Not selected" },
];

export default function IndustryApplicantsPage() {
  const { user } = useRole();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast, ToastElement } = useToast();

  useEffect(() => {
    if (!user) return;
    getApplicationsForIndustry(user.id).then((a) => {
      setApplications(a);
      setLoading(false);
    });
  }, [user]);

  async function handleStatusChange(id: string, status: ApplicationStatus) {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    const { error } = await updateApplicationStatus(id, status);
    if (error) showToast("Failed to update status");
    else showToast("Status updated");
  }

  if (loading) return <p className="text-muted text-sm">Loading applicants...</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-[20px] sm:text-[23px] font-bold tracking-tight">Applicants</h1>
        <p className="text-muted text-[13.5px] mt-1">
          Candidates across all your open roles, ranked by skill match.
        </p>
      </div>

      <Card>
        <div className="space-y-2.5">
          {applications.length === 0 && <p className="text-muted text-sm">No applicants yet.</p>}
          {applications.map((a) => (
            <div
              key={a.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-bg border border-border px-3.5 py-3 rounded-lg text-[13.5px]"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="font-semibold truncate">{a.student?.name ?? "Candidate"}</span>
                <span className="text-xs text-muted truncate">{a.opportunity?.title}</span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="font-display font-bold text-cyan">{a.match_score}%</span>
                <select
                  value={a.status}
                  onChange={(e) => handleStatusChange(a.id, e.target.value as ApplicationStatus)}
                  className="bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs font-semibold text-text focus:outline-none focus:ring-2 focus:ring-cyan"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </Card>
      {ToastElement}
    </div>
  );
}