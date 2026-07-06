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
    <Card glass className="bg-brand-gradient text-white border-0 shadow-glow-brand">
      <CardBody>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-white/70">Today · {today}</p>
            <p className="mt-1 flex items-center gap-2 text-3xl font-bold tabular-nums">
              <Clock className="h-6 w-6" /> {currentTime}
            </p>
          </div>

          {!todayAttendance ? (
            <Button onClick={handleCheckIn} loading={locating} variant="secondary" size="lg" icon={LogIn} className="bg-surface text-brand-dark hover:bg-surface/90 dark:text-brand-light">
              Check In
            </Button>
          ) : (
            <div className="flex flex-wrap items-center gap-4">
              <div className="text-sm">
                <p className="text-white/70">Check-in</p>
                <p className="font-semibold">{todayAttendance.checkIn}</p>
              </div>
              <div className="text-sm">
                <p className="text-white/70">Check-out</p>
                <p className="font-semibold">{todayAttendance.checkOut || "--"}</p>
              </div>
              <div className="text-sm">
                <p className="text-white/70">Hours</p>
                <p className="font-semibold">{todayAttendance.totalHours || 0}h</p>
              </div>
              <Badge tone={todayAttendance.status} className="bg-white/15 text-white border-white/20">
                {todayAttendance.status}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-white/70">
                <MapPin className="h-3.5 w-3.5" />
                {todayAttendance.insideOffice ? "Verified on-site" : "Outside office"}
              </span>
              {!todayAttendance.checkOut && (
                <Button onClick={handleCheckOut} variant="secondary" icon={LogOut} className="bg-surface text-brand-dark hover:bg-surface/90 dark:text-brand-light">
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
