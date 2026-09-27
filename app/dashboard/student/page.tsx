"use client";

import { useEffect, useState } from "react";
import { useRole } from "@/lib/role-context";
import {
  getStudentProfile,
  getStudentSkills,
  getOpportunitiesWithSkills,
  computeMatchScore,
} from "@/lib/queries";
import { StudentProfile, StudentSkill, Opportunity, OpportunitySkill } from "@/types";
import { StatCard } from "@/components/shared/StatCard";
import { Card } from "@/components/shared/Card";
import { SkillBar } from "@/components/shared/SkillBar";
import { RowItem } from "@/components/shared/RowItem";

export default function StudentOverview() {
  const { user } = useRole();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [skills, setSkills] = useState<StudentSkill[]>([]);
  const [opportunities, setOpportunities] = useState<
    (Opportunity & { skills: OpportunitySkill[] })[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [p, s, o] = await Promise.all([
        getStudentProfile(user.id),
        getStudentSkills(user.id),
        getOpportunitiesWithSkills(),
      ]);
      setProfile(p);
      setSkills(s);
      setOpportunities(o);
      setLoading(false);
    })();
  }, [user]);

  if (loading || !user) {
    return <p className="text-muted text-sm">Loading your dashboard...</p>;
  }

  const readiness = skills.length
    ? Math.round(skills.reduce((sum, s) => sum + s.score, 0) / skills.length)
    : 0;
  const verifiedCount = skills.filter((s) => s.verified).length;
  const gaps = skills.filter((s) => s.score < 50).slice(0, 3);
  const lowestSkill = [...skills].sort((a, b) => a.score - b.score)[0];

  const ranked = opportunities
    .map((op) => ({ ...op, match: computeMatchScore(skills, op.skills) }))
    .sort((a, b) => b.match - a.match)
    .slice(0, 3);

  return (
    <div>
      <div className="flex justify-between items-start flex-wrap gap-5 mb-6">
        <div>
          <h1 className="font-display text-[23px] font-bold tracking-tight">
            Good morning, {user.name.split(" ")[0]}
          </h1>
          <p className="text-muted text-[13.5px] mt-1">
            Your career profile is getting stronger, keep closing those skill gaps.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Skill readiness" value={`${readiness}%`} accent="violet" />
        <StatCard label="Verified skills" value={verifiedCount} accent="violet" />
        <StatCard label="Recommended opportunities" value={opportunities.length} accent="violet" />
        <StatCard label="Skill gaps" value={gaps.length} accent="violet" />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <Card title="Your skill profile" subtitle="Verified through assessments and reviewed projects">
          {skills.slice(0, 4).map((s) => (
            <SkillBar
              key={s.id}
              name={s.skill?.name ?? "Skill"}
              score={s.score}
              verified={s.verified}
              accent="violet"
            />
          ))}
        </Card>

        <Card
          title={`Career progress, ${profile?.target_role ?? "your goal"}`}
          subtitle="Based on your current goal"
        >
          <SkillBar name="Overall readiness" score={readiness} accent="violet" />
          {lowestSkill && (
            <p className="text-[13px] text-muted mt-4">
              Next milestone:{" "}
              <strong className="text-text">{lowestSkill.skill?.name}</strong>.
              Keep practicing to raise this score.
            </p>
          )}
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Recommended opportunities" subtitle="Matched against your verified skills">
          <div className="space-y-2.5">
            {ranked.map((op) => (
              <RowItem key={op.id} title={op.title}>
                <span className="font-display font-bold text-violet">{op.match}%</span>
              </RowItem>
            ))}
          </div>
        </Card>

        <Card title="Your skill gaps" subtitle="Closing these would raise your readiness score">
          <div className="flex flex-wrap gap-2">
            {gaps.map((g) => (
              <span
                key={g.id}
                className="bg-red/10 text-red border border-red/25 px-3.5 py-2 rounded-lg text-sm font-semibold"
              >
                {g.skill?.name}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}