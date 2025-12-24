import { Button } from "@/components/ui/button"
import { Plus, Calendar, Clock, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface PatientAppointmentsProps {
  patientId: string
}

const appointmentHistory = [
  {
    id: "A001",
    date: "2024-12-20",
    time: "10:00 AM",
    treatment: "Crown Fitting",
    dentist: "Dr. Sarah Chen",
    duration: "45 min",
    status: "scheduled",
  },
  {
    id: "A002",
    date: "2024-12-05",
    time: "09:00 AM",
    treatment: "Root Canal Treatment",
    dentist: "Dr. Sarah Chen",
    duration: "1 hour",
    status: "completed",
  },
  {
    id: "A003",
    date: "2024-11-20",
    time: "11:00 AM",
    treatment: "Dental Cleaning",
    dentist: "Maria Garcia",
    duration: "30 min",
    status: "completed",
  },
  {
    id: "A004",
    date: "2024-10-15",
    time: "02:00 PM",
    treatment: "Dental Filling",
    dentist: "Dr. James Lee",
    duration: "30 min",
    status: "completed",
  },
]

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  confirmed: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
  "no-show": "bg-amber-100 text-amber-700",
}

export function PatientAppointments({ patientId }: PatientAppointmentsProps) {
  const upcomingAppointments = appointmentHistory.filter((a) => a.status === "scheduled")
  const pastAppointments = appointmentHistory.filter((a) => a.status !== "scheduled")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Appointments</h2>
        <Button className="rounded-xl neu-button bg-primary text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" />
          Book Appointment
        </Button>
      </div>

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <div>
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">Upcoming</h3>
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="rounded-2xl bg-primary/5 p-4 neu-card border-l-4 border-primary">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground">{appointment.treatment}</h4>
                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {appointment.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {appointment.time} ({appointment.duration})
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {appointment.dentist}
                      </span>
                    </div>
                  </div>
                  <span className={cn("rounded-full px-3 py-1 text-xs font-medium", statusColors[appointment.status])}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Appointments */}
      <div>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">Past Appointments</h3>
        <div className="space-y-3">
          {pastAppointments.map((appointment) => (
            <div key={appointment.id} className="rounded-2xl bg-background p-4 neu-card">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-foreground">{appointment.treatment}</h4>
                  <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {appointment.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {appointment.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {appointment.dentist}
                    </span>
                  </div>
                </div>
                <span className={cn("rounded-full px-3 py-1 text-xs font-medium", statusColors[appointment.status])}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
