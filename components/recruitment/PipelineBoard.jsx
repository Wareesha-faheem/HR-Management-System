"use client";

import { useContext, useState } from "react";
import RecruitmentContext from "@/contexts/RecruitmentContext";
import DepartmentContext from "@/contexts/DepartmentContext";
import AuthContext from "@/contexts/AuthContext";
import ToastContext from "@/contexts/ToastContext";
import { usePermissions } from "@/hooks/usePermissions";
import Avatar from "@/components/ui/Avatar";
import { RECRUITMENT_STAGES } from "@/data/candidates";
import { MODULES, ACTIONS } from "@/utils/rbac";
import { formatDate } from "@/utils/formatters";
import { cn } from "@/utils/cn";
import { Star, Trash2 } from "lucide-react";

const STAGE_COLORS = {
  Applied: "border-t-sky-500",
  Screening: "border-t-indigo-500",
  Interview: "border-t-purple-500",
  Offer: "border-t-amber-500",
  Hired: "border-t-emerald-500",
  Rejected: "border-t-red-500",
};

// Which action gates moving a card INTO a given stage. Screening/Applied are
// HR intake work; Interview is where a Manager's involvement is required;
// Offer/Hired/Rejected are HR's call to finalize.
function actionForStage(stage) {
  if (["Offer", "Hired", "Rejected"].includes(stage)) return ACTIONS.FINALIZE;
  if (stage === "Interview") return ACTIONS.INTERVIEW;
  return ACTIONS.CREATE;
}

export default function PipelineBoard({ onDelete }) {
  const { candidates, moveStage } = useContext(RecruitmentContext);
  const { getDepartmentById } = useContext(DepartmentContext);
  const { user } = useContext(AuthContext);
  const { toast } = useContext(ToastContext);
  const { can, isDeptScoped } = usePermissions();
  const [dragId, setDragId] = useState(null);

  const deptScoped = isDeptScoped(MODULES.RECRUITMENT);
  const visibleCandidates = deptScoped ? candidates.filter((c) => c.departmentId === user.departmentId) : candidates;
  const canDeleteCards = can(MODULES.RECRUITMENT, ACTIONS.DELETE);

  function handleDrop(stage) {
    if (dragId == null) return;
    const requiredAction = actionForStage(stage);
    if (!can(MODULES.RECRUITMENT, requiredAction)) {
      toast({ title: "Not permitted", description: `Your role can't move candidates into ${stage}.`, variant: "error" });
      setDragId(null);
      return;
    }
    moveStage(dragId, stage);
    toast({ title: "Candidate moved", description: `Moved to ${stage}.`, variant: "success" });
    setDragId(null);
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {RECRUITMENT_STAGES.map((stage) => {
        const stageCandidates = visibleCandidates.filter((c) => c.stage === stage);
        const draggableHere = can(MODULES.RECRUITMENT, actionForStage(stage));

        return (
          <div
            key={stage}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(stage)}
            className={cn("rounded-xl2 border border-t-4 bg-surface-2/50 p-3 min-h-[240px]", STAGE_COLORS[stage])}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-primary">{stage}</p>
              <span className="text-xs text-secondary bg-surface rounded-full px-2 py-0.5">{stageCandidates.length}</span>
            </div>

            <div className="space-y-2.5">
              {stageCandidates.map((c) => (
                <div
                  key={c.id}
                  draggable={draggableHere}
                  onDragStart={() => setDragId(c.id)}
                  className={cn(
                    "rounded-xl border border-[rgb(var(--border-subtle))] bg-surface p-3 transition-colors",
                    draggableHere ? "cursor-grab active:cursor-grabbing hover:border-brand" : "opacity-90"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar firstName={c.name.split(" ")[0]} lastName={c.name.split(" ")[1] || ""} size={28} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-primary truncate">{c.name}</p>
                        <p className="text-xs text-secondary truncate">{c.position}</p>
                      </div>
                    </div>
                    {canDeleteCards && onDelete && (
                      <button onClick={() => onDelete(c.id)} className="text-secondary hover:text-red-500 flex-shrink-0">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="mt-2 text-[11px] text-secondary">{getDepartmentById(c.departmentId)?.name} · {formatDate(c.appliedOn)}</p>
                  {c.rating > 0 && (
                    <div className="mt-1.5 flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={cn("h-3 w-3", i < c.rating ? "fill-amber-400 text-amber-400" : "text-secondary/30")} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
