export type Role = "student" | "industry" | "academia";

export interface Profile {
  id: string;
  role: Role;
  name: string;
  email: string | null;
  created_at: string;
}

export interface StudentProfile {
  id: string;
  college: string | null;
  branch: string | null;
  year: string | null;
  target_role: string | null;
  timeline: string | null;
  about: string | null;
  location: string | null;
}

export interface IndustryProfile {
  id: string;
  company_name: string | null;
  industry_sector: string | null;
}

export interface AcademiaProfile {
  id: string;
  institution_name: string | null;
}

export interface Skill {
  id: string;
  name: string;
  category: string | null;
}

export interface StudentSkill {
  id: string;
  student_id: string;
  skill_id: string;
  score: number;
  verified: boolean;
  skill?: Skill; // populated when joined
}

export type OpportunityStatus = "active" | "closed";

export interface Opportunity {
  id: string;
  industry_id: string;
  title: string;
  location: string | null;
  status: OpportunityStatus;
  created_at: string;
}

export type SkillLevel = "required" | "preferred";

export interface OpportunitySkill {
  id: string;
  opportunity_id: string;
  skill_id: string;
  level: SkillLevel;
  skill?: Skill;
}

export type ApplicationStatus =
  | "under_review"
  | "shortlisted"
  | "interview"
  | "rejected";

export interface Application {
  id: string;
  student_id: string;
  opportunity_id: string;
  status: ApplicationStatus;
  match_score: number | null;
  applied_at: string;
  student?: Profile;
  opportunity?: Opportunity;
}

export type VerificationStatus = "pending" | "verified";

export interface Verification {
  id: string;
  student_id: string;
  academia_id: string;
  roll_no: string | null;
  status: VerificationStatus;
  requested_at: string;
  student?: Profile & { student_profile?: StudentProfile };
}