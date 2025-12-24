"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Coffee, Calendar, Plus } from "lucide-react"
import { holidays, staffDayOffs } from "@/lib/data"
import { useStore } from "@/lib/store"
import { AppointmentDetailPanel } from "./appointment-detail-panel"

interface ReservationCalendarProps {
  currentDate: Date
  onSlotClick: (time: string, dentistId: string, endTime?: string) => void
  selectedDentists?: string[]
  workingHours?: { start: string; end: string }
  breakTime?: { start: string; end: string }
}

interface Appointment {
  id: string
  patientName: string
  patientPhone?: string
  patientEmail?: string
  patientAge?: number
  patientGender?: string
  patientAddress?: string
  startTime: string
  endTime: string
  treatment: string
  status: "finished" | "doing-treatment" | "registered" | "waiting-payment"
  dentistId: string
  dentistName?: string
  date: string
  billId?: string
  billStatus?: "paid" | "unpaid"
  isManual?: boolean
  medicalCheckupDone?: boolean
  medicalRecordAdded?: boolean
}

interface CalendarDentist {
  id: string
  name: string
  avatar?: string
  todayAppointments: number
  isAvailable: boolean
  unavailableSlots?: { start: string; end: string }[]
  color: string
}

const appointments: Appointment[] = [
  {
    id: "RSVA0011",
    patientName: "Rafli Jainudin",
    patientPhone: "+1 (409)-832-3913",
    patientEmail: "rafli.j@mail.com",
    patientAge: 28,
    patientGender: "Male",
    patientAddress: "4337 Lynn Ogden Lane, Beaumont, TX 77701",
    startTime: "09:00",
    endTime: "10:00",
    treatment: "General Checkup",
    status: "finished",
    dentistId: "S001",
    dentistName: "Drg Soap Mactavish",
    date: new Date().toISOString().split("T")[0],
    billId: "10102",
    billStatus: "paid",
    isManual: true,
    medicalCheckupDone: true,
    medicalRecordAdded: true,
  },
  {
    id: "RSVA0012",
    patientName: "Sekar Nandita",
    patientPhone: "+1 (555)-123-4567",
    patientEmail: "sekar.n@mail.com",
    patientAge: 32,
    patientGender: "Female",
    patientAddress: "123 Main Street, Houston, TX 77001",
    startTime: "10:00",
    endTime: "11:00",
    treatment: "Scaling",
    status: "finished",
    dentistId: "S001",
    dentistName: "Drg Soap Mactavish",
    date: new Date().toISOString().split("T")[0],
    billId: "10103",
    billStatus: "paid",
    isManual: false,
    medicalCheckupDone: true,
    medicalRecordAdded: true,
  },
  {
    id: "RSVA0013",
    patientName: "Angkasa Pura",
    patientPhone: "+1 (555)-987-6543",
    patientEmail: "angkasa.p@mail.com",
    patientAge: 45,
    patientGender: "Male",
    patientAddress: "789 Oak Avenue, Dallas, TX 75201",
    startTime: "11:00",
    endTime: "12:00",
    treatment: "Bleaching",
    status: "finished",
    dentistId: "S002",
    dentistName: "Drg Cipeng",
    date: new Date().toISOString().split("T")[0],
    billId: "10104",
    billStatus: "unpaid",
    isManual: true,
    medicalCheckupDone: true,
    medicalRecordAdded: false,
  },
  {
    id: "RSVA0014",
    patientName: "Lembayung Senja",
    patientPhone: "+1 (555)-246-8135",
    patientEmail: "lembayung.s@mail.com",
    patientAge: 29,
    patientGender: "Female",
    patientAddress: "456 Pine Road, Austin, TX 78701",
    startTime: "12:00",
    endTime: "13:00",
    treatment: "Extraction",
    status: "doing-treatment",
    dentistId: "S001",
    dentistName: "Drg Soap Mactavish",
    date: new Date().toISOString().split("T")[0],
    billId: "10105",
    billStatus: "unpaid",
    isManual: false,
    medicalCheckupDone: true,
    medicalRecordAdded: false,
  },
  {
    id: "RSVA0015",
    patientName: "Daniswara",
    patientPhone: "+1 (555)-369-2580",
    patientEmail: "daniswara@mail.com",
    patientAge: 35,
    patientGender: "Male",
    patientAddress: "321 Elm Street, San Antonio, TX 78201",
    startTime: "14:30",
    endTime: "15:30",
    treatment: "General Checkup",
    status: "registered",
    dentistId: "S001",
    dentistName: "Drg Soap Mactavish",
    date: new Date().toISOString().split("T")[0],
    billId: "10106",
    billStatus: "unpaid",
    isManual: true,
    medicalCheckupDone: false,
    medicalRecordAdded: false,
  },
  {
    id: "RSVA0016",
    patientName: "Raihan",
    patientPhone: "+1 (555)-147-2583",
    patientEmail: "raihan@mail.com",
    patientAge: 22,
    patientGender: "Male",
    patientAddress: "654 Maple Drive, Fort Worth, TX 76101",
    startTime: "15:00",
    endTime: "16:00",
    treatment: "Tooth Filling",
    status: "waiting-payment",
    dentistId: "S002",
    dentistName: "Drg Cipeng",
    date: new Date().toISOString().split("T")[0],
    billId: "10107",
    billStatus: "unpaid",
    isManual: false,
    medicalCheckupDone: true,
    medicalRecordAdded: true,
  },
]

