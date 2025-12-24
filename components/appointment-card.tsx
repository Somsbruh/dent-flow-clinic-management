import { cn } from "@/lib/utils"
import { Clock, User } from "lucide-react"

interface AppointmentCardProps {
  patientName: string
  treatment: string
  time: string
  duration: string
  status: "upcoming" | "in-progress" | "completed" | "cancelled"
  doctorName?: string
}

export function AppointmentCard({ patientName, treatment, time, duration, status, doctorName }: AppointmentCardProps) {
  const statusColors = {
    upcoming: "bg-blue-100 text-blue-700",
    "in-progress": "bg-amber-100 text-amber-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  }

  const statusLabels = {
    upcoming: "Upcoming",
    "in-progress": "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  }

  return (
    <div className="rounded-2xl bg-background p-4 neu-card">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 neu-button">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{patientName}</h3>
            <p className="text-sm text-muted-foreground">{treatment}</p>
          </div>
        </div>
        <span className={cn("rounded-full px-3 py-1 text-xs font-medium", statusColors[status])}>
          {statusLabels[status]}
        </span>
      </div>
      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{time}</span>
        </div>
        <span>•</span>
        <span>{duration}</span>
        {doctorName && (
          <>
            <span>•</span>
            <span>{doctorName}</span>
          </>
        )}
      </div>
    </div>
  )
}
