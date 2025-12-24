"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { appointments } from "@/lib/data"
import { AppointmentModal } from "./appointment-modal"

interface CalendarViewProps {
  currentDate: Date
  onDaySelect?: (date: Date) => void // Added callback for day selection
}

export function CalendarView({ currentDate, onDaySelect }: CalendarViewProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null)

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const days: (number | null)[] = []
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }

  const days = getDaysInMonth(currentDate)
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const today = new Date()
  const isCurrentMonth =
    today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear()

  const getAppointmentsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return appointments.filter((apt) => apt.date === dateStr)
  }

  const statusColors: Record<string, string> = {
    scheduled: "bg-blue-100 text-blue-700 border-blue-200",
    confirmed: "bg-green-100 text-green-700 border-green-200",
    "in-progress": "bg-amber-100 text-amber-700 border-amber-200",
    completed: "bg-gray-100 text-gray-600 border-gray-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
  }

  const handleDayClick = (day: number) => {
    if (onDaySelect) {
      const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      onDaySelect(selectedDate)
    }
  }

  return (
    <>
      <div className="rounded-2xl bg-background neu-card overflow-hidden">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 border-b border-border">
          {weekDays.map((day) => (
            <div key={day} className="px-4 py-3 text-center text-sm font-semibold text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dayAppointments = day ? getAppointmentsForDay(day) : []
            const isToday = isCurrentMonth && day === today.getDate()

            return (
              <div
                key={index}
                onClick={() => day && handleDayClick(day)}
                className={cn(
                  "min-h-[140px] border-b border-r border-border p-2 transition-colors cursor-pointer",
                  day && "hover:bg-muted/30",
                  !day && "bg-muted/20 cursor-default",
                )}
              >
                {day && (
                  <>
                    <div
                      className={cn(
                        "mb-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                        isToday ? "bg-primary text-primary-foreground" : "text-foreground",
                      )}
                    >
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 3).map((apt) => (
                        <button
                          key={apt.id}
                          onClick={(e) => {
                            e.stopPropagation() // Prevent day click
                            setSelectedAppointment(apt.id)
                          }}
                          className={cn(
                            "w-full rounded-lg border px-2 py-1 text-left text-xs transition-all hover:scale-[1.02]",
                            statusColors[apt.status],
                          )}
                        >
                          <p className="font-medium truncate">{apt.startTime}</p>
                          <p className="truncate">{apt.patientName}</p>
                        </button>
                      ))}
                      {dayAppointments.length > 3 && (
                        <p className="text-xs text-muted-foreground text-center">+{dayAppointments.length - 3} more</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Appointment Modal */}
      {selectedAppointment && (
        <AppointmentModal appointmentId={selectedAppointment} onClose={() => setSelectedAppointment(null)} />
      )}
    </>
  )
}
