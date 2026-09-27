export function Card({
  title,
  subtitle,
  children,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-card border border-border rounded-xl p-6 ${className}`}>
      {title && (
        <h3 className="text-[15px] font-semibold mb-0.5">{title}</h3>
      )}
      {subtitle && (
        <p className="text-muted text-xs mb-4.5 mb-[18px]">{subtitle}</p>
      )}
      {children}
    </div>
  );
}