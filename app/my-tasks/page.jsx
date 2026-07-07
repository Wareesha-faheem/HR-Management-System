import AppShell from "@/components/layout/AppShell";
import MyTasksPage from "@/components/projects/MyTasksPage";

export const metadata = { title: "My Tasks · Kuickpay HRMS" };

export default function Page() {
  return(
  <AppShell>
    <MyTasksPage />
  </AppShell>
  )
}
