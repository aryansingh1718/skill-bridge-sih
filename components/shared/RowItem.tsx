export function RowItem({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-center gap-3 bg-bg border border-border px-3.5 py-3 rounded-lg text-[13.5px]">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="font-semibold truncate">{title}</span>
        {meta && <span className="text-xs text-muted truncate">{meta}</span>}
      </div>
      {children && (
        <div className="flex items-center gap-3 flex-shrink-0">{children}</div>
      )}
    </div>
  );
}