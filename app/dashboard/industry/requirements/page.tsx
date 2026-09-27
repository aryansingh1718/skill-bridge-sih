"use client";

import { useEffect, useState } from "react";
import { useRole } from "@/lib/role-context";
import { getOpportunitiesByIndustry, getOpportunitySkills } from "@/lib/queries";
import { Opportunity, OpportunitySkill } from "@/types";
import { Card } from "@/components/shared/Card";

export default function IndustryRequirementsPage() {
  const { user } = useRole();
  const [sets, setSets] = useState<
    { opportunity: Opportunity; skills: OpportunitySkill[] }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const ops = await getOpportunitiesByIndustry(user.id);
      const withSkills = await Promise.all(
        ops.map(async (op) => ({ opportunity: op, skills: await getOpportunitySkills(op.id) }))
      );
      setSets(withSkills);
      setLoading(false);
    })();
  }, [user]);

  if (loading) return <p className="text-muted text-sm">Loading requirements...</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-[23px] font-bold tracking-tight">Skill requirements</h1>
        <p className="text-muted text-[13.5px] mt-1">
          Requirement sets currently active across your postings.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {sets.map(({ opportunity, skills }) => (
          <Card key={opportunity.id} title={opportunity.title} subtitle="Extracted from the job description">
            <div className="divide-y divide-border">
              {skills.map((req) => (
                <div
                  key={req.id}
                  className="flex justify-between items-center py-2.5 text-[13.5px] first:pt-0 last:pb-0"
                >
                  <span>{req.skill?.name}</span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      req.level === "required" ? "bg-cyan/10 text-cyan" : "bg-muted/15 text-muted"
                    }`}
                  >
                    {req.level === "required" ? "Required" : "Preferred"}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}