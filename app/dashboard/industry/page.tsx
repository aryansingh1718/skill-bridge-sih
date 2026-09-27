"use client";

import { useEffect, useState, useCallback } from "react";
import { useRole } from "@/lib/role-context";
import {
  getOpportunitiesByIndustry,
  getApplicationsForIndustry,
  getOpportunitySkills,
} from "@/lib/queries";
import { Opportunity, Application, OpportunitySkill } from "@/types";
import { StatCard } from "@/components/shared/StatCard";
import { Card } from "@/components/shared/Card";
import { RowItem } from "@/components/shared/RowItem";
import { OpportunityFormModal } from "@/components/industry/OpportunityFormModal";
import { useToast } from "@/components/shared/Toast";

export default function IndustryOverview() {
  const { user } = useRole();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [firstOppSkills, setFirstOppSkills] = useState<OpportunitySkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Opportunity | null>(null);
  const { showToast, ToastElement } = useToast();

  const load = useCallback(async () => {
    if (!user) return;
    const [ops, apps] = await Promise.all([
      getOpportunitiesByIndustry(user.id),
      getApplicationsForIndustry(user.id),
    ]);
    setOpportunities(ops);
    setApplications(apps);
    if (ops[0]) setFirstOppSkills(await getOpportunitySkills(ops[0].id));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <p className="text-muted text-sm">Loading overview...</p>;

  const avgMatch = applications.length
    ? Math.round(applications.reduce((sum, a) => sum + (a.match_score ?? 0), 0) / applications.length)
    : 0;
  const pendingReviews = applications.filter((a) => a.status === "under_review").length;
  const topCandidates = [...applications]
    .sort((a, b) => (b.match_score ?? 0) - (a.match_score ?? 0))
    .slice(0, 3);

  return (
    <div>
      <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
        <div>
          <h1 className="font-display text-[20px] sm:text-[23px] font-bold tracking-tight">Overview</h1>
          <p className="text-muted text-[13.5px] mt-1">{user?.name}, hiring pipeline snapshot.</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="bg-cyan text-bg text-[13.5px] font-semibold px-4.5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
        >
          Post opportunity
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
        <StatCard
          label="Active opportunities"
          value={opportunities.filter((o) => o.status === "active").length}
          accent="cyan"
        />
        <StatCard label="Total applicants" value={applications.length} accent="cyan" />
        <StatCard label="Average skill match" value={`${avgMatch}%`} accent="cyan" />
        <StatCard label="Pending reviews" value={pendingReviews} accent="cyan" />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {opportunities[0] && (
          <Card
            title={opportunities[0].title}
            subtitle={firstOppSkills.map((s) => s.skill?.name).join(", ")}
          >
            <div className="flex gap-2.5 flex-wrap">
              <button
                onClick={() => {
                  setEditing(opportunities[0]);
                  setModalOpen(true);
                }}
                className="bg-bg border border-border text-text text-[13.5px] font-semibold px-4 py-2.5 rounded-lg hover:border-muted transition-colors"
              >
                Edit opportunity
              </button>
            </div>
          </Card>
        )}

        {opportunities[0] && (
          <Card title="Requirements" subtitle="Skills configured for this posting">
            <div className="divide-y divide-border">
              {firstOppSkills.map((req) => (
                <div key={req.id} className="flex justify-between items-center py-2.5 text-[13.5px] first:pt-0 last:pb-0">
                  <span>{req.skill?.name}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${req.level === "required" ? "bg-cyan/10 text-cyan" : "bg-muted/15 text-muted"}`}>
                    {req.level === "required" ? "Required" : "Preferred"}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <Card title="Top matching candidates" subtitle="Ranked by verified skill match">
        <div className="space-y-2.5">
          {topCandidates.map((a) => (
            <RowItem key={a.id} title={a.student?.name ?? "Candidate"}>
              <span className="font-display font-bold text-cyan">{a.match_score}%</span>
            </RowItem>
          ))}
        </div>
      </Card>

      {user && (
        <OpportunityFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            showToast(editing ? "Opportunity updated" : "Opportunity posted");
            load();
          }}
          industryId={user.id}
          editingOpportunity={editing}
        />
      )}
      {ToastElement}
    </div>
  );
}