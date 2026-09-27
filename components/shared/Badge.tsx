type BadgeVariant =
  | "verified"
  | "pending"
  | "gap"
  | "review"
  | "shortlisted"
  | "interview"
  | "rejected"
  | "active"
  | "closed";

const variantStyles: Record<BadgeVariant, string> = {
  verified: "bg-mint/10 text-mint",
  pending: "bg-amber/10 text-amber",
  gap: "bg-red/10 text-red",
  review: "bg-amber/10 text-amber",
  shortlisted: "bg-cyan/10 text-cyan",
  interview: "bg-violet/10 text-violet",
  rejected: "bg-red/10 text-red",
  active: "bg-cyan/10 text-cyan",
  closed: "bg-muted/15 text-muted",
};

export function Badge({
  variant,
  children,
  withDot = false,
}: {
  variant: BadgeVariant;
  children: React.ReactNode;
  withDot?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${variantStyles[variant]}`}
    >
      {withDot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}