export function Logo({ size = 26 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 26 26">
        <defs>
          <linearGradient id="lg-logo" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6366F1" />
            <stop offset="1" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
        <rect
          x="2"
          y="6"
          width="16"
          height="16"
          rx="4"
          transform="rotate(-18 10 14)"
          fill="url(#lg-logo)"
        />
        <rect
          x="8"
          y="2"
          width="16"
          height="16"
          rx="4"
          transform="rotate(-18 16 10)"
          fill="#8B5CF6"
          opacity="0.85"
        />
      </svg>
      <div className="font-display font-bold text-lg tracking-tight text-text">
        Skill
        <span className="bg-gradient-to-br from-indigo via-violet to-cyan bg-clip-text text-transparent">
          Bridge
        </span>
      </div>
    </div>
  );
}