"use client";

import { useEffect, useState } from "react";
import { useRole } from "@/lib/role-context";
import { getVerificationsForAcademia, markVerified } from "@/lib/queries";
import { Verification } from "@/types";
import { StatCard } from "@/components/shared/StatCard";
import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";

export default function AcademiaVerifyPage() {
  const { user } = useRole();
  const [requests, setRequests] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getVerificationsForAcademia(user.id).then((v) => {
      setRequests(v);
      setLoading(false);
    });
  }, [user]);

  async function handleVerify(id: string) {
    const { error } = await markVerified(id);
    if (!error) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "verified" } : r))
      );
    }
  }

  if (loading) return <p className="text-muted text-sm">Loading requests...</p>;

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const verifiedCount = requests.filter((r) => r.status === "verified").length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-[23px] font-bold tracking-tight">Verify students</h1>
        <p className="text-muted text-[13.5px] mt-1">
          Confirm whether a candidate is currently enrolled before their profile is approved on SkillBridge.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        <StatCard label="Verification requests" value={pendingCount} accent="mint" />
        <StatCard label="Verified this month" value={verifiedCount} accent="mint" />
        <StatCard label="Average response time" value="2 days" accent="mint" />
      </div>

      <Card title="Pending requests" subtitle="Cross-checked against your institution's enrollment records">
        <div className="space-y-2.5">
          {requests.map((r) => (
            <div
              key={r.id}
              className="flex justify-between items-center gap-3 bg-bg border border-border px-3.5 py-3 rounded-lg text-[13.5px]"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="font-semibold truncate">{r.student?.name}</span>
                <span className="text-xs text-muted truncate">
                  Roll No. {r.roll_no}
                  {r.student?.student_profile
                    ? `, ${r.student.student_profile.branch}, ${r.student.student_profile.year}`
                    : ""}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {r.status === "verified" ? (
                  <Badge variant="verified" withDot>Verified</Badge>
                ) : (
                  <>
                    <Badge variant="pending">Pending</Badge>
                    <button
                      onClick={() => handleVerify(r.id)}
                      className="bg-mint text-bg text-xs font-semibold px-3.5 py-2 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Verify
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}