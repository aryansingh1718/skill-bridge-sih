import { supabase } from "./supabase";
import {
  Profile,
  StudentProfile,
  StudentSkill,
  Opportunity,
  OpportunitySkill,
  Application,
  Verification,
} from "@/types";

export async function getProfile(id: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function getStudentProfile(
  id: string
): Promise<StudentProfile | null> {
  const { data, error } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function updateStudentProfile(
  id: string,
  updates: Partial<StudentProfile>
) {
  return supabase.from("student_profiles").update(updates).eq("id", id);
}

export async function getStudentSkills(
  studentId: string
): Promise<StudentSkill[]> {
  const { data, error } = await supabase
    .from("student_skills")
    .select("*, skill:skills(*)")
    .eq("student_id", studentId);
  if (error || !data) return [];
  return data as unknown as StudentSkill[];
}

export async function getOpportunities(): Promise<Opportunity[]> {
  const { data, error } = await supabase
    .from("opportunities")
    .select("*")
    .eq("status", "active");
  if (error || !data) return [];
  return data;
}

export async function getOpportunitiesByIndustry(
  industryId: string
): Promise<Opportunity[]> {
  const { data, error } = await supabase
    .from("opportunities")
    .select("*")
    .eq("industry_id", industryId);
  if (error || !data) return [];
  return data;
}

export async function getOpportunitySkills(
  opportunityId: string
): Promise<OpportunitySkill[]> {
  const { data, error } = await supabase
    .from("opportunity_skills")
    .select("*, skill:skills(*)")
    .eq("opportunity_id", opportunityId);
  if (error || !data) return [];
  return data as unknown as OpportunitySkill[];
}

export async function getStudentApplications(
  studentId: string
): Promise<Application[]> {
  const { data, error } = await supabase
    .from("applications")
    .select("*, opportunity:opportunities(*)")
    .eq("student_id", studentId);
  if (error || !data) return [];
  return data as unknown as Application[];
}

export async function getApplicationsForIndustry(
  industryId: string
): Promise<Application[]> {
  const { data, error } = await supabase
    .from("applications")
    .select("*, student:profiles(*), opportunity:opportunities!inner(*)")
    .eq("opportunity.industry_id", industryId);
  if (error || !data) return [];
  return data as unknown as Application[];
}

export async function applyToOpportunity(
  studentId: string,
  opportunityId: string,
  matchScore: number
) {
  return supabase.from("applications").insert({
    student_id: studentId,
    opportunity_id: opportunityId,
    match_score: matchScore,
    status: "under_review",
  });
}

export async function getVerificationsForAcademia(
  academiaId: string
): Promise<Verification[]> {
  const { data, error } = await supabase
    .from("verifications")
    .select(
      "*, student:profiles!verifications_student_id_fkey(*, student_profile:student_profiles(*))"
    )
    .eq("academia_id", academiaId);
  if (error) {
    console.error("getVerificationsForAcademia error:", error);
    return [];
  }
  if (!data) return [];
  return data as unknown as Verification[];
}

export async function markVerified(verificationId: string) {
  return supabase
    .from("verifications")
    .update({ status: "verified" })
    .eq("id", verificationId);
}
export async function getOpportunitiesWithSkills(): Promise<
  (Opportunity & { skills: OpportunitySkill[] })[]
> {
  const opportunities = await getOpportunities();
  return Promise.all(
    opportunities.map(async (op) => ({
      ...op,
      skills: await getOpportunitySkills(op.id),
    }))
  );
}

export function computeMatchScore(
  studentSkills: StudentSkill[],
  requiredSkills: OpportunitySkill[]
): number {
  if (requiredSkills.length === 0) return 0;
  const scoreMap = new Map(studentSkills.map((s) => [s.skill_id, s.score]));
  const total = requiredSkills.reduce(
    (sum, req) => sum + (scoreMap.get(req.skill_id) ?? 0),
    0
  );
  return Math.round(total / requiredSkills.length);
}

export async function getApplicationCountsByOpportunity(
  opportunityIds: string[]
): Promise<Record<string, number>> {
  if (opportunityIds.length === 0) return {};
  const { data, error } = await supabase
    .from("applications")
    .select("opportunity_id")
    .in("opportunity_id", opportunityIds);
  if (error || !data) return {};
  const counts: Record<string, number> = {};
  data.forEach((row: { opportunity_id: string }) => {
    counts[row.opportunity_id] = (counts[row.opportunity_id] || 0) + 1;
  });
  return counts;
}

export async function createOpportunity(
  industryId: string,
  title: string,
  location: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from("opportunities")
    .insert({ industry_id: industryId, title, location, status: "active" })
    .select("id")
    .single();
  if (error || !data) {
    console.error("createOpportunity error:", error);
    return null;
  }
  return data.id;
}

export async function updateOpportunity(
  id: string,
  updates: { title?: string; location?: string; status?: string }
) {
  return supabase.from("opportunities").update(updates).eq("id", id);
}

export async function setOpportunitySkills(
  opportunityId: string,
  skillEntries: { skillId: string; level: "required" | "preferred" }[]
) {
  // Replace existing skills for this opportunity
  await supabase.from("opportunity_skills").delete().eq("opportunity_id", opportunityId);
  if (skillEntries.length === 0) return { error: null };
  return supabase.from("opportunity_skills").insert(
    skillEntries.map((s) => ({
      opportunity_id: opportunityId,
      skill_id: s.skillId,
      level: s.level,
    }))
  );
}

export async function getAllSkills() {
  const { data, error } = await supabase.from("skills").select("*").order("name");
  if (error || !data) return [];
  return data;
}

export async function updateApplicationStatus(
  applicationId: string,
  status: "under_review" | "shortlisted" | "interview" | "rejected"
) {
  return supabase.from("applications").update({ status }).eq("id", applicationId);
}