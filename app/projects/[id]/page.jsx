import AppShell from "@/components/layout/AppShell";
import ProjectBoardPage from "@/components/projects/ProjectBoardPage";

export const metadata = { title: "Project Board · Kuickpay HRMS" };

export default function Page({ params }) {
  return(  <AppShell>  
    <ProjectBoardPage projectId={Number(params.id)} />
  </AppShell>
)
}
