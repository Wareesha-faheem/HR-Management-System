import { initialEmployees } from "./employees";

function monthLabel(offset) {
  const d = new Date();
  d.setMonth(d.getMonth() - offset);
  return d.toLocaleString("en-US", { month: "long", year: "numeric" });
}

function buildPayroll() {
  const records = [];
  let id = 1;
  [0, 1, 2].forEach((monthOffset) => {
    initialEmployees.forEach((emp) => {
      const basic = emp.salary;
      const allowances = Math.round(basic * 0.15);
      const deductions = Math.round(basic * 0.08);
      const tax = Math.round(basic * 0.05);
      const netSalary = basic + allowances - deductions - tax;

      records.push({
        id: id++,
        employeeId: emp.id,
        month: monthLabel(monthOffset),
        basicSalary: basic,
        allowances,
        deductions,
        tax,
        netSalary,
        paymentStatus: monthOffset === 0 ? "Pending" : "Paid",
        paymentDate: monthOffset === 0 ? null : monthLabel(monthOffset),
      });
    });
  });
  return records;
}

export const initialPayroll = buildPayroll();
