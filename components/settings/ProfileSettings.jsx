"use client";

import { useContext, useState } from "react";
import AuthContext from "@/contexts/AuthContext";
import ToastContext from "@/contexts/ToastContext";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";

export default function ProfileSettings() {
  const { user, updateProfile } = useContext(AuthContext);
  const { toast } = useContext(ToastContext);
  const [form, setForm] = useState({ firstName: user.firstName, lastName: user.lastName, designation: user.designation || "" });

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSave() {
    updateProfile(form);
    toast({ title: "Profile updated", variant: "success" });
  }

  return (
    <Card>
      <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
      <CardBody className="space-y-5">
        <div className="flex items-center gap-4">
          <Avatar firstName={user.firstName} lastName={user.lastName} color={user.avatarColor} size={56} />
          <div>
            <p className="font-semibold text-primary">{user.firstName} {user.lastName}</p>
            <p className="text-sm text-secondary">{user.email} · {user.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="First name" name="firstName" value={form.firstName} onChange={handleChange} />
          <Input label="Last name" name="lastName" value={form.lastName} onChange={handleChange} />
          <Input label="Designation" name="designation" value={form.designation} onChange={handleChange} className="sm:col-span-2" />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Save changes</Button>
        </div>
      </CardBody>
    </Card>
  );
}
