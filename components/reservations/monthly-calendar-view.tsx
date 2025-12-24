"use client"

import { cn } from "@/lib/utils"
import { holidays, staffDayOffs } from "@/lib/data"

interface MonthlyCalendarViewProps {
  currentDate: Date
  onDayClick: (date: Date) => void
  selectedDentists?: string[]
}

const dentists = [
  { id: "D001", name: "Drg Soap Mactavish", color: "#f97316" },
  { id: "D002", name: "Drg Cipeng", color: "#3b82f6" },
  { id: "D003", name: "Drg Putri Larasati", color: "#8b5cf6" },
]

// Mock appointments with patient names
const monthAppointments: Record<string, { patientName: string; dentistId: string; time: string }[]> = {
  "2024-12-02": [
    { patientName: "Rafli J.", dentistId: "D001", time: "09:00" },
    { patientName: "Sekar N.", dentistId: "D001", time: "10:00" },
    { patientName: "Angkasa P.", dentistId: "D002", time: "11:00" },
  ],
  "2024-12-03": [
    { patientName: "Ahmad R.", dentistId: "D001", time: "09:00" },
    { patientName: "Budi S.", dentistId: "D002", time: "10:00" },
    { patientName: "Citra D.", dentistId: "D003", time: "14:00" },
  ],
  "2024-12-04": [
    { patientName: "Dewi A.", dentistId: "D002", time: "09:00" },
    { patientName: "Eka P.", dentistId: "D001", time: "11:00" },
  ],
  "2024-12-05": [
    { patientName: "Fani M.", dentistId: "D003", time: "09:00" },
    { patientName: "Gita S.", dentistId: "D001", time: "10:00" },
    { patientName: "Hadi W.", dentistId: "D002", time: "14:00" },
    { patientName: "Indra K.", dentistId: "D001", time: "15:00" },
  ],
  "2024-12-09": [
    { patientName: "Joko P.", dentistId: "D001", time: "09:00" },
    { patientName: "Kartika S.", dentistId: "D002", time: "10:00" },
  ],
  "2024-12-10": [
    { patientName: "Lina M.", dentistId: "D003", time: "09:00" },
    { patientName: "Maya R.", dentistId: "D001", time: "11:00" },
    { patientName: "Nadia F.", dentistId: "D002", time: "14:00" },
  ],
  "2024-12-16": [
    { patientName: "Omar H.", dentistId: "D001", time: "09:00" },
    { patientName: "Putri A.", dentistId: "D002", time: "10:00" },
    { patientName: "Qori B.", dentistId: "D003", time: "11:00" },
  ],
  "2024-12-17": [
    { patientName: "Rina S.", dentistId: "D001", time: "09:00" },
    { patientName: "Sandi T.", dentistId: "D001", time: "10:00" },
    { patientName: "Tina U.", dentistId: "D002", time: "14:00" },
    { patientName: "Udin V.", dentistId: "D003", time: "15:00" },
  ],
  "2024-12-18": [
    { patientName: "Vera W.", dentistId: "D002", time: "09:00" },
    { patientName: "Wati X.", dentistId: "D003", time: "10:00" },
  ],
  "2024-12-19": [
    { patientName: "Yani Y.", dentistId: "D001", time: "09:00" },
    { patientName: "Zaki Z.", dentistId: "D002", time: "11:00" },
    { patientName: "Andi A.", dentistId: "D003", time: "14:00" },
  ],
  "2024-12-20": [
    { patientName: "Beni B.", dentistId: "D001", time: "10:00" },
    { patientName: "Cici C.", dentistId: "D002", time: "14:00" },
  ],
}

export function MonthlyCalendarView({ currentDate, onDayClick, selectedDentists = ["all"] }: MonthlyCalendarViewProps) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()

  const today = new Date()
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const filteredDentists = selectedDentists.includes("all")
    ? dentists
    : dentists.filter((d) => selectedDentists.includes(d.id))

  const getDayData = (day: number) => {
    const date = new Date(year, month, day)
    const dateStr = date.toISOString().split("T")[0]
    const isToday = isCurrentMonth && today.getDate() === day
    const isWeekend = date.getDay() === 0 || date.getDay() === 6
    const holiday = holidays.find((h) => h.date === dateStr)
    const dayOffs = staffDayOffs.filter((d) => d.date === dateStr && d.isApproved)

    // Get appointments filtered by selected dentists
    let appointments = monthAppointments[dateStr] || []
    if (!selectedDentists.includes("all")) {
      appointments = appointments.filter((a) => selectedDentists.includes(a.dentistId))
    }

    return { date, dateStr, isToday, isWeekend, holiday, dayOffs, appointments }
  }

  const calendarDays: (number | null)[] = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  // Calculate rows needed
  const totalCells = calendarDays.length
  const rows = Math.ceil(totalCells / 7)

  return (
    <div className="rounded-2xl bg-white overflow-hidden shadow-sm h-full flex flex-col">
      {/* Week day headers */}
      <div className="grid grid-cols-7 border-b border-gray-100 flex-shrink-0">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={cn(
              "p-2 text-center text-[10px] font-medium",
              index === 0 || index === 6 ? "text-gray-400" : "text-gray-600",
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 grid grid-cols-7 overflow-hidden" style={{ gridTemplateRows: `repeat(${rows}, 1fr)` }}>
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="border-b border-r border-gray-100 bg-gray-50/50" />
          }

          const { date, isToday, isWeekend, holiday, appointments } = getDayData(day)

          return (
            <div
              key={day}
              onClick={() => onDayClick(date)}
              className={cn(
                "border-b border-r border-gray-100 p-1 cursor-pointer transition-all duration-200 overflow-hidden",
                "hover:bg-blue-50",
                isWeekend && "bg-gray-50/50",
                holiday && "bg-amber-50/50",
              )}
            >
              {/* Day number */}
              <div className="flex items-center justify-between mb-0.5">
                <span
                  className={cn(
                    "h-5 w-5 flex items-center justify-center rounded-full text-[10px] font-medium",
                    isToday && "bg-primary text-white",
                    !isToday && isWeekend && "text-gray-400",
                    !isToday && !isWeekend && "text-gray-700",
                  )}
                >
                  {day}
                </span>
              </div>

              {/* Holiday indicator */}
              {holiday && (
                <div className="px-1 py-0.5 bg-amber-100 rounded text-[8px] text-amber-700 truncate mb-0.5">
                  {holiday.name}
                </div>
              )}

              {!holiday && appointments.length > 0 && (
                <div className="space-y-0.5 overflow-hidden">
                  {appointments.slice(0, 3).map((appt, i) => {
                    const dentist = dentists.find((d) => d.id === appt.dentistId)
                    return (
                      <div
                        key={i}
                        className="text-[8px] px-1 py-0.5 rounded truncate font-medium"
                        style={{
                          backgroundColor: `${dentist?.color}15`,
                          color: dentist?.color,
                          borderLeft: `2px solid ${dentist?.color}`,
                        }}
                      >
                        {appt.patientName}
                      </div>
                    )
                  })}
                  {appointments.length > 3 && (
                    <div className="text-[8px] text-gray-400 px-1">+{appointments.length - 3} more</div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="p-2 border-t border-gray-100 flex items-center gap-4 text-[10px] text-gray-500 flex-shrink-0">
        {filteredDentists.map((dentist) => (
          <div key={dentist.id} className="flex items-center gap-1">
            <div className="h-2 w-2 rounded" style={{ backgroundColor: dentist.color }} />
            <span>{dentist.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
