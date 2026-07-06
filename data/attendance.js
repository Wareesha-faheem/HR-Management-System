import { initialEmployees } from "./employees";
import { computeTotalHours, computeOvertime, finalizeStatus } from "@/utils/attendanceUtils";

function isoDate(d) {
  return d.toISOString().split("T")[0];
}

function randomCheckIn() {
  const hour = 8 + Math.floor(Math.random() * 2); // 8-9
  const minute = Math.floor(Math.random() * 60);
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function addMinutes(time, minutesToAdd) {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutesToAdd;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
}

function generateAttendance() {
  const records = [];
  let id = 1;
  const today = new Date();

  for (let dayOffset = 21; dayOffset >= 1; dayOffset--) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);
    const day = date.getDay();
    if (day === 0 || day === 6) continue; // skip weekends

    initialEmployees.forEach((emp) => {
      const roll = Math.random();
      if (roll < 0.06) return; // ~6% absent, no record

      const checkIn = randomCheckIn();
      const workedMinutes = 7.5 * 60 + Math.floor(Math.random() * 120);
      const checkOut = addMinutes(checkIn, workedMinutes);
      const totalHours = computeTotalHours(checkIn, checkOut);
      const overtime = computeOvertime(totalHours);
      const [, minute] = checkIn.split(":").map(Number);
      const hour = Number(checkIn.split(":")[0]);
      const isLate = hour > 9 || (hour === 9 && minute > 15);
      const status = finalizeStatus(totalHours, isLate ? "Late" : "Present");

      records.push({
        id: id++,
        employeeId: emp.id,
        date: isoDate(date),
        checkIn,
        checkOut,
        totalHours,
        overtime,
        status,
        insideOffice: Math.random() > 0.08,
      });
    });
  }

  return records;
}

export const initialAttendance = generateAttendance();
