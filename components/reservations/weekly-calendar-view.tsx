"use client"

import { cn } from "@/lib/utils"
import { holidays } from "@/lib/data"

interface WeeklyCalendarViewProps {
  currentDate: Date
  onDayClick: (date: Date) => void
  selectedDentists?: string[]
}

const dentists = [
  { id: "D001", name: "Drg Soap Mactavish", color: "#f97316" },
  { id: "D002", name: "Drg Cipeng", color: "#3b82f6" },
  { id: "D003", name: "Drg Putri Larasati", color: "#8b5cf6" },
]

// Mock appointments per day per dentist
const weekAppointments: Record<string, { dentistId: string; count: number; patients: string[] }[]> = {
  "2024-12-16": [
    { dentistId: "D001", count: 4, patients: ["Rafli J.", "Sekar N."] },
    { dentistId: "D002", count: 2, patients: ["Angkasa P."] },
  ],
  "2024-12-17": [
    { dentistId: "D001", count: 3, patients: ["Ahmad R.", "Budi S."] },
    { dentistId: "D002", count: 5, patients: ["Citra D.", "Dewi A."] },
    { dentistId: "D003", count: 2, patients: ["Eka P."] },
  ],
  "2024-12-18": [
    { dentistId: "D002", count: 4, patients: ["Fani M.", "Gita S."] },
    { dentistId: "D003", count: 3, patients: ["Hadi W."] },
  ],
  "2024-12-19": [
    { dentistId: "D001", count: 5, patients: ["Indra K.", "Joko P."] },
    { dentistId: "D002", count: 3, patients: ["Kartika S."] },
    { dentistId: "D003", count: 4, patients: ["Lina M.", "Maya R."] },
  ],
  "2024-12-20": [
    { dentistId: "D001", count: 2, patients: ["Nadia F."] },
    { dentistId: "D003", count: 3, patients: ["Omar H.", "Putri A."] },
  ],
}

const timeSlots = ["9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm"]

export function WeeklyCalendarView({ currentDate, onDayClick, selectedDentists = ["all"] }: WeeklyCalendarViewProps) {
  // Get week dates
  const startOfWeek = new Date(currentDate)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek)
    date.setDate(date.getDate() + i)
    return date
  })

  const today = new Date()

  const filteredDentists = selectedDentists.includes("all")
    ? dentists
    : dentists.filter((d) => selectedDentists.includes(d.id))

  const formatDayHeader = (date: Date) => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return {
      day: dayNames[date.getDay()],
      date: date.getDate(),
      isToday: date.toDateString() === today.toDateString(),
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    }
  }

  return (
    <div className="rounded-2xl bg-white overflow-hidden shadow-sm h-full flex flex-col">
      {/* Week header */}
      <div
        className="grid border-b border-gray-100 flex-shrink-0"
        style={{ gridTemplateColumns: `50px repeat(7, 1fr)` }}
      >
        <div className="p-2 border-r border-gray-100" />
        {weekDays.map((date) => {
          const { day, date: dateNum, isToday, isWeekend } = formatDayHeader(date)
          const dateStr = date.toISOString().split("T")[0]
          const isHoliday = holidays.some((h) => h.date === dateStr)

          return (
            <div
              key={dateStr}
              onClick={() => onDayClick(date)}
              className={cn(
                "p-2 border-r border-gray-100 last:border-r-0 cursor-pointer hover:bg-gray-50 transition-colors text-center",
                isWeekend && "bg-gray-50/50",
                isHoliday && "bg-amber-50/50",
              )}
            >
              <div className={cn("text-[10px] font-medium mb-1", isWeekend ? "text-gray-400" : "text-gray-500")}>
                {day}
              </div>
              <div
                className={cn(
                  "h-7 w-7 mx-auto flex items-center justify-center rounded-full text-sm font-semibold",
                  isToday && "bg-primary text-white",
                  !isToday && "text-gray-900",
                )}
              >
                {dateNum}
              </div>
              {isHoliday && <div className="text-[8px] text-amber-600 mt-0.5 truncate">Holiday</div>}
            </div>
          )
        })}
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-auto">
        {timeSlots.map((time, timeIndex) => (
          <div
            key={time}
            className="grid border-b border-gray-100 last:border-b-0"
            style={{ gridTemplateColumns: `50px repeat(7, 1fr)`, minHeight: "40px" }}
          >
            <div className="px-2 py-1 border-r border-gray-100 text-[10px] text-gray-500">{time}</div>

            {weekDays.map((date) => {
              const dateStr = date.toISOString().split("T")[0]
              const dayAppts = weekAppointments[dateStr] || []
              const isWeekend = date.getDay() === 0 || date.getDay() === 6
              const isHoliday = holidays.some((h) => h.date === dateStr)

              // Filter by selected dentists
              const filteredAppts = selectedDentists.includes("all")
                ? dayAppts
                : dayAppts.filter((a) => selectedDentists.includes(a.dentistId))

              // Show simplified appointment indicators
              const hasAppts = filteredAppts.length > 0 && timeIndex < 6 // Only show in working hours

              return (
                <div
                  key={dateStr}
                  onClick={() => onDayClick(date)}
                  className={cn(
                    "border-r border-gray-100 last:border-r-0 p-0.5 cursor-pointer hover:bg-blue-50/50 transition-colors",
                    isWeekend && "bg-gray-50/30",
                    isHoliday && "bg-amber-50/30",
                  )}
                >
                  {hasAppts && timeIndex === 0 && (
                    <div className="space-y-0.5">
                      {filteredAppts.slice(0, 2).map((appt) => {
                        const dentist = dentists.find((d) => d.id === appt.dentistId)
                        return (
                          <div
                            key={appt.dentistId}
                            className="text-[8px] px-1 py-0.5 rounded truncate"
                            style={{ backgroundColor: `${dentist?.color}20`, color: dentist?.color }}
                          >
                            {appt.count} appts
                          </div>
                        )
                      })}
                      {filteredAppts.length > 2 && (
                        <div className="text-[8px] text-gray-400 px-1">+{filteredAppts.length - 2} more</div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="p-2 border-t border-gray-100 flex items-center gap-4 text-[10px] text-gray-500 flex-shrink-0">
        {filteredDentists.map((dentist) => (
          <div key={dentist.id} className="flex items-center gap-1">
            <div className="h-2 w-2 rounded" style={{ backgroundColor: dentist.color }} />
            <span>{dentist.name.split(" ").slice(-1)[0]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
