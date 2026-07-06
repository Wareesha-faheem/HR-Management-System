export const REQUISITION_STATUSES = ["Open", "Fulfilled", "Closed"];

export const initialRequisitions = [
  {
    id: 1,
    departmentId: 1,
    requestedBy: 2,
    positionTitle: "Senior Backend Engineer",
    justification: "Growing merchant onboarding load requires another backend engineer on the payments team.",
    status: "Open",
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
];
