// Office location (change later from Settings if needed)
export const OFFICE_LOCATION = {
  latitude: 24.8607,
  longitude: 67.0011,
};

// Office radius in meters
export const OFFICE_RADIUS = 100;

// Convert degrees to radians
function toRadians(value) {
  return (value * Math.PI) / 180;
}

// Distance between two GPS coordinates (Haversine Formula)
export function getDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371000; // meters

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

// Check whether employee is inside office
export function isInsideOffice(latitude, longitude) {
  const distance = getDistance(
    latitude,
    longitude,
    OFFICE_LOCATION.latitude,
    OFFICE_LOCATION.longitude
  );

  return {
    insideOffice: distance <= OFFICE_RADIUS,
    distance: Math.round(distance),
  };
}

// Current date (YYYY-MM-DD)
export function getCurrentDate() {
  return new Date().toISOString().split("T")[0];
}

// Current time (HH:mm)
export function getCurrentTime() {
  const now = new Date();

  return now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// Calculate hours worked
export function calculateHours(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;

  const today = getCurrentDate();

  const start = new Date(`${today}T${checkIn}`);
  const end = new Date(`${today}T${checkOut}`);

  const hours = (end - start) / (1000 * 60 * 60);

  return Number(hours.toFixed(2));
}

// Calculate overtime
export function calculateOvertime(hoursWorked) {
  if (hoursWorked <= 8) return 0;

  return Number((hoursWorked - 8).toFixed(2));
}

// Decide attendance status
export function calculateStatus(checkIn, totalHours) {
  if (!checkIn) return "Absent";

  const [hour, minute] = checkIn.split(":").map(Number);

  const arrival = hour * 60 + minute;

  const officeStart = 9 * 60;

  if (totalHours < 4) return "Half Day";

  if (arrival > officeStart + 15) return "Late";

  return "Present";
}