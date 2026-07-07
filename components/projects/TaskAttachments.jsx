"use client";

import { useContext, useRef } from "react";
import { Paperclip, Download, Trash2, Upload } from "lucide-react";
import EmployeeContext from "@/contexts/EmployeeContext";
import ToastContext from "@/contexts/ToastContext";
import Button from "@/components/ui/Button";
import { formatDate } from "@/utils/formatters";

// Prototype has no backend/object storage, so files are read as base64 data
// URLs and kept inline in the task record (persisted to localStorage like
// everything else). Capped small to stay well under localStorage limits.
const MAX_FILE_BYTES = 1.5 * 1024 * 1024;

export default function TaskAttachments({ attachments, canDelete, onUpload, onDelete }) {
  const { getEmployeeById } = useContext(EmployeeContext);
  const { toast } = useContext(ToastContext);
  const inputRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      toast({ title: "File too large", description: "Attachments are limited to 1.5MB in this prototype.", variant: "error" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onUpload({ name: file.name, size: file.size, type: file.type, dataUrl: reader.result });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <div className="space-y-2">
        {attachments.length === 0 && <p className="text-xs text-secondary">No attachments yet.</p>}
        {attachments.map((a) => {
          const uploader = getEmployeeById(a.uploadedBy);
          return (
            <div key={a.id} className="flex items-center justify-between gap-2 rounded-xl border border-[rgb(var(--border-subtle))] px-3 py-2">
              <div className="flex min-w-0 items-center gap-2">
                <Paperclip className="h-4 w-4 flex-shrink-0 text-secondary" />
                <div className="min-w-0">
                  <p className="text-sm text-primary truncate">{a.name}</p>
                  <p className="text-[11px] text-secondary">
                    {(a.size / 1024).toFixed(0)} KB · {uploader ? `${uploader.firstName} ${uploader.lastName}` : "Unknown"} · {formatDate(a.uploadedAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <a href={a.dataUrl} download={a.name} className="rounded-lg p-1.5 text-secondary hover:bg-surface-2 hover:text-primary">
                  <Download className="h-3.5 w-3.5" />
                </a>
                {canDelete && (
                  <button onClick={() => onDelete(a.id)} className="rounded-lg p-1.5 text-secondary hover:bg-red-500/10 hover:text-red-500">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <input ref={inputRef} type="file" className="hidden" onChange={handleFile} />
      <Button size="sm" variant="secondary" icon={Upload} className="mt-3" onClick={() => inputRef.current?.click()}>
        Attach file
      </Button>
    </div>
  );
}
