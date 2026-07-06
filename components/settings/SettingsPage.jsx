"use client";

import { useContext } from "react";
import AuthContext from "@/contexts/AuthContext";
import PageHeader from "@/components/ui/PageHeader";
import ProfileSettings from "./ProfileSettings";
import AppearanceSettings from "./AppearanceSettings";
import NotificationSettings from "./NotificationSettings";
import SystemSettings from "./SystemSettings";
import PermissionsManager from "./PermissionsManager";
import ViewAsPanel from "./ViewAsPanel";
import { isAdmin } from "@/utils/rbac";

export default function SettingsPage() {
  const { user } = useContext(AuthContext);
  const admin = isAdmin(user.role);

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your profile, appearance, and notification preferences" />

      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileSettings />
        <AppearanceSettings />
        <NotificationSettings />
        {admin && <SystemSettings />}
      </div>

      {admin && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ViewAsPanel />
          <PermissionsManager />
        </div>
      )}
    </div>
  );
}
