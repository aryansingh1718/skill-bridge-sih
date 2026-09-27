"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/lib/role-context";
import { getStudentProfile, updateStudentProfile } from "@/lib/queries";
import { StudentProfile } from "@/types";
import { Card } from "@/components/shared/Card";
import { useToast } from "@/components/shared/Toast";

export default function StudentProfilePage() {
  const { user } = useRole();
  const router = useRouter();
  const { showToast, ToastElement } = useToast();
  const [form, setForm] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    getStudentProfile(user.id).then((p) => {
      setForm(p);
      setLoading(false);
    });
  }, [user]);

  function update<K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) {
    setForm((f) => (f ? { ...f, [key]: value } : f));
  }

  async function handleSave() {
    if (!user || !form) return;
    setSaving(true);
    const { error } = await updateStudentProfile(user.id, form);
    setSaving(false);
    if (!error) {
      showToast("Profile updated");
      router.push("/dashboard/student");
    } else {
      showToast("Failed to save");
    }
  }

  if (loading || !form) return <p className="text-muted text-sm">Loading profile...</p>;

  const inputClass =
    "w-full bg-bg border border-border rounded-lg px-3.5 py-2.5 text-text text-[13.5px] focus:outline-none focus:ring-2 focus:ring-violet focus:border-violet";
  const labelClass = "block text-xs text-muted mb-1.5";

  return (
    <div>
      <div className="flex justify-between items-start flex-wrap gap-5 mb-6">
        <div>
          <h1 className="font-display text-[23px] font-bold tracking-tight">Edit profile</h1>
          <p className="text-muted text-[13.5px] mt-1">
            Update your details and career goal, this changes what the platform recommends.
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/student")}
          className="bg-card border border-border text-text text-[13.5px] font-semibold px-4.5 py-2.5 rounded-lg hover:border-muted transition-colors"
        >
          ← Back to dashboard
        </button>
      </div>

      <Card className="max-w-2xl">
        <div className="mb-6">
          <div className="text-[13px] font-bold mb-3.5">Basic information</div>
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className={labelClass}>Location</label>
              <input
                className={inputClass}
                value={form.location ?? ""}
                onChange={(e) => update("location", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>College</label>
              <input
                className={inputClass}
                value={form.college ?? ""}
                onChange={(e) => update("college", e.target.value)}
              />
            </div>
          </div>
          <div className="mt-3.5">
            <label className={labelClass}>Branch and year</label>
            <input
              className={inputClass}
              value={form.branch ?? ""}
              onChange={(e) => update("branch", e.target.value)}
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="text-[13px] font-bold mb-3.5">Career goal</div>
          <div>
            <label className={labelClass}>Target role</label>
            <select
              className={inputClass}
              value={form.target_role ?? ""}
              onChange={(e) => update("target_role", e.target.value)}
            >
              {[
                "Frontend Developer",
                "Backend Developer",
                "Full Stack Developer",
                "Data Analyst",
                "DevOps Engineer",
                "ML Engineer",
              ].map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
          </div>
          <div className="mt-3.5">
            <label className={labelClass}>Timeline</label>
            <select
              className={inputClass}
              value={form.timeline ?? ""}
              onChange={(e) => update("timeline", e.target.value)}
            >
              {["Within 3 months", "Within 6 months", "Within 1 year", "After graduation"].map(
                (t) => (
                  <option key={t}>{t}</option>
                )
              )}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-[13px] font-bold mb-3.5">About</div>
          <textarea
            className={`${inputClass} min-h-[90px] resize-y`}
            value={form.about ?? ""}
            onChange={(e) => update("about", e.target.value)}
          />
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-violet text-bg text-[13.5px] font-semibold px-4.5 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
          <button
            onClick={() => router.push("/dashboard/student")}
            className="bg-card border border-border text-text text-[13.5px] font-semibold px-4.5 py-2.5 rounded-lg hover:border-muted transition-colors"
          >
            Cancel
          </button>
        </div>
      </Card>
      {ToastElement}
    </div>
  );
}