"use client"

import { staff, appointments } from "@/lib/data"
import { cn } from "@/lib/utils"

const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

export function DoctorSchedule() {
  const doctors = staff.filter((s) => s.role === "dentist")
  const today = new Date().toISOString().split("T")[0]
  const todayAppointments = appointments.filter((apt) => apt.date === "2024-12-10")

  const getAppointmentForSlot = (doctorId: string, time: string) => {
    return todayAppointments.find((apt) => apt.dentistId === doctorId && apt.startTime <= time && apt.endTime > time)
  }

  const statusColors: Record<string, string> = {
    scheduled: "bg-blue-100 text-blue-700 border-l-4 border-blue-500",
    confirmed: "bg-green-100 text-green-700 border-l-4 border-green-500",
    "in-progress": "bg-amber-100 text-amber-700 border-l-4 border-amber-500",
    completed: "bg-gray-100 text-gray-600 border-l-4 border-gray-400",
    cancelled: "bg-red-100 text-red-700 border-l-4 border-red-500",
  }

  return (
    <div className="rounded-2xl bg-background neu-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="w-20 px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Time</th>
              {doctors.map((doctor) => (
                <th key={doctor.id} className="min-w-[200px] px-4 py-3 text-left">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
                      {doctor.firstName[0]}
                      {doctor.lastName[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time) => (
              <tr key={time} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-sm font-medium text-muted-foreground">{time}</td>
                {doctors.map((doctor) => {
                  const appointment = getAppointmentForSlot(doctor.id, time)
                  const isStartTime = appointment?.startTime === time

                  return (
                    <td key={`${doctor.id}-${time}`} className="px-2 py-1">
                      {appointment && isStartTime ? (
                        <div
                          className={cn(
                            "rounded-lg p-3 transition-all hover:scale-[1.02] cursor-pointer",
                            statusColors[appointment.status],
                          )}
                        >
                          <p className="font-medium text-sm">{appointment.patientName}</p>
                          <p className="text-xs mt-1">{appointment.treatmentType}</p>
                          <p className="text-xs mt-1 opacity-75">
                            {appointment.startTime} - {appointment.endTime}
                          </p>
                        </div>
                      ) : appointment ? (
                        <div className="h-16" />
                      ) : (
                        <div className="h-16 rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer" />
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
