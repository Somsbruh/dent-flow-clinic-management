"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppointmentCard } from "./appointment-card"

const appointments = [
  {
    id: 1,
    patientName: "John Doe",
    treatment: "Root Canal Treatment",
    time: "09:00 AM",
    duration: "1 hour",
    status: "completed" as const,
    doctorName: "Dr. Sarah Chen",
  },
  {
    id: 2,
    patientName: "Sarah Smith",
    treatment: "Dental Cleaning",
    time: "10:30 AM",
    duration: "30 min",
    status: "in-progress" as const,
    doctorName: "Dr. Sarah Chen",
  },
  {
    id: 3,
    patientName: "Michael Johnson",
    treatment: "Crown Fitting",
    time: "11:30 AM",
    duration: "45 min",
    status: "upcoming" as const,
    doctorName: "Dr. Sarah Chen",
  },
  {
    id: 4,
    patientName: "Emily Davis",
    treatment: "Orthodontic Checkup",
    time: "02:00 PM",
    duration: "30 min",
    status: "upcoming" as const,
    doctorName: "Dr. James Lee",
  },
  {
    id: 5,
    patientName: "Robert Wilson",
    treatment: "Tooth Extraction",
    time: "03:00 PM",
    duration: "1 hour",
    status: "upcoming" as const,
    doctorName: "Dr. Sarah Chen",
  },
]

export function TodaySchedule() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="rounded-2xl bg-background p-6 neu-card">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Today&apos;s Schedule</h2>
          <p className="text-sm text-muted-foreground">{today}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-xl neu-button">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl neu-button">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-3">
        {appointments.map((appointment) => (
          <AppointmentCard key={appointment.id} {...appointment} />
        ))}
      </div>
    </div>
  )
}
