"use client"

import { useState } from "react"
import { appointments } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Calendar, Clock, User, MoreHorizontal, CheckCircle, XCircle, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function AppointmentsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.treatmentType.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || apt.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusColors: Record<string, string> = {
    scheduled: "bg-blue-100 text-blue-700",
    confirmed: "bg-green-100 text-green-700",
    "in-progress": "bg-amber-100 text-amber-700",
    completed: "bg-gray-100 text-gray-600",
    cancelled: "bg-red-100 text-red-700",
    "no-show": "bg-orange-100 text-orange-700",
  }

  const statusFilters = [
    { value: "all", label: "All" },
    { value: "scheduled", label: "Scheduled" },
    { value: "confirmed", label: "Confirmed" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ]

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="rounded-2xl bg-background p-4 neu-card">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by patient or treatment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl neu-input border-0"
            />
          </div>
          <div className="flex gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  statusFilter === filter.value
                    ? "bg-primary text-primary-foreground neu-button"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {filteredAppointments.map((appointment) => (
          <div key={appointment.id} className="rounded-2xl bg-background p-4 neu-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 neu-button">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{appointment.patientName}</h3>
                  <p className="text-sm text-muted-foreground">{appointment.treatmentType}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {appointment.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {appointment.startTime} - {appointment.endTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {appointment.dentistName}
                  </span>
                </div>

                <span className={cn("rounded-full px-3 py-1 text-xs font-medium", statusColors[appointment.status])}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).replace("-", " ")}
                </span>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-xl">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="neu-card">
                    <DropdownMenuItem>
                      <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                      Mark Complete
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <XCircle className="mr-2 h-4 w-4" />
                      Cancel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
