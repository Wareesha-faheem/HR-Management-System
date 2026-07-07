// Kuickpay HQ office coordinates (mock) + geofence radius in meters.
// export const OFFICE_LOCATION = { latitude: 24.8607, longitude: 67.0011 };
export const OFFICE_LOCATION = { latitude: 24.896141573055584, longitude: 67.1168333916825 };
export const OFFICE_RADIUS_METERS = 300;

export function getCurrentDate() {
  return new Date().toISOString().split("T")[0];
}

export function getCurrentTime() {
  return new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function toRad(value) {
  return (value * Math.PI) / 180;
}

export function distanceInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function isInsideOffice(latitude, longitude) {
  const distance = distanceInMeters(
    latitude,
    longitude,
    OFFICE_LOCATION.latitude,
    OFFICE_LOCATION.longitude
  );
  return { insideOffice: distance <= OFFICE_RADIUS_METERS, distance };
}

export const SHIFT_START_HOUR = 11;
export const SHIFT_START_MINUTE = 0; // grace period before "Late"
export const SHIFT_END_HOUR = 20;

export function computeStatusFromCheckIn(checkInTime) {
  const [h, m] = checkInTime.split(":").map(Number);
  if (h > SHIFT_START_HOUR || (h === SHIFT_START_HOUR && m > SHIFT_START_MINUTE)) {
    return "Late";
  }
  return "Checked In";
}

export function computeTotalHours(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const [inH, inM] = checkIn.split(":").map(Number);
  const [outH, outM] = checkOut.split(":").map(Number);
  const minutes = outH * 60 + outM - (inH * 60 + inM);
  return Math.max(0, Math.round((minutes / 60) * 100) / 100);
}

export function computeOvertime(totalHours) {
  const standard = 8;
  return totalHours > standard ? Math.round((totalHours - standard) * 100) / 100 : 0;
}

export function finalizeStatus(totalHours, currentStatus) {
  if (totalHours < 4) return "Half Day";
  if (currentStatus === "Late") return "Late";
  return "Present";
}
