import { Plus, Calendar, FileText, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"

const actions = [
  {
    name: "New Patient",
    icon: UserPlus,
    color: "bg-blue-500",
    href: "/patients/new",
  },
  {
    name: "Book Appointment",
    icon: Calendar,
    color: "bg-green-500",
    href: "/appointments/new",
  },
  {
    name: "New Invoice",
    icon: FileText,
    color: "bg-amber-500",
    href: "/billing/new",
  },
  {
    name: "Quick Add",
    icon: Plus,
    color: "bg-primary",
    href: "#",
  },
]

export function QuickActions() {
  return (
    <div className="rounded-2xl bg-background p-6 neu-card">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <a
            key={action.name}
            href={action.href}
            className="flex flex-col items-center gap-2 rounded-xl bg-background p-4 text-center transition-all neu-button hover:scale-[1.02]"
          >
            <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl text-white", action.color)}>
              <action.icon className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-foreground">{action.name}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
