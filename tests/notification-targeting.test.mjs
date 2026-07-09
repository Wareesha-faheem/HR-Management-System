import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { getVisibleNotifications, isNotificationRead } = require("../utils/notifications.js");

const notifications = [
  { id: 1, audience: "all" },
  { id: 2, audience: "roles", roles: ["HR"] },
  { id: 3, audience: "departments", departmentIds: [2] },
  { id: 4, audience: "users", userIds: [7], readBy: [7] },
];

const user = { employeeId: 7, role: "HR", departmentId: 2 };

assert.deepEqual(getVisibleNotifications(notifications, user).map((n) => n.id), [1, 2, 3, 4]);
assert.equal(isNotificationRead(notifications[3], 7), true);
assert.equal(isNotificationRead(notifications[2], 7), false);

console.log("notification targeting checks passed");
