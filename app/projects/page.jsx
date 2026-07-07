import AppShell from "@/components/layout/AppShell";
import ProjectsPage from "@/components/projects/ProjectsPage";

export const metadata = { title: "Projects · Kuickpay HRMS" };

export default function Page() {
  return (
  <AppShell>
  <ProjectsPage />
  </AppShell>);
}
