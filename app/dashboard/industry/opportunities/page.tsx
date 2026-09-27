"use client";

import { useEffect, useState, useCallback } from "react";
import { useRole } from "@/lib/role-context";
import { getOpportunitiesByIndustry, getApplicationCountsByOpportunity } from "@/lib/queries";
import { Opportunity } from "@/types";
import { Card } from "@/components/shared/Card";
import { RowItem } from "@/components/shared/RowItem";
import { Badge } from "@/components/shared/Badge";
import { OpportunityFormModal } from "@/components/industry/OpportunityFormModal";
import { useToast } from "@/components/shared/Toast";

export default function IndustryOpportunitiesPage() {
  const { user } = useRole();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Opportunity | null>(null);
  const { showToast, ToastElement } = useToast();

  const load = useCallback(async () => {
    if (!user) return;
    const ops = await getOpportunitiesByIndustry(user.id);
    setOpportunities(ops);
    setCounts(await getApplicationCountsByOpportunity(ops.map((o) => o.id)));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(op: Opportunity) {
    setEditing(op);
    setModalOpen(true);
  }

  function handleSaved() {
    showToast(editing ? "Opportunity updated" : "Opportunity posted");
    load();
  }

  if (loading) return <p className="text-muted text-sm">Loading opportunities...</p>;

  return (
    <div>
      <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
        <div>
          <h1 className="font-display text-[20px] sm:text-[23px] font-bold tracking-tight">
            My opportunities
          </h1>
          <p className="text-muted text-[13.5px] mt-1">Roles you&apos;ve posted on SkillBridge.</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-cyan text-bg text-[13.5px] font-semibold px-4.5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
        >
          Post opportunity
        </button>
      </div>

      <Card>
        <div className="space-y-2.5">
          {opportunities.length === 0 && (
            <p className="text-muted text-sm">You haven&apos;t posted any opportunities yet.</p>
          )}
          {opportunities.map((op) => (
            <RowItem key={op.id} title={op.title} meta={`${counts[op.id] ?? 0} applicants`}>
              <Badge variant={op.status}>{op.status === "active" ? "Active" : "Closed"}</Badge>
              <button
                onClick={() => openEdit(op)}
                className="text-xs font-semibold text-cyan hover:underline"
              >
                Edit
              </button>
            </RowItem>
          ))}
        </div>
      </Card>

      {user && (
        <OpportunityFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
          industryId={user.id}
          editingOpportunity={editing}
        />
      )}
      {ToastElement}
    </div>
  );
}