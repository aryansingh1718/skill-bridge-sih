"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/shared/Modal";
import {
  createOpportunity,
  updateOpportunity,
  setOpportunitySkills,
  getAllSkills,
  getOpportunitySkills,
} from "@/lib/queries";
import { Skill } from "@/types";

interface SelectedSkill {
  skillId: string;
  name: string;
  level: "required" | "preferred";
}

export function OpportunityFormModal({
  open,
  onClose,
  onSaved,
  industryId,
  editingOpportunity,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  industryId: string;
  editingOpportunity?: { id: string; title: string; location: string | null } | null;
}) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [selected, setSelected] = useState<SelectedSkill[]>([]);
  const [pickerSkillId, setPickerSkillId] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    getAllSkills().then(setAllSkills);

    if (editingOpportunity) {
      setTitle(editingOpportunity.title);
      setLocation(editingOpportunity.location ?? "");
      getOpportunitySkills(editingOpportunity.id).then((skills) => {
        setSelected(
          skills.map((s) => ({
            skillId: s.skill_id,
            name: s.skill?.name ?? "",
            level: s.level,
          }))
        );
      });
    } else {
      setTitle("");
      setLocation("");
      setSelected([]);
    }
  }, [open, editingOpportunity]);

  function addSkill() {
    if (!pickerSkillId) return;
    const skill = allSkills.find((s) => s.id === pickerSkillId);
    if (!skill || selected.some((s) => s.skillId === skill.id)) return;
    setSelected((prev) => [...prev, { skillId: skill.id, name: skill.name, level: "required" }]);
    setPickerSkillId("");
  }

  function toggleLevel(skillId: string) {
    setSelected((prev) =>
      prev.map((s) =>
        s.skillId === skillId
          ? { ...s, level: s.level === "required" ? "preferred" : "required" }
          : s
      )
    );
  }

  function removeSkill(skillId: string) {
    setSelected((prev) => prev.filter((s) => s.skillId !== skillId));
  }

  async function handleSubmit() {
    if (!title.trim()) return;
    setSaving(true);

    let opportunityId = editingOpportunity?.id;
    if (opportunityId) {
      await updateOpportunity(opportunityId, { title, location });
    } else {
      opportunityId = (await createOpportunity(industryId, title, location)) ?? undefined;
    }

    if (opportunityId) {
      await setOpportunitySkills(
        opportunityId,
        selected.map((s) => ({ skillId: s.skillId, level: s.level }))
      );
    }

    setSaving(false);
    onSaved();
    onClose();
  }

  const inputClass =
    "w-full bg-bg border border-border rounded-lg px-3.5 py-2.5 text-text text-[13.5px] focus:outline-none focus:ring-2 focus:ring-cyan focus:border-cyan";
  const labelClass = "block text-xs text-muted mb-1.5";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingOpportunity ? "Edit opportunity" : "Post a new opportunity"}
    >
      <div className="space-y-4">
        <div>
          <label className={labelClass}>Role title</label>
          <input
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Frontend Developer Intern"
          />
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <input
            className={inputClass}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Remote, Chandigarh, etc."
          />
        </div>

        <div>
          <label className={labelClass}>Required / preferred skills</label>
          <div className="flex gap-2 mb-3">
            <select
              className={`${inputClass} flex-1`}
              value={pickerSkillId}
              onChange={(e) => setPickerSkillId(e.target.value)}
            >
              <option value="">Select a skill to add...</option>
              {allSkills
                .filter((s) => !selected.some((sel) => sel.skillId === s.id))
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
            <button
              onClick={addSkill}
              className="bg-cyan text-bg text-[13.5px] font-semibold px-4 rounded-lg hover:opacity-90 flex-shrink-0"
            >
              Add
            </button>
          </div>

          <div className="space-y-2">
            {selected.map((s) => (
              <div
                key={s.skillId}
                className="flex items-center justify-between gap-2 bg-bg border border-border rounded-lg px-3 py-2"
              >
                <span className="text-[13px]">{s.name}</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleLevel(s.skillId)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      s.level === "required" ? "bg-cyan/10 text-cyan" : "bg-muted/15 text-muted"
                    }`}
                  >
                    {s.level === "required" ? "Required" : "Preferred"}
                  </button>
                  <button onClick={() => removeSkill(s.skillId)} className="text-muted hover:text-red">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth={1.8} strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2.5 pt-2">
          <button
            onClick={handleSubmit}
            disabled={saving || !title.trim()}
            className="bg-cyan text-bg text-[13.5px] font-semibold px-4.5 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving..." : editingOpportunity ? "Save changes" : "Post opportunity"}
          </button>
          <button
            onClick={onClose}
            className="bg-bg border border-border text-text text-[13.5px] font-semibold px-4.5 py-2.5 rounded-lg hover:border-muted"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}