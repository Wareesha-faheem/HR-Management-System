"use client";

import { useContext, useState } from "react";
import { UserPlus } from "lucide-react";
import RecruitmentContext from "@/contexts/RecruitmentContext";
import AuthContext from "@/contexts/AuthContext";
import ToastContext from "@/contexts/ToastContext";
import { usePermissions } from "@/hooks/usePermissions";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import PipelineBoard from "./PipelineBoard";
import CandidateFormModal from "./CandidateFormModal";
import RequisitionsPanel from "./RequisitionsPanel";
import { MODULES, ACTIONS } from "@/utils/rbac";

export default function RecruitmentPage() {
  const { candidates, addCandidate, deleteCandidate } = useContext(RecruitmentContext);
  const { user } = useContext(AuthContext);
  const { toast } = useContext(ToastContext);
  const { can, isDeptScoped } = usePermissions();

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  const canCreate = can(MODULES.RECRUITMENT, ACTIONS.CREATE);
  const deptScoped = isDeptScoped(MODULES.RECRUITMENT);
  const visibleCount = deptScoped ? candidates.filter((c) => c.departmentId === user.departmentId).length : candidates.length;

  function handleSubmit(payload) {
    addCandidate(payload);
    toast({ title: "Candidate added", description: `${payload.name} added to pipeline.`, variant: "success" });
    setModalOpen(false);
  }

  function handleDelete() {
    deleteCandidate(confirmId);
    toast({ title: "Candidate removed" });
    setConfirmId(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recruitment"
        description={`${visibleCount} candidates in the pipeline · drag cards between stages you're permitted to move`}
        actions={canCreate && <Button icon={UserPlus} onClick={() => setModalOpen(true)}>Add candidate</Button>}
      />

      <RequisitionsPanel />

      <PipelineBoard onDelete={setConfirmId} />

      <CandidateFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
      <ConfirmDialog open={Boolean(confirmId)} onClose={() => setConfirmId(null)} onConfirm={handleDelete} title="Remove candidate" description="This candidate will be removed from the pipeline." />
    </div>
  );
}
