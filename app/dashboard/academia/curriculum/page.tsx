import { Card } from "@/components/shared/Card";

const mapping = [
  { skill: "JavaScript", demand: "Very high", coverage: "Partial", status: "warn" as const, label: "Needs work" },
  { skill: "React", demand: "Very high", coverage: "Low", status: "bad" as const, label: "Gap" },
  { skill: "SQL", demand: "High", coverage: "Strong", status: "good" as const, label: "Covered" },
  { skill: "Git", demand: "Very high", coverage: "Partial", status: "warn" as const, label: "Needs work" },
  { skill: "Docker", demand: "Medium", coverage: "Low", status: "bad" as const, label: "Gap" },
  { skill: "Computer Networks", demand: "Medium", coverage: "Strong", status: "good" as const, label: "Covered" },
];

const statusColor = {
  good: "bg-mint",
  warn: "bg-amber",
  bad: "bg-red",
};
const statusText = {
  good: "text-mint",
  warn: "text-amber",
  bad: "text-red",
};

export default function AcademiaCurriculumPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-[23px] font-bold tracking-tight">
          Curriculum mapping
        </h1>
        <p className="text-muted text-[13.5px] mt-1">
          B.Tech CSE at SLIET, curriculum coverage against industry
          requirements for Full Stack Development.
        </p>
      </div>

      <div className="rounded-xl p-5 mb-4 bg-gradient-to-br from-indigo/[.16] to-cyan/[.12] border border-violet/30">
        <div className="text-xs font-bold text-violet mb-2.5">
          AI industry insight
        </div>
        <p className="text-[13.5px] leading-relaxed mb-3.5">
          TypeScript and Docker have shown rising demand across Full Stack
          Development postings this term. SLIET&apos;s current curriculum has
          limited explicit coverage of either.
        </p>
        <button className="bg-violet text-bg text-[13.5px] font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
          View full breakdown
        </button>
      </div>

      <Card>
  <div className="overflow-x-auto">
    <table className="w-full text-[13.5px] border-collapse min-w-[500px]">
          <thead>
            <tr>
              {["Skill", "Industry demand", "Curriculum coverage", "Status"].map((h) => (
                <th key={h} className="text-left text-[11.5px] text-muted font-semibold pb-3 px-2.5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mapping.map((row) => (
              <tr key={row.skill} className="border-t border-border">
                <td className="py-3 px-2.5">{row.skill}</td>
                <td className="py-3 px-2.5">{row.demand}</td>
                <td className="py-3 px-2.5">{row.coverage}</td>
                <td className="py-3 px-2.5">
                  <span className={`inline-flex items-center gap-1.5 font-semibold ${statusText[row.status]}`}>
                    <span className={`w-2 h-2 rounded-full ${statusColor[row.status]}`} />
                    {row.label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  );
}