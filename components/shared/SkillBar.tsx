"use client";

import { useEffect, useState } from "react";
import { Badge } from "./Badge";

export function SkillBar({
  name,
  score,
  verified = false,
  accent = "violet",
}: {
  name: string;
  score: number;
  verified?: boolean;
  accent?: "violet" | "cyan" | "mint";
}) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 50);
    return () => clearTimeout(t);
  }, [score]);

  const gradient = {
    violet: "from-indigo to-violet",
    cyan: "from-indigo to-cyan",
    mint: "from-mint to-cyan",
  }[accent];

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between items-center text-sm mb-1.5">
        <span className="flex items-center gap-2">
          {name}
          {verified && <Badge variant="verified" withDot>Verified</Badge>}
        </span>
        <span className="text-muted">{score}%</span>
      </div>
      <div className="h-[7px] bg-bg rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}