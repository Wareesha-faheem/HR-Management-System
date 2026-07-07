"use client";

import { useContext, useState } from "react";
import { Send } from "lucide-react";
import EmployeeContext from "@/contexts/EmployeeContext";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { formatDate } from "@/utils/formatters";

export default function TaskComments({ comments, onAdd }) {
  const { getEmployeeById } = useContext(EmployeeContext);
  const [text, setText] = useState("");

  function handleSend() {
    if (!text.trim()) return;
    onAdd(text.trim());
    setText("");
  }

  return (
    <div>
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {comments.length === 0 && <p className="text-xs text-secondary">No comments yet.</p>}
        {comments.map((c) => {
          const author = getEmployeeById(c.authorId);
          return (
            <div key={c.id} className="flex gap-2.5">
              <Avatar firstName={author?.firstName} lastName={author?.lastName} color={author?.avatarColor} size={28} />
              <div className="min-w-0 flex-1 rounded-xl bg-surface-2/60 px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-primary">{author ? `${author.firstName} ${author.lastName}` : "Unknown"}</p>
                  <p className="text-[10px] text-secondary flex-shrink-0">{formatDate(c.createdAt)}</p>
                </div>
                <p className="mt-0.5 text-sm text-primary break-words">{c.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Write a comment..."
          className="h-10 flex-1 rounded-xl border border-[rgb(var(--border-subtle))] bg-surface px-3.5 text-sm text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
        <Button size="icon" onClick={handleSend}><Send className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}
