const D = (offsetHours) => {
  const d = new Date();
  d.setHours(d.getHours() - offsetHours);
  return d.toISOString();
};

// scope: "company" (everyone) or "department" (only that departmentId + admins/HR)
export const initialNotices = [
  {
    id: 1,
    title: "Eid holidays announced",
    message: "Kuickpay offices will be closed for Eid from the 1st to the 3rd. Support rotation details to follow.",
    scope: "company",
    departmentId: null,
    postedBy: 4,
    createdAt: D(50),
  },
  {
    id: 2,
    title: "Sprint planning moved to Monday",
    message: "Engineering sprint planning is moving from Tuesday 10am to Monday 10am starting next week.",
    scope: "department",
    departmentId: 1,
    postedBy: 2,
    createdAt: D(20),
  },
  {
    id: 3,
    title: "New payroll cycle date",
    message: "Starting next month, salaries will be disbursed on the 28th instead of the 1st.",
    scope: "company",
    departmentId: null,
    postedBy: 4,
    createdAt: D(8),
  },
];
