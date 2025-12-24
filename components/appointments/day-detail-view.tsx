"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { appointments, dentalRooms, staff, patients, treatmentTypes } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Clock,
  User,
  Stethoscope,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Phone,
  Mail,
  AlertCircle,
  UserPlus,
  Search,
} from "lucide-react"
import Link from "next/link"

interface DayDetailViewProps {
  date: Date
  selectedDoctor: string
}

export function DayDetailView({ date, selectedDoctor }: DayDetailViewProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showNewAppointment, setShowNewAppointment] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<string | null>(null)

  const [showNewPatientForm, setShowNewPatientForm] = useState(false)
  const [patientSearch, setPatientSearch] = useState("")
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)
  const [newPatient, setNewPatient] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "male" as "male" | "female" | "other",
  })

  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`

  // Filter appointments for this day
  const dayAppointments = appointments
    .filter((apt) => {
      if (apt.date !== dateStr) return false
      if (selectedDoctor !== "all" && apt.dentistId !== selectedDoctor) return false
      return true
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  // Get doctors working today
  const doctors = staff.filter((s) => s.role === "dentist")

  // Time slots from 8 AM to 6 PM
  const timeSlots = Array.from({ length: 21 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8
    const minute = i % 2 === 0 ? "00" : "30"
    return `${String(hour).padStart(2, "0")}:${minute}`
  })

  const statusColors: Record<string, string> = {
    scheduled: "bg-blue-500",
    confirmed: "bg-green-500",
    "in-progress": "bg-amber-500",
    completed: "bg-gray-400",
    cancelled: "bg-red-500",
    "no-show": "bg-purple-500",
  }

  const statusBgColors: Record<string, string> = {
    scheduled: "bg-blue-50 border-blue-200",
    confirmed: "bg-green-50 border-green-200",
    "in-progress": "bg-amber-50 border-amber-200",
    completed: "bg-gray-50 border-gray-200",
    cancelled: "bg-red-50 border-red-200",
    "no-show": "bg-purple-50 border-purple-200",
  }

  const getAppointmentsForSlot = (time: string) => {
    const [slotHour, slotMin] = time.split(":").map(Number)
    const slotMinutes = slotHour * 60 + slotMin

    return dayAppointments.filter((apt) => {
      const [startHour, startMin] = apt.startTime.split(":").map(Number)
      const [endHour, endMin] = apt.endTime.split(":").map(Number)
      const startMinutes = startHour * 60 + startMin
      const endMinutes = endHour * 60 + endMin

      // Appointment is active if slot time is >= start and < end
      return slotMinutes >= startMinutes && slotMinutes < endMinutes
    })
  }

  const getAvailableRoomsForSlot = (time: string) => {
    const activeAppointments = getAppointmentsForSlot(time)
    const occupiedRoomIds = activeAppointments.map((apt) => apt.roomId).filter(Boolean)
    return dentalRooms.filter((room) => room.status !== "maintenance" && !occupiedRoomIds.includes(room.id))
  }

  const slotHasAvailability = (time: string) => {
    return getAvailableRoomsForSlot(time).length > 0
  }

  const filteredPatients = patients.filter((p) => {
    if (!patientSearch) return true
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase()
    return fullName.includes(patientSearch.toLowerCase()) || p.phone.includes(patientSearch)
  })

  const selectedApt = selectedAppointment ? appointments.find((a) => a.id === selectedAppointment) : null
  const selectedPatient = selectedApt ? patients.find((p) => p.id === selectedApt.patientId) : null
  const selectedRoom = selectedApt?.roomId ? dentalRooms.find((r) => r.id === selectedApt.roomId) : null

  const handleTimeSlotClick = (time: string, roomId?: string) => {
    setSelectedTimeSlot(time)
    setSelectedRoomForBooking(roomId || null)
    setShowNewAppointment(true)
    setSelectedPatientId(null)
    setPatientSearch("")
    setShowNewPatientForm(false)
  }

  const handleCreatePatient = () => {
    const newPatientId = `PAT${String(patients.length + 1).padStart(3, "0")}`
    setSelectedPatientId(newPatientId)
    setShowNewPatientForm(false)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Timeline View */}
      <div className="lg:col-span-2 space-y-4">
        {/* Room Status */}
        <div className="rounded-2xl bg-background p-4 neu-card">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">ROOM STATUS</h3>
          <div className="grid grid-cols-5 gap-3">
            {dentalRooms.map((room) => (
              <div
                key={room.id}
                className={cn(
                  "rounded-xl p-3 text-center transition-all",
                  room.status === "available" && "bg-green-50 border border-green-200",
                  room.status === "occupied" && "bg-amber-50 border border-amber-200",
                  room.status === "maintenance" && "bg-red-50 border border-red-200",
                )}
              >
                <p className="font-semibold text-foreground">{room.name}</p>
                <p className="text-xs text-muted-foreground">Chair #{room.chairNumber}</p>
                <span
                  className={cn(
                    "inline-block mt-1 rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                    room.status === "available" && "bg-green-100 text-green-700",
                    room.status === "occupied" && "bg-amber-100 text-amber-700",
                    room.status === "maintenance" && "bg-red-100 text-red-700",
                  )}
                >
                  {room.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Day Summary Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-xl bg-background p-4 neu-card">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-foreground">{dayAppointments.length}</p>
          </div>
          <div className="rounded-xl bg-background p-4 neu-card">
            <p className="text-xs text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {dayAppointments.filter((a) => a.status === "completed").length}
            </p>
          </div>
          <div className="rounded-xl bg-background p-4 neu-card">
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-blue-600">
              {dayAppointments.filter((a) => a.status === "scheduled" || a.status === "confirmed").length}
            </p>
          </div>
          <div className="rounded-xl bg-background p-4 neu-card">
            <p className="text-xs text-muted-foreground">Cancelled</p>
            <p className="text-2xl font-bold text-red-600">
              {dayAppointments.filter((a) => a.status === "cancelled").length}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="rounded-2xl bg-background neu-card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Day Schedule</h3>
            <Button
              size="sm"
              className="rounded-xl neu-button bg-primary text-primary-foreground"
              onClick={() => {
                setSelectedTimeSlot(null)
                setSelectedRoomForBooking(null)
                setShowNewAppointment(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Appointment
            </Button>
          </div>

          <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
            {timeSlots.map((time) => {
              const slotAppointments = getAppointmentsForSlot(time)
              const availableRooms = getAvailableRoomsForSlot(time)
              const hour = Number.parseInt(time.split(":")[0])
              const isLunchTime = hour === 12
              const totalOperationalRooms = dentalRooms.filter((r) => r.status !== "maintenance").length
              const hasPartialAvailability = slotAppointments.length > 0 && availableRooms.length > 0

              return (
                <div key={time} className={cn("flex items-stretch min-h-[60px]", isLunchTime && "bg-muted/30")}>
                  <div className="w-20 flex-shrink-0 p-3 border-r border-border">
                    <span className="text-sm font-medium text-muted-foreground">{time}</span>
                    {isLunchTime && time === "12:00" && <p className="text-xs text-muted-foreground">Lunch</p>}
                  </div>
                  <div className="flex-1 p-2">
                    {slotAppointments.length > 0 ? (
                      <div className="space-y-2">
                        <div
                          className={cn(
                            "grid gap-2",
                            slotAppointments.length === 1 && "grid-cols-1",
                            slotAppointments.length === 2 && "grid-cols-2",
                            slotAppointments.length >= 3 && "grid-cols-3",
                          )}
                        >
                          {slotAppointments.map((apt) => {
                            const room = apt.roomId ? dentalRooms.find((r) => r.id === apt.roomId) : null
                            const isStartSlot = apt.startTime === time

                            return (
                              <button
                                key={apt.id}
                                onClick={() => setSelectedAppointment(apt.id)}
                                className={cn(
                                  "flex flex-col gap-1 rounded-xl p-3 border text-left transition-all hover:scale-[1.01]",
                                  statusBgColors[apt.status],
                                  selectedAppointment === apt.id && "ring-2 ring-primary",
                                  !isStartSlot && "opacity-60", // Dim continuation slots
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <div className={cn("w-1 h-8 rounded-full flex-shrink-0", statusColors[apt.status])} />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-foreground text-sm truncate">{apt.patientName}</p>
                                    <p className="text-xs text-muted-foreground truncate">{apt.treatmentType}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground pl-3">
                                  {room && (
                                    <span className="flex items-center gap-1 bg-background/50 rounded px-1.5 py-0.5">
                                      <MapPin className="h-3 w-3" />
                                      {room.name}
                                    </span>
                                  )}
                                  {isStartSlot && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {apt.startTime}-{apt.endTime}
                                    </span>
                                  )}
                                </div>
                              </button>
                            )
                          })}
                        </div>

                        {hasPartialAvailability && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-muted-foreground">
                              {availableRooms.length} room{availableRooms.length > 1 ? "s" : ""} available:
                            </span>
                            <div className="flex gap-1 flex-wrap">
                              {availableRooms.map((room) => (
                                <button
                                  key={room.id}
                                  onClick={() => handleTimeSlotClick(time, room.id)}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors"
                                >
                                  <Plus className="h-3 w-3" />
                                  {room.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleTimeSlotClick(time)}
                        className="w-full h-full min-h-[44px] rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer flex items-center justify-center gap-2 group"
                      >
                        <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                          Click to book {time}
                        </span>
                        <span className="text-xs text-muted-foreground group-hover:text-primary/70">
                          ({totalOperationalRooms} rooms available)
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Appointment Details Panel */}
      <div className="space-y-4">
        {selectedApt && selectedPatient ? (
          <>
            {/* Patient Info Card */}
            <div className="rounded-2xl bg-background p-4 neu-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Patient Details</h3>
                <Link href={`/patients/${selectedApt.patientId}`}>
                  <Button variant="ghost" size="sm" className="rounded-xl text-primary">
                    View Profile
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-lg font-semibold text-primary-foreground">
                  {selectedPatient.firstName[0]}
                  {selectedPatient.lastName[0]}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {selectedPatient.firstName} {selectedPatient.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">ID: {selectedPatient.id}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{selectedPatient.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{selectedPatient.email}</span>
                </div>
                {selectedPatient.allergies.length > 0 && (
                  <div className="flex items-start gap-2 text-amber-600 bg-amber-50 rounded-lg p-2 mt-3">
                    <AlertCircle className="h-4 w-4 mt-0.5" />
                    <div>
                      <p className="font-medium">Allergies</p>
                      <p className="text-xs">{selectedPatient.allergies.join(", ")}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Appointment Details Card */}
            <div className="rounded-2xl bg-background p-4 neu-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Appointment Details</h3>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8" onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8 text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium capitalize",
                      selectedApt.status === "scheduled" && "bg-blue-100 text-blue-700",
                      selectedApt.status === "confirmed" && "bg-green-100 text-green-700",
                      selectedApt.status === "in-progress" && "bg-amber-100 text-amber-700",
                      selectedApt.status === "completed" && "bg-gray-100 text-gray-600",
                      selectedApt.status === "cancelled" && "bg-red-100 text-red-700",
                    )}
                  >
                    {selectedApt.status.replace("-", " ")}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium text-foreground">
                      {selectedApt.startTime} - {selectedApt.endTime} ({selectedApt.duration} min)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Treatment</p>
                    <p className="font-medium text-foreground">{selectedApt.treatmentType}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Doctor</p>
                    <p className="font-medium text-foreground">{selectedApt.dentistName}</p>
                  </div>
                </div>

                {selectedRoom && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Room</p>
                      <p className="font-medium text-foreground">
                        {selectedRoom.name} - Chair #{selectedRoom.chairNumber} (Floor {selectedRoom.floor})
                      </p>
                    </div>
                  </div>
                )}

                {selectedApt.notes && (
                  <div className="rounded-xl bg-muted/50 p-3 mt-2">
                    <p className="text-sm font-medium text-foreground mb-1">Notes</p>
                    <p className="text-sm text-muted-foreground">{selectedApt.notes}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-6">
                {selectedApt.status === "scheduled" && (
                  <>
                    <Button className="flex-1 rounded-xl bg-green-600 text-white hover:bg-green-700">
                      <Check className="mr-2 h-4 w-4" />
                      Confirm
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </>
                )}
                {selectedApt.status === "confirmed" && (
                  <Button className="flex-1 rounded-xl bg-primary text-primary-foreground">Start Appointment</Button>
                )}
                {selectedApt.status === "in-progress" && (
                  <Button className="flex-1 rounded-xl bg-green-600 text-white hover:bg-green-700">
                    <Check className="mr-2 h-4 w-4" />
                    Complete
                  </Button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-2xl bg-background p-8 neu-card text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">No Appointment Selected</h3>
            <p className="text-sm text-muted-foreground">
              Click on an appointment in the timeline to view details, or click an available slot to book
            </p>
          </div>
        )}

        {/* Quick Add Section */}
        <div className="rounded-2xl bg-background p-4 neu-card">
          <h3 className="font-semibold text-foreground mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="w-full rounded-xl neu-button border-0 bg-transparent"
              onClick={() => {
                setSelectedTimeSlot(null)
                setSelectedRoomForBooking(null)
                setShowNewAppointment(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Apt
            </Button>
            <Link href="/patients/new">
              <Button variant="outline" className="w-full rounded-xl neu-button border-0 bg-transparent">
                <User className="mr-2 h-4 w-4" />
                New Patient
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {showNewAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-background p-6 neu-card max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">New Appointment</h2>
                {selectedTimeSlot && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Booking for {date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}{" "}
                    at {selectedTimeSlot}
                    {selectedRoomForBooking && (
                      <span className="ml-1">in {dentalRooms.find((r) => r.id === selectedRoomForBooking)?.name}</span>
                    )}
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  setShowNewAppointment(false)
                  setSelectedTimeSlot(null)
                  setSelectedRoomForBooking(null)
                  setShowNewPatientForm(false)
                  setSelectedPatientId(null)
                  setPatientSearch("")
                }}
                className="rounded-xl p-2 text-muted-foreground hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Patient Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Patient</Label>
                  {!showNewPatientForm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-xl text-primary"
                      onClick={() => setShowNewPatientForm(true)}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add New Patient
                    </Button>
                  )}
                </div>

                {showNewPatientForm ? (
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <UserPlus className="h-4 w-4 text-primary" />
                        New Patient Details
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-xl text-muted-foreground"
                        onClick={() => setShowNewPatientForm(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>First Name *</Label>
                        <Input
                          placeholder="John"
                          className="rounded-xl neu-pressed border-0"
                          value={newPatient.firstName}
                          onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name *</Label>
                        <Input
                          placeholder="Doe"
                          className="rounded-xl neu-pressed border-0"
                          value={newPatient.lastName}
                          onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Phone *</Label>
                        <Input
                          placeholder="(555) 123-4567"
                          className="rounded-xl neu-pressed border-0"
                          value={newPatient.phone}
                          onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          className="rounded-xl neu-pressed border-0"
                          value={newPatient.email}
                          onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date of Birth</Label>
                        <Input
                          type="date"
                          className="rounded-xl neu-pressed border-0"
                          value={newPatient.dateOfBirth}
                          onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <Select
                          value={newPatient.gender}
                          onValueChange={(value: "male" | "female" | "other") =>
                            setNewPatient({ ...newPatient, gender: value })
                          }
                        >
                          <SelectTrigger className="rounded-xl neu-pressed border-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      className="w-full rounded-xl bg-primary text-primary-foreground"
                      onClick={handleCreatePatient}
                      disabled={!newPatient.firstName || !newPatient.lastName || !newPatient.phone}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Create Patient & Continue
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search patients by name or phone..."
                        className="rounded-xl neu-pressed border-0 pl-10"
                        value={patientSearch}
                        onChange={(e) => setPatientSearch(e.target.value)}
                      />
                    </div>

                    <div className="max-h-48 overflow-y-auto rounded-xl border border-border">
                      {filteredPatients.length > 0 ? (
                        filteredPatients.slice(0, 10).map((patient) => (
                          <button
                            key={patient.id}
                            onClick={() => setSelectedPatientId(patient.id)}
                            className={cn(
                              "w-full flex items-center gap-3 p-3 text-left hover:bg-muted/50 transition-colors border-b border-border last:border-0",
                              selectedPatientId === patient.id && "bg-primary/10",
                            )}
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                              {patient.firstName[0]}
                              {patient.lastName[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground">
                                {patient.firstName} {patient.lastName}
                              </p>
                              <p className="text-sm text-muted-foreground">{patient.phone}</p>
                            </div>
                            {selectedPatientId === patient.id && <Check className="h-5 w-5 text-primary" />}
                          </button>
                        ))
                      ) : (
                        <div className="p-6 text-center">
                          <p className="text-sm text-muted-foreground mb-2">No patients found</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl bg-transparent"
                            onClick={() => setShowNewPatientForm(true)}
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add New Patient
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Appointment Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" defaultValue={dateStr} className="rounded-xl neu-pressed border-0" />
                </div>
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    defaultValue={selectedTimeSlot || "09:00"}
                    className="rounded-xl neu-pressed border-0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Treatment Type</Label>
                <Select>
                  <SelectTrigger className="rounded-xl neu-pressed border-0">
                    <SelectValue placeholder="Select treatment" />
                  </SelectTrigger>
                  <SelectContent>
                    {treatmentTypes.map((treatment) => (
                      <SelectItem key={treatment.id} value={treatment.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{treatment.name}</span>
                          <span className="text-muted-foreground ml-4">
                            {treatment.duration} min - ${treatment.basePrice}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Doctor</Label>
                <Select defaultValue={selectedDoctor !== "all" ? selectedDoctor : undefined}>
                  <SelectTrigger className="rounded-xl neu-pressed border-0">
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doc) => (
                      <SelectItem key={doc.id} value={doc.id}>
                        Dr. {doc.firstName} {doc.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Room & Chair</Label>
                <Select defaultValue={selectedRoomForBooking || undefined}>
                  <SelectTrigger className="rounded-xl neu-pressed border-0">
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    {dentalRooms.map((r) => {
                      const isAvailable = selectedTimeSlot
                        ? getAvailableRoomsForSlot(selectedTimeSlot).some((room) => room.id === r.id)
                        : r.status !== "maintenance"
                      return (
                        <SelectItem
                          key={r.id}
                          value={r.id}
                          disabled={r.status === "maintenance" || (selectedTimeSlot && !isAvailable)}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "w-2 h-2 rounded-full",
                                r.status === "maintenance"
                                  ? "bg-red-500"
                                  : isAvailable
                                    ? "bg-green-500"
                                    : "bg-amber-500",
                              )}
                            />
                            {r.name} - Chair #{r.chairNumber} (Floor {r.floor})
                            {r.status === "maintenance" && (
                              <span className="text-xs text-red-500 ml-2">Maintenance</span>
                            )}
                            {selectedTimeSlot && !isAvailable && r.status !== "maintenance" && (
                              <span className="text-xs text-amber-500 ml-2">Booked</span>
                            )}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Add any notes about this appointment..."
                  className="rounded-xl neu-pressed border-0 min-h-[80px]"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                className="flex-1 rounded-xl bg-primary text-primary-foreground"
                disabled={!selectedPatientId && !showNewPatientForm}
              >
                <Check className="mr-2 h-4 w-4" />
                Book Appointment
              </Button>
              <Button
                variant="outline"
                className="rounded-xl neu-button border-0 bg-transparent"
                onClick={() => {
                  setShowNewAppointment(false)
                  setSelectedTimeSlot(null)
                  setSelectedRoomForBooking(null)
                  setShowNewPatientForm(false)
                  setSelectedPatientId(null)
                  setPatientSearch("")
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Appointment Modal */}
      {isEditing && selectedApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-background p-6 neu-card max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Edit Appointment</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-xl p-2 text-muted-foreground hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input type="time" defaultValue={selectedApt.startTime} className="rounded-xl neu-pressed border-0" />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input type="time" defaultValue={selectedApt.endTime} className="rounded-xl neu-pressed border-0" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Doctor</Label>
                <Select defaultValue={selectedApt.dentistId}>
                  <SelectTrigger className="rounded-xl neu-pressed border-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doc) => (
                      <SelectItem key={doc.id} value={doc.id}>
                        Dr. {doc.firstName} {doc.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Room & Chair</Label>
                <Select defaultValue={selectedApt.roomId}>
                  <SelectTrigger className="rounded-xl neu-pressed border-0">
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    {dentalRooms
                      .filter((r) => r.status !== "maintenance")
                      .map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.name} - Chair #{r.chairNumber} (Floor {r.floor})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select defaultValue={selectedApt.status}>
                  <SelectTrigger className="rounded-xl neu-pressed border-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no-show">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  defaultValue={selectedApt.notes || ""}
                  placeholder="Add notes..."
                  className="rounded-xl neu-pressed border-0 min-h-[100px]"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button className="flex-1 rounded-xl bg-primary text-primary-foreground">Save Changes</Button>
              <Button
                variant="outline"
                className="rounded-xl neu-button border-0 bg-transparent"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
