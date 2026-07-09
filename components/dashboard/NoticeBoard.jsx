"use client";

import { useContext, useState } from "react";
import { Megaphone, Plus, Trash2 } from "lucide-react";
import NoticeContext from "@/contexts/NoticeContext";
import AuthContext from "@/contexts/AuthContext";
import DepartmentContext from "@/contexts/DepartmentContext";
import ToastContext from "@/contexts/ToastContext";
import NotificationContext from "@/contexts/NotificationContext";
import { usePermissions } from "@/hooks/usePermissions";

import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import NoticeFormModal from "./NoticeFormModal";
import { MODULES, ACTIONS } from "@/utils/rbac";
import { timeAgo } from "@/utils/formatters";

export default function NoticeBoard() {
  const { postNotice, deleteNotice, getVisibleNotices } = useContext(NoticeContext);
  const { user } = useContext(AuthContext);
  const { getDepartmentById } = useContext(DepartmentContext);
  const { toast } = useContext(ToastContext);
  const { pushNotification } = useContext(NotificationContext);
  const { can } = usePermissions();

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  const canPost = can(MODULES.NOTICES, ACTIONS.POST_COMPANY) || can(MODULES.NOTICES, ACTIONS.POST_DEPARTMENT);
  const canDelete = can(MODULES.NOTICES, ACTIONS.DELETE);
  const notices = getVisibleNotices(user.departmentId).slice(0, 5);

  function handleSubmit(payload) {
    postNotice(payload);
    toast({ title: "Notice posted", variant: "success" });
    pushNotification({
      title: "New notice posted",
      message: payload.title,
      type: "notice",
      link: "/dashboard",
      audience: payload.scope === "department" ? "departments" : "all",
      departmentIds: payload.scope === "department" && payload.departmentId ? [payload.departmentId] : [],
    });
    setModalOpen(false);
  }

  function handleDelete() {
    deleteNotice(confirmId);
    toast({ title: "Notice removed" });
    setConfirmId(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notice board</CardTitle>
        {canPost && <Button size="sm" icon={Plus} onClick={() => setModalOpen(true)}>Post notice</Button>}
      </CardHeader>
      <CardBody className="space-y-1">
        {notices.length === 0 ? (
          <EmptyState icon={Megaphone} title="No notices yet" description="Company and department announcements will show up here." />
        ) : (
          notices.map((n) => (
            <div key={n.id} className="flex items-start justify-between gap-3 py-2.5 border-b border-[rgb(var(--border-subtle))] last:border-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-primary">{n.title}</p>
                  <Badge tone={n.scope === "company" ? "Active" : "Pending"}>
                    {n.scope === "company" ? "Company-wide" : getDepartmentById(n.departmentId)?.name || "Department"}
                  </Badge>
                </div>
                <p className="text-sm text-secondary mt-0.5">{n.message}</p>
                <p className="text-[11px] text-secondary/70 mt-1">{timeAgo(n.createdAt)}</p>
              </div>
              {canDelete && (
                <button onClick={() => setConfirmId(n.id)} className="text-secondary hover:text-red-500 flex-shrink-0">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))
        )}
      </CardBody>

      <NoticeFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
      <ConfirmDialog open={Boolean(confirmId)} onClose={() => setConfirmId(null)} onConfirm={handleDelete} title="Remove notice" description="This notice will be removed from the board for everyone." />
    </Card>
  );
}
