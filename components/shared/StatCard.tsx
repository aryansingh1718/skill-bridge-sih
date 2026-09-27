export function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: "violet" | "cyan" | "mint";
}) {
  const accentClass = {
    violet: "text-violet",
    cyan: "text-cyan",
    mint: "text-mint",
  }[accent];

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="text-muted text-[12.5px] mb-2.5">{label}</div>
      <div className={`font-display font-bold text-[26px] ${accentClass}`}>
        {value}
      </div>
    </div>
  );
}