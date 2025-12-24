import { Activity, Calendar, DollarSign, User, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

const activities = [
  {
    id: 1,
    type: "appointment",
    message: "Appointment completed with John Doe",
    time: "10 minutes ago",
    icon: Calendar,
  },
  {
    id: 2,
    type: "payment",
    message: "Payment of $450 received from Sarah Smith",
    time: "25 minutes ago",
    icon: DollarSign,
  },
  {
    id: 3,
    type: "patient",
    message: "New patient registered: Michael Johnson",
    time: "1 hour ago",
    icon: User,
  },
  {
    id: 4,
    type: "treatment",
    message: "Treatment plan updated for Emily Davis",
    time: "2 hours ago",
    icon: FileText,
  },
  {
    id: 5,
    type: "appointment",
    message: "Appointment rescheduled for Robert Wilson",
    time: "3 hours ago",
    icon: Calendar,
  },
]

const iconColors: Record<string, string> = {
  appointment: "bg-blue-100 text-blue-600",
  payment: "bg-green-100 text-green-600",
  patient: "bg-purple-100 text-purple-600",
  treatment: "bg-amber-100 text-amber-600",
}

export function RecentActivity() {
  return (
    <div className="rounded-2xl bg-background p-6 neu-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
        <Activity className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div
              className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", iconColors[activity.type])}
            >
              <activity.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{activity.message}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
