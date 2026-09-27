"use client";

import { useRouter } from "next/navigation";
import { Logo } from "@/components/shared/Logo";
import { useRole } from "@/lib/role-context";
import { Role } from "@/types";

interface Persona {
  role: Role;
  label: string;
  profileId: string; 
  description: string;
  dummyName: string;
  meta: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
  glow: string;
  icon: React.ReactNode;
}

const personas: Persona[] = [
  {
    role: "student",
    label: "Student",
    profileId: "11111111-1111-1111-1111-111111111111",
    description:
      "Track your verified skills, close your gaps, and get matched to real opportunities.",
    dummyName: "Aryan Singh",
    meta: "B.Tech CSE · SLIET",
    accentText: "text-violet",
    accentBg: "bg-violet",
    accentBorder: "hover:border-violet",
    glow: "group-hover:shadow-[0_0_0_1px_#8B5CF6,0_20px_40px_-15px_#8B5CF680]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" y1="20" x2="6" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="18" y1="20" x2="18" y2="14" />
      </svg>
    ),
  },
  {
    role: "industry",
    label: "Industry Partner",
    profileId: "22222222-2222-2222-2222-222222222222",
    description:
      "Post roles, extract skill requirements automatically, and rank applicants by verified match.",
    dummyName: "Nexora Systems",
    meta: "Hiring partner",
    accentText: "text-cyan",
    accentBg: "bg-cyan",
    accentBorder: "hover:border-cyan",
    glow: "group-hover:shadow-[0_0_0_1px_#22D3EE,0_20px_40px_-15px_#22D3EE80]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="8" width="18" height="12" rx="2" />
        <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  },
  {
    role: "academia",
    label: "Academia",
    profileId: "33333333-3333-3333-3333-333333333333",
    description:
      "Verify enrolled students and map your curriculum against real industry demand.",
    dummyName: "SLIET",
    meta: "Academic institution",
    accentText: "text-mint",
    accentBg: "bg-mint",
    accentBorder: "hover:border-mint",
    glow: "group-hover:shadow-[0_0_0_1px_#34D399,0_20px_40px_-15px_#34D39980]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { loginAs } = useRole();

  function handleSelect(persona: Persona) {
  loginAs({
    role: persona.role,
    name: persona.dummyName,
    id: persona.profileId, // was `dummy-${persona.role}`
  });
  router.push(`/dashboard/${persona.role}`);
}

  return (
    <main className="relative min-h-screen bg-bg flex flex-col items-center px-6 py-12 sm:py-16 overflow-y-auto">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -left-32 w-[480px] h-[480px] rounded-full bg-indigo/25 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 w-[420px] h-[420px] rounded-full bg-cyan/15 blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 w-[440px] h-[440px] rounded-full bg-violet/20 blur-[120px]" />
        {/* Subtle dot grid texture */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #263451 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full">
        <div className="mb-8">
          <Logo size={34} />
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-text mb-3 text-center tracking-tight max-w-xl">
          One platform, three sides of the{" "}
          <span className="bg-gradient-to-r from-indigo via-violet to-cyan bg-clip-text text-transparent">
            skills gap
          </span>
        </h1>
        <p className="text-muted text-sm sm:text-base mb-14 text-center max-w-md leading-relaxed">
          No real credentials needed here, pick a persona below to explore
          the platform from that side.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-4xl">
          {personas.map((persona, i) => (
            <button
              key={persona.role}
              onClick={() => handleSelect(persona)}
              className={`group relative text-left bg-card border border-border rounded-2xl p-6 pt-7 transition-all duration-300 ease-out hover:-translate-y-1.5 ${persona.accentBorder} ${persona.glow}`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* top accent bar */}
              <div
                className={`absolute top-0 left-6 right-6 h-[3px] rounded-full ${persona.accentBg} opacity-70`}
              />

              <div
                className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-bg border border-border mb-5 ${persona.accentText}`}
              >
                {persona.icon}
              </div>

              <div className={`font-display font-bold text-lg mb-1.5 ${persona.accentText}`}>
                {persona.label}
              </div>
              <p className="text-muted text-[13px] leading-relaxed mb-6 min-h-[54px]">
                {persona.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex flex-col">
                  <span className="text-text text-[13px] font-semibold">
                    {persona.dummyName}
                  </span>
                  <span className="text-muted text-[11px]">{persona.meta}</span>
                </div>
                <span
                  className={`text-[12px] font-semibold ${persona.accentText} opacity-0 group-hover:opacity-100 transition-opacity`}
                >
                  Enter →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}