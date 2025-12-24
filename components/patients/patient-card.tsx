import type { Patient } from "@/lib/data"
import { Phone, Mail, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface PatientCardProps {
  patient: Patient
}

export function PatientCard({ patient }: PatientCardProps) {
  const initials = `${patient.firstName[0]}${patient.lastName[0]}`

  return (
    <div className="rounded-2xl bg-background p-6 neu-card">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-lg font-semibold text-primary-foreground neu-button">
            {initials}
          </div>
          <div>
            <Link href={`/patients/${patient.id}`}>
              <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                {patient.firstName} {patient.lastName}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground">ID: {patient.id}</p>
          </div>
        </div>
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
            <DropdownMenuItem>Edit Patient</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span>{patient.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{patient.phone}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-muted-foreground">Last Visit</p>
            <p className="font-medium text-foreground">{patient.lastVisit || "No visits yet"}</p>
          </div>
          {patient.nextAppointment && (
            <div className="text-right">
              <p className="text-muted-foreground">Next Appointment</p>
              <p className="font-medium text-primary">{patient.nextAppointment}</p>
            </div>
          )}
        </div>
      </div>

      {patient.allergies.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {patient.allergies.map((allergy) => (
            <span key={allergy} className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
              {allergy}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
