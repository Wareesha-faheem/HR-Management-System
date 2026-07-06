// Mock auth directory. Password is intentionally simple ("password123") for every
// seed account since this prototype has no backend / real credential store.
// Role is intentionally NOT duplicated here — the employee record (data/employees.js)
// is the single source of truth for a user's role, so promoting someone via the
// Employees module immediately changes what they can access on next login.
export const initialUsers = [
  { id: 1, employeeId: 1, email: "rumaisahfarhan@kuickpay.com", password: "password123" },
  { id: 2, employeeId: 2, email: "moizpasha@kuickpay.com", password: "password123" },
  { id: 3, employeeId: 3, email: "bilal.ahmed@kuickpay.com", password: "password123" },
  { id: 4, employeeId: 4, email: "sana.riaz@kuickpay.com", password: "password123" },
  { id: 5, employeeId: 5, email: "omar.farooq@kuickpay.com", password: "password123" },
  { id: 12, employeeId: 12, email: "syedsaqibali@kuickpay.com", password: "password123" },
  { id: 13, employeeId: 13, email: "farah.siddiqui@kuickpay.com", password: "password123" },
  { id: 14, employeeId: 14, email: "wareesha.faheem9@kuickpay.com", password: "password123" },
  { id: 15, employeeId: 15, email: "usmanbhai@kuickpay.com", password: "password123" },
];
