import { MoreHorizontal, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface PatientListItemProps {
  name: string
  email: string
  phone: string
  lastVisit: string
  nextAppointment?: string
  avatarUrl?: string
}

export function PatientListItem({ name, email, phone, lastVisit, nextAppointment }: PatientListItemProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-background p-4 neu-card">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-lg font-semibold text-primary-foreground neu-button">
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{name}</h3>
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {email}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {phone}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Last Visit</p>
          <p className="font-medium text-foreground">{lastVisit}</p>
        </div>
        {nextAppointment && (
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Next Appointment</p>
            <p className="font-medium text-primary">{nextAppointment}</p>
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-xl neu-button">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="neu-card">
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem>Book Appointment</DropdownMenuItem>
            <DropdownMenuItem>View History</DropdownMenuItem>
            <DropdownMenuItem>Send Message</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
