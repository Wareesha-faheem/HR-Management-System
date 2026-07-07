const D = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
};

export const PROJECT_STATUSES = ["Active", "On Hold", "Completed"];

export const initialProjects = [
  {
    id: 1,
    name: "Employee Self-Service Portal",
    description: "Revamp of the employee-facing HR portal with self-service leave requests and payslip access.",
    departmentId: 1,
    status: "Active",
    createdBy: 2,
    createdAt: D(-30),
  },
  {
    id: 2,
    name: "Q3 Hiring Drive",
    description: "Coordinate recruitment marketing, interviews and onboarding for the Q3 headcount expansion.",
    departmentId: 2,
    status: "Active",
    createdBy: 4,
    createdAt: D(-20),
  },
  {
    id: 3,
    name: "Payroll Automation",
    description: "Automate salary run reconciliation, tax slip generation and bank file exports.",
    departmentId: 3,
    status: "On Hold",
    createdBy: 5,
    createdAt: D(-45),
  },
];