const generateTimeSlots = (startHour: number, endHour: number) => {
  const slots: string[] = []
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`)
    slots.push(`${hour.toString().padStart(2, "0")}:30`)
  }
  return slots
}

export function ReservationCalendar({
  currentDate,
  onSlotClick,
  selectedDentists = ["all"],
  workingHours = { start: "07:00", end: "19:00" },
  breakTime = { start: "12:00", end: "13:00" },
}: ReservationCalendarProps) {
  const { dentists: storeDentists } = useStore()

  const dentists: CalendarDentist[] = storeDentists.map((d, index) => ({
    id: d.id,
    name: d.name,
    avatar: "/placeholder.svg?height=40&width=40",
    todayAppointments: d.todayAppointments,
    isAvailable: d.isAvailable,
    unavailableSlots: index === 2 ? [{ start: "09:00", end: "11:00" }] : undefined,
    color: d.color,
  }))

  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null)
  const [currentTimePosition, setCurrentTimePosition] = useState<number>(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ time: string; dentistId: string; index: number } | null>(null)
  const [dragEnd, setDragEnd] = useState<{ time: string; dentistId: string; index: number } | null>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const startHour = Number.parseInt(workingHours.start.split(":")[0])
  const endHour = Number.parseInt(workingHours.end.split(":")[0])
  const timeSlots = generateTimeSlots(startHour, endHour)

  const slotHeight = 60
  const dentistColumnWidth = 280

  const now = new Date()
  const isToday = currentDate.toDateString() === now.toDateString()
  const dateStr = currentDate.toISOString().split("T")[0]
  const isHoliday = holidays.some((h) => h.date === dateStr)

  useEffect(() => {
    if (scrollContainerRef.current) {
      const defaultViewStart = 9
      const slotsToScroll = (defaultViewStart - startHour) * 2
      const scrollPosition = slotsToScroll * slotHeight
      scrollContainerRef.current.scrollTop = scrollPosition
    }
  }, [startHour, slotHeight])

  useEffect(() => {
    const updatePosition = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      if (hours >= startHour && hours < endHour) {
        const totalMinutes = (hours - startHour) * 60 + minutes
        const position = (totalMinutes / 30) * slotHeight
        setCurrentTimePosition(position)
      }
    }
    updatePosition()
    const interval = setInterval(updatePosition, 60000)
    return () => clearInterval(interval)
  }, [startHour, endHour, slotHeight])

  const handleMouseDown = (time: string, dentistId: string, index: number, canBook: boolean) => {
    if (!canBook) return
    setIsDragging(true)
    setDragStart({ time, dentistId, index })
    setDragEnd({ time, dentistId, index })
  }

  const handleMouseEnter = (time: string, dentistId: string, index: number, canBook: boolean) => {
    if (isDragging && dragStart && dentistId === dragStart.dentistId && canBook) {
      setDragEnd({ time, dentistId, index })
    }
    if (!isDragging) {
      setHoveredSlot(`${time}-${dentistId}`)
    }
  }

  const handleMouseUp = () => {
    if (isDragging && dragStart && dragEnd) {
      const startIndex = Math.min(dragStart.index, dragEnd.index)
      const endIndex = Math.max(dragStart.index, dragEnd.index)
      const startTime = timeSlots[startIndex]
      const endSlotTime = timeSlots[endIndex]

      const endHourNum = Number.parseInt(endSlotTime.split(":")[0])
      const endMinNum = Number.parseInt(endSlotTime.split(":")[1])
      const newEndMin = endMinNum + 30
      const endTime =
        newEndMin >= 60
          ? `${(endHourNum + 1).toString().padStart(2, "0")}:00`
          : `${endHourNum.toString().padStart(2, "0")}:30`

      onSlotClick(startTime, dragStart.dentistId, endTime)
    }
    setIsDragging(false)
    setDragStart(null)
    setDragEnd(null)
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp()
      }
    }
    window.addEventListener("mouseup", handleGlobalMouseUp)
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp)
  }, [isDragging, dragStart, dragEnd])

  const isSlotInDragRange = (dentistId: string, index: number) => {
    if (!isDragging || !dragStart || !dragEnd || dragStart.dentistId !== dentistId) return false
    const startIndex = Math.min(dragStart.index, dragEnd.index)
    const endIndex = Math.max(dragStart.index, dragEnd.index)
    return index >= startIndex && index <= endIndex
  }

  const getDayOffForStaff = (staffId: string) => {
    return staffDayOffs.find((d) => d.staffId === staffId && d.date === dateStr && d.isApproved)
  }

  const filteredDentists = selectedDentists.includes("all")
    ? dentists
    : dentists.filter((d) => selectedDentists.includes(d.id))

  const getAppointmentForSlot = (time: string, dentistId: string) => {
    const slotHour = Number.parseInt(time.split(":")[0])
    const slotMin = Number.parseInt(time.split(":")[1])
    const slotTotalMin = slotHour * 60 + slotMin

    return appointments.find((apt) => {
      if (apt.dentistId !== dentistId) return false
      const aptStartHour = Number.parseInt(apt.startTime.split(":")[0])
      const aptStartMin = Number.parseInt(apt.startTime.split(":")[1])
      const aptEndHour = Number.parseInt(apt.endTime.split(":")[0])
      const aptEndMin = Number.parseInt(apt.endTime.split(":")[1])
      const aptStartTotal = aptStartHour * 60 + aptStartMin
      const aptEndTotal = aptEndHour * 60 + aptEndMin
      return slotTotalMin >= aptStartTotal && slotTotalMin < aptEndTotal
    })
  }

  const isAppointmentStart = (time: string, dentistId: string) => {
    return appointments.some((apt) => apt.startTime === time && apt.dentistId === dentistId)
  }

  const getAppointmentSpan = (appointment: Appointment) => {
    const startHour = Number.parseInt(appointment.startTime.split(":")[0])
    const startMin = Number.parseInt(appointment.startTime.split(":")[1])
    const endHour = Number.parseInt(appointment.endTime.split(":")[0])
    const endMin = Number.parseInt(appointment.endTime.split(":")[1])
    const durationMin = endHour * 60 + endMin - (startHour * 60 + startMin)
    return Math.ceil(durationMin / 30)
  }

  const isSlotInBreak = (time: string) => {
    const slotHour = Number.parseInt(time.split(":")[0])
    const slotMin = Number.parseInt(time.split(":")[1])
    const slotTotal = slotHour * 60 + slotMin
    const breakStartHour = Number.parseInt(breakTime.start.split(":")[0])
    const breakStartMin = Number.parseInt(breakTime.start.split(":")[1])
    const breakEndHour = Number.parseInt(breakTime.end.split(":")[0])
    const breakEndMin = Number.parseInt(breakTime.end.split(":")[1])
    const breakStart = breakStartHour * 60 + breakStartMin
    const breakEnd = breakEndHour * 60 + breakEndMin
    return slotTotal >= breakStart && slotTotal < breakEnd
  }

  const isSlotUnavailable = (time: string, dentist: CalendarDentist) => {
    if (!dentist.unavailableSlots) return false
    const slotHour = Number.parseInt(time.split(":")[0])
    const slotMin = Number.parseInt(time.split(":")[1])
    const slotTotal = slotHour * 60 + slotMin
    return dentist.unavailableSlots.some((slot) => {
      const sHour = Number.parseInt(slot.start.split(":")[0])
      const sMin = Number.parseInt(slot.start.split(":")[1])
      const eHour = Number.parseInt(slot.end.split(":")[0])
      const eMin = Number.parseInt(slot.end.split(":")[1])
      const start = sHour * 60 + sMin
      const end = eHour * 60 + eMin
      return slotTotal >= start && slotTotal < end
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "finished":
        return (
          <span className="flex items-center gap-1 text-[10px] text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Finished
          </span>
        )
      case "doing-treatment":
        return (
          <span className="flex items-center gap-1 text-[10px] text-amber-600">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Encounter
          </span>
        )
      case "registered":
        return (
          <span className="flex items-center gap-1 text-[10px] text-blue-600">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Registered
          </span>
        )
      case "waiting-payment":
        return (
          <span className="flex items-center gap-1 text-[10px] text-orange-600">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            Waiting Payment
          </span>
        )
      default:
        return null
    }
  }

  const getAppointmentBgColor = (status: string) => {
    switch (status) {
      case "finished":
        return "bg-emerald-50 border-l-[3px] border-l-emerald-400"
      case "doing-treatment":
        return "bg-rose-50 border-l-[3px] border-l-rose-400"
      case "registered":
        return "bg-blue-50 border-l-[3px] border-l-blue-400"
      case "waiting-payment":
        return "bg-amber-50 border-l-[3px] border-l-amber-400"
      default:
        return "bg-gray-50"
    }
  }

  const formatHour = (time: string) => {
    const hour = Number.parseInt(time.split(":")[0])
    const min = time.split(":")[1]
    const suffix = hour < 12 ? "am" : "pm"
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return min === "00" ? `${displayHour}${suffix}` : null
  }

  const formatTimeRange = (start: string, end: string) => {
    const formatT = (t: string) => {
      const h = Number.parseInt(t.split(":")[0])
      const m = t.split(":")[1]
      const suffix = h < 12 ? "AM" : "PM"
      const dh = h === 0 ? 12 : h > 12 ? h - 12 : h
      return `${dh.toString().padStart(2, "0")}:${m} ${suffix}`
    }
    return `${formatT(start)} > ${formatT(end)}`
  }

  const handleAppointmentClick = (appointment: Appointment, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedAppointment(appointment)
  }

  if (isHoliday) {
    const holiday = holidays.find((h) => h.date === dateStr)
    return (
      <div className="rounded-2xl bg-white overflow-hidden shadow-sm h-full flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
            <Calendar className="h-6 w-6 text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Clinic Closed</h3>
          <p className="text-gray-500 text-sm">{holiday?.name}</p>
        </div>
      </div>
    )
  }

  if (filteredDentists.length === 0) {
    return (
      <div className="rounded-2xl bg-white overflow-hidden shadow-sm h-full flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <Calendar className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No Dentists Available</h3>
          <p className="text-gray-500 text-sm">Add dentists from Staff List to see the calendar</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        ref={containerRef}
        className="rounded-2xl bg-white overflow-hidden shadow-sm h-full flex flex-col select-none"
        onMouseLeave={() => setHoveredSlot(null)}
      >
        {/* Header with dentists - fixed */}
        <div className="border-b border-gray-100 flex-shrink-0 overflow-x-auto">
          <div className="flex" style={{ minWidth: `${60 + filteredDentists.length * dentistColumnWidth}px` }}>
            {/* GMT column */}
            <div className="w-[60px] flex-shrink-0 p-2 border-r border-gray-100">
              <div className="text-[10px] text-gray-400">GMT</div>
              <div className="text-[10px] text-gray-400">+07:00</div>
            </div>

            {/* Dentist columns */}
            {filteredDentists.map((dentist) => {
              const dayOff = getDayOffForStaff(dentist.id)
              return (
                <div
                  key={dentist.id}
                  className={cn(
                    "p-3 border-r border-gray-100 last:border-r-0 hover:bg-gray-50 transition-colors flex-shrink-0",
                    dayOff && "bg-gray-50",
                  )}
                  style={{ width: `${dentistColumnWidth}px` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={dentist.avatar || "/placeholder.svg"} alt={dentist.name} />
                        <AvatarFallback className="text-xs" style={{ backgroundColor: dentist.color, color: "white" }}>
                          {dentist.name
                            .split(" ")
                            .slice(-2)
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight">{dentist.name}</h3>
                        {dayOff ? (
                          <p className="text-xs text-amber-600 font-medium">Day Off</p>
                        ) : (
                          <p className="text-xs text-gray-500">
                            Today's appointment:{" "}
                            <span className="text-primary">{dentist.todayAppointments} patient(s)</span>
                          </p>
                        )}
                      </div>
                    </div>
                    <button className="p-1 rounded hover:bg-gray-100">
                      <MoreHorizontal className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Time slots grid - scrollable */}
        <div ref={scrollContainerRef} className="relative flex-1 overflow-auto">
          {/* Current time indicator */}
          {isToday && currentTimePosition > 0 && (
            <div
              className="absolute left-0 right-0 z-20 flex items-center pointer-events-none"
              style={{ top: `${currentTimePosition}px` }}
            >
              <div className="w-[60px] pr-1 text-right">
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                  {now.getHours().toString().padStart(2, "0")}:{now.getMinutes().toString().padStart(2, "0")}{" "}
                  {now.getHours() < 12 ? "AM" : "PM"}
                </span>
              </div>
              <div className="flex-1 h-[2px] bg-rose-500" />
            </div>
          )}

          <div style={{ minWidth: `${60 + filteredDentists.length * dentistColumnWidth}px` }}>
            {timeSlots.map((time, timeIndex) => {
              const isHourMark = time.endsWith(":00")
              const isBreakSlot = isSlotInBreak(time)
              const isBreakStart = isBreakSlot && (timeIndex === 0 || !isSlotInBreak(timeSlots[timeIndex - 1]))

              return (
                <div
                  key={time}
                  className={cn("flex", isHourMark ? "border-t border-gray-200" : "border-t border-gray-50")}
                  style={{ height: `${slotHeight}px` }}
                >
                  {/* Time label */}
                  <div className="w-[60px] flex-shrink-0 px-2 border-r border-gray-100 text-xs text-gray-400 flex items-start pt-1">
                    {formatHour(time)}
                  </div>

                  {/* Dentist columns */}
                  {filteredDentists.map((dentist) => {
                    const appointment = getAppointmentForSlot(time, dentist.id)
                    const isStart = appointment && isAppointmentStart(time, dentist.id)
                    const span = appointment ? getAppointmentSpan(appointment) : 1
                    const isUnavailable = isSlotUnavailable(time, dentist)
                    const dayOff = getDayOffForStaff(dentist.id)
                    const slotKey = `${time}-${dentist.id}`
                    const isHovered = hoveredSlot === slotKey
                    const canBook = !appointment && !isBreakSlot && !isUnavailable && !dayOff
                    const inDragRange = isSlotInDragRange(dentist.id, timeIndex)

                    return (
                      <div
                        key={dentist.id}
                        className={cn(
                          "relative border-r border-gray-100 last:border-r-0 transition-all duration-100 flex-shrink-0",
                          canBook && "hover:bg-blue-50 cursor-pointer",
                          inDragRange && "bg-blue-100",
                        )}
                        style={{ width: `${dentistColumnWidth}px` }}
                        onMouseDown={() => handleMouseDown(time, dentist.id, timeIndex, canBook)}
                        onMouseEnter={() => handleMouseEnter(time, dentist.id, timeIndex, canBook)}
                      >
                        {/* Day off / Unavailable pattern - synced across all columns */}
                        {(dayOff || isUnavailable) && (
                          <div
                            className="absolute inset-0 bg-gray-100"
                            style={{
                              backgroundImage: `repeating-linear-gradient(135deg, transparent, transparent 8px, rgba(156,163,175,0.3) 8px, rgba(156,163,175,0.3) 16px)`,
                              backgroundPosition: "0 0",
                            }}
                          >
                            {isUnavailable && !dayOff && isHourMark && (
                              <span className="absolute inset-0 flex items-center justify-center text-[11px] text-gray-400 font-medium tracking-wider">
                                NOT AVAILABLE
                              </span>
                            )}
                          </div>
                        )}

                        {/* Break time pattern - synced across all columns */}
                        {isBreakSlot && (
                          <div
                            className="absolute inset-0 bg-gray-100"
                            style={{
                              backgroundImage: `repeating-linear-gradient(135deg, transparent, transparent 8px, rgba(156,163,175,0.3) 8px, rgba(156,163,175,0.3) 16px)`,
                              backgroundPosition: "0 0",
                            }}
                          >
                            {isBreakStart && (
                              <span className="absolute inset-0 flex items-center justify-center text-[11px] text-gray-400 font-medium tracking-wider gap-1.5">
                                <Coffee className="h-3.5 w-3.5" />
                                BREAK TIME
                              </span>
                            )}
                          </div>
                        )}

                        {/* Appointment card */}
                        {isStart && appointment && (
                          <div
                            className={cn(
                              "absolute left-1 right-1 top-1 rounded-lg p-2 z-10 cursor-pointer transition-shadow hover:shadow-md",
                              getAppointmentBgColor(appointment.status),
                            )}
                            style={{ height: `${span * slotHeight - 8}px` }}
                            onClick={(e) => handleAppointmentClick(appointment, e)}
                          >
                            <div className="flex items-start justify-between mb-1">
                              <div className="flex items-center gap-1.5">
                                <div
                                  className={cn(
                                    "h-5 w-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold",
                                    appointment.status === "finished" && "bg-emerald-500",
                                    appointment.status === "doing-treatment" && "bg-rose-500",
                                    appointment.status === "registered" && "bg-blue-500",
                                    appointment.status === "waiting-payment" && "bg-amber-500",
                                  )}
                                >
                                  {appointment.status === "finished" ? (
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  ) : (
                                    appointment.patientName.charAt(0)
                                  )}
                                </div>
                                <span className="font-semibold text-gray-900 text-xs truncate max-w-[120px]">
                                  {appointment.patientName}
                                </span>
                              </div>
                              {getStatusBadge(appointment.status)}
                            </div>
                            <p className="text-[10px] text-gray-500 mb-1">
                              {formatTimeRange(appointment.startTime, appointment.endTime)}
                            </p>
                            {appointment.status === "waiting-payment" ? (
                              <div
                                className="px-2 py-1 rounded text-[10px] font-medium text-amber-700 flex items-center gap-1"
                                style={{
                                  backgroundImage:
                                    "repeating-linear-gradient(90deg, #fef3c7, #fef3c7 4px, #fde68a 4px, #fde68a 8px)",
                                }}
                              >
                                <span>⏳</span>
                                WAITING PAYMENT FOR {appointment.patientName.toUpperCase()}
                              </div>
                            ) : (
                              <span className="inline-block bg-white/80 px-2 py-0.5 rounded text-[10px] text-gray-600">
                                {appointment.treatment}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Hover plus button for empty slots */}
                        {canBook && isHovered && !inDragRange && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                              <Plus className="h-4 w-4 text-primary" />
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <AppointmentDetailPanel
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
        onStatusChange={(id, status) => {
          console.log("Status changed:", id, status)
        }}
        onExtendTime={(id) => {
          console.log("Extend time:", id)
        }}
        onSendReminder={(id) => {
          console.log("Send reminder:", id)
        }}
        onEditMedicalCheckup={(id) => {
          console.log("Edit medical checkup:", id)
        }}
        onAddMedicalRecord={(id) => {
          console.log("Add medical record:", id)
        }}
        onFinish={(id) => {
          console.log("Finish appointment:", id)
          setSelectedAppointment(null)
        }}
      />
    </>
  )
}
