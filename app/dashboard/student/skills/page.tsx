"use client";

import { useEffect, useState } from "react";
import { useRole } from "@/lib/role-context";
import { getStudentSkills } from "@/lib/queries";
import { StudentSkill } from "@/types";
import { Card } from "@/components/shared/Card";
import { SkillBar } from "@/components/shared/SkillBar";

export default function StudentSkillsPage() {
  const { user } = useRole();
  const [skills, setSkills] = useState<StudentSkill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getStudentSkills(user.id).then((s) => {
      setSkills(s);
      setLoading(false);
    });
  }, [user]);

  if (loading) return <p className="text-muted text-sm">Loading skills...</p>;

  const grouped = skills.reduce<Record<string, StudentSkill[]>>((acc, s) => {
    const cat = s.skill?.category ?? "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-[23px] font-bold tracking-tight">My skills</h1>
        <p className="text-muted text-[13.5px] mt-1">
          Full breakdown of your assessed and verified skills.
        </p>
      </div>

      <Card>
        {Object.entries(grouped).map(([category, list], i) => (
          <div key={category} className={i > 0 ? "mt-5" : ""}>
            <div className="text-xs font-semibold text-muted mb-3">{category}</div>
            {list.map((s) => (
              <SkillBar
                key={s.id}
                name={s.skill?.name ?? "Skill"}
                score={s.score}
                verified={s.verified}
                accent="violet"
              />
            ))}
          </div>
        ))}
      </Card>
    </div>
  );
}