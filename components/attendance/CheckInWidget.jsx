"use client";

import { useContext, useEffect, useState } from "react";
import { MapPin, Clock, LogIn, LogOut } from "lucide-react";
import AttendanceContext from "@/contexts/AttendanceContext";
import AuthContext from "@/contexts/AuthContext";
import ToastContext from "@/contexts/ToastContext";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { getCurrentDate, getCurrentTime, isInsideOffice } from "@/utils/attendanceUtils";

export default function CheckInWidget() {
  const { attendance, checkIn, checkOut } = useContext(AttendanceContext);
  const { user } = useContext(AuthContext);
  const { toast } = useContext(ToastContext);

  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [locating, setLocating] = useState(false);
  const today = getCurrentDate();

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(getCurrentTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  const todayAttendance = attendance.find(
    (record) => record.employeeId === user.employeeId && record.date === today
  );

  function handleCheckIn() {
    if (!navigator.geolocation) {
      toast({ title: "Geolocation unavailable", description: "Your browser doesn't support location services.", variant: "error" });
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        const { latitude, longitude } = position.coords;
        const officeStatus = isInsideOffice(latitude, longitude);

        if (!officeStatus.insideOffice) {
          toast({
            title: "Outside office geofence",
            description: `You're ${officeStatus.distance}m from the office. Check-in requires being on-site.`,
            variant: "error",
          });
          return;
        }

        checkIn(user.employeeId, latitude, longitude, officeStatus.insideOffice);
        toast({ title: "Checked in", description: `Marked at ${getCurrentTime().slice(0, 5)}.`, variant: "success" });
      },
      () => {
        setLocating(false);
        toast({ title: "Location denied", description: "Enable location access to check in.", variant: "error" });
      }
    );
  }

  function handleCheckOut() {
    checkOut(user.employeeId);
    toast({ title: "Checked out", description: "Have a great rest of your day!", variant: "success" });
  }

  return (
    <Card>
      <CardBody>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-secondary">Today · {today}</p>
            <p className="mt-1 flex items-center gap-2 text-2xl font-semibold text-primary tabular-nums">
              <Clock className="h-5 w-5 text-brand" /> {currentTime}
            </p>
          </div>

          {!todayAttendance ? (
            <Button onClick={handleCheckIn} loading={locating} icon={LogIn}>
              Check In
            </Button>
          ) : (
            <div className="flex flex-wrap items-center gap-4">
              <div className="text-sm">
                <p className="text-secondary">Check-in</p>
                <p className="font-medium text-primary">{todayAttendance.checkIn}</p>
              </div>
              <div className="text-sm">
                <p className="text-secondary">Check-out</p>
                <p className="font-medium text-primary">{todayAttendance.checkOut || "--"}</p>
              </div>
              <div className="text-sm">
                <p className="text-secondary">Hours</p>
                <p className="font-medium text-primary">{todayAttendance.totalHours || 0}h</p>
              </div>
              <Badge tone={todayAttendance.status}>{todayAttendance.status}</Badge>
              <span className="flex items-center gap-1 text-xs text-secondary">
                <MapPin className="h-3.5 w-3.5" />
                {todayAttendance.insideOffice ? "Verified on-site" : "Outside office"}
              </span>
              {!todayAttendance.checkOut && (
                <Button onClick={handleCheckOut} variant="secondary" icon={LogOut}>
                  Check Out
                </Button>
              )}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}