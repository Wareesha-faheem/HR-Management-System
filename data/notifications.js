const D = (offsetHours) => {
  const d = new Date();
  d.setHours(d.getHours() - offsetHours);
  return d.toISOString();
};

// `link` is where clicking the notification should take you.
export const initialNotifications = [
  { id: 1, title: "Leave request pending", message: "Rumi Khan requested Annual leave.", type: "leave", link: "/leave", audience: "roles", roles: ["HR", "Manager"], readBy: [], createdAt: D(1) },
  { id: 2, title: "Payroll due", message: "July payroll run is pending approval.", type: "payroll", link: "/payroll", audience: "roles", roles: ["HR", "Super Admin"], readBy: [], createdAt: D(4) },
  { id: 3, title: "New candidate", message: "Zara Baig moved to Screening stage.", type: "recruitment", link: "/recruitment", audience: "roles", roles: ["HR"], readBy: [1], createdAt: D(20) },
  { id: 4, title: "Attendance anomaly", message: "3 check-ins were outside the office geofence today.", type: "attendance", link: "/attendance", audience: "roles", roles: ["HR", "Super Admin"], readBy: [1], createdAt: D(30) },
];

// Default preferences per notification type — used both to render the
// toggles in Settings and to decide whether a new notification of that
// type actually gets pushed into the feed.
export const DEFAULT_NOTIFICATION_PREFS = {
  leave: true,
  attendance: true,
  payroll: true,
  recruitment: false,
  employee: true,
  notice: true,
};

export const NOTIFICATION_TYPE_LABELS = {
  leave: "Leave requests & approvals",
  attendance: "Attendance anomalies",
  payroll: "Payroll runs",
  recruitment: "Recruitment pipeline updates",
  employee: "Employee record changes",
  notice: "Company & department notices",
};
