import { getAppointments } from "@/app/actions/appointments";
import { AppointmentsView } from "@/components/appointments/appointments-view";
import { Calendar } from "lucide-react";

export default async function AppointmentsPage() {
  const appointments = await getAppointments({});

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-primary mb-1">
          <Calendar className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Clinical Attendance & Schedule
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Appointment Calendar & Attendance
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track consultations, confirm bookings, record show-up rates, and reduce no-shows.
        </p>
      </div>

      <AppointmentsView initialAppointments={appointments} />
    </div>
  );
}
