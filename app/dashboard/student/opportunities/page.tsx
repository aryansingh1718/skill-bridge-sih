"use client";

import { useEffect, useState } from "react";
import { useRole } from "@/lib/role-context";
import {
  getStudentSkills,
  getOpportunitiesWithSkills,
  computeMatchScore,
  applyToOpportunity,
  getStudentApplications,
} from "@/lib/queries";
import { StudentSkill, Opportunity, OpportunitySkill } from "@/types";
import { Card } from "@/components/shared/Card";
import { RowItem } from "@/components/shared/RowItem";
import { useToast } from "@/components/shared/Toast";

export default function StudentOpportunitiesPage() {
  const { user } = useRole();
  const [skills, setSkills] = useState<StudentSkill[]>([]);
  const [opportunities, setOpportunities] = useState<
    (Opportunity & { skills: OpportunitySkill[] })[]
  >([]);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { showToast, ToastElement } = useToast();

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [s, o, apps] = await Promise.all([
        getStudentSkills(user.id),
        getOpportunitiesWithSkills(),
        getStudentApplications(user.id),
      ]);
      setSkills(s);
      setOpportunities(o);
      setAppliedIds(new Set(apps.map((a) => a.opportunity_id)));
      setLoading(false);
    })();
  }, [user]);

  async function handleApply(opportunityId: string, match: number) {
    if (!user) return;
    const { error } = await applyToOpportunity(user.id, opportunityId, match);
    if (!error) {
      setAppliedIds((prev) => new Set(prev).add(opportunityId));
      showToast("Application submitted");
    } else {
      showToast("Something went wrong");
    }
  }

  if (loading) return <p className="text-muted text-sm">Loading opportunities...</p>;

  const ranked = opportunities
    .map((op) => ({ ...op, match: computeMatchScore(skills, op.skills) }))
    .sort((a, b) => b.match - a.match);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-[23px] font-bold tracking-tight">Opportunities</h1>
        <p className="text-muted text-[13.5px] mt-1">
          {ranked.length} open roles matched against your verified skills.
        </p>
      </div>

      <Card>
        <div className="space-y-2.5">
          {ranked.map((op) => {
            const applied = appliedIds.has(op.id);
            return (
              <RowItem key={op.id} title={op.title} meta={op.location ?? undefined}>
                <span className="font-display font-bold text-violet">{op.match}%</span>
                <button
                  disabled={applied}
                  onClick={() => handleApply(op.id, op.match)}
                  className={`text-xs font-semibold px-3.5 py-2 rounded-lg transition-opacity ${
                    applied
                      ? "bg-muted/20 text-muted cursor-default"
                      : "bg-violet text-bg hover:opacity-90"
                  }`}
                >
                  {applied ? "Applied" : "Apply"}
                </button>
              </RowItem>
            );
          })}
        </div>
      </Card>
      {ToastElement}
    </div>
  );
}