const D = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
};

export const LEAVE_TYPES = ["Annual", "Sick", "Casual", "Unpaid", "Maternity/Paternity"];

export const DEFAULT_LEAVE_BALANCE = {
  Annual: 14,
  Sick: 10,
  Casual: 8,
  Unpaid: 0,
  "Maternity/Paternity": 90,
};

export const initialLeaves = [
  { id: 1, employeeId: 1, leaveType: "Annual", startDate: D(3), endDate: D(5), reason: "Family trip to Hunza", status: "Pending", appliedOn: D(-1), createdAt: D(-1) },
  { id: 2, employeeId: 3, leaveType: "Sick", startDate: D(-2), endDate: D(-1), reason: "Fever and flu", status: "Approved", appliedOn: D(-4), createdAt: D(-4), reviewedBy: 4 },
  { id: 3, employeeId: 7, leaveType: "Casual", startDate: D(1), endDate: D(1), reason: "Personal errand", status: "Approved", appliedOn: D(-2), createdAt: D(-2), reviewedBy: 6 },
  { id: 4, employeeId: 8, leaveType: "Annual", startDate: D(10), endDate: D(14), reason: "Wedding in the family", status: "Pending", appliedOn: D(0), createdAt: D(0) },
  { id: 5, employeeId: 10, leaveType: "Sick", startDate: D(-5), endDate: D(-3), reason: "Recovering from surgery", status: "Approved", appliedOn: D(-7), createdAt: D(-7), reviewedBy: 4 },
  { id: 6, employeeId: 11, leaveType: "Casual", startDate: D(-10), endDate: D(-10), reason: "Moving apartments", status: "Rejected", appliedOn: D(-12), createdAt: D(-12), reviewedBy: 2 },
];

export function leaveDuration(leave) {
  const start = new Date(leave.startDate);
  const end = new Date(leave.endDate);
  return Math.round((end - start) / 86400000) + 1;
}
