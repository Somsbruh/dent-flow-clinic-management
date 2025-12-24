"use client"

import { useState } from "react"
import {
  X,
  Calendar,
  Clock,
  User,
  Stethoscope,
  FileText,
  MapPin,
  Edit2,
  Trash2,
  Phone,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { appointments, dentalRooms, staff, patients } from "@/lib/data"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface AppointmentModalProps {
  appointmentId: string
  onClose: () => void
}

export function AppointmentModal({ appointmentId, onClose }: AppointmentModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const appointment = appointments.find((apt) => apt.id === appointmentId)
  const patient = appointment ? patients.find((p) => p.id === appointment.patientId) : null
  const room = appointment?.roomId ? dentalRooms.find((r) => r.id === appointment.roomId) : null
  const doctors = staff.filter((s) => s.role === "dentist")

  if (!appointment || !patient) return null

  const statusColors: Record<string, string> = {
    scheduled: "bg-blue-100 text-blue-700",
    confirmed: "bg-green-100 text-green-700",
    "in-progress": "bg-amber-100 text-amber-700",
    completed: "bg-gray-100 text-gray-600",
    cancelled: "bg-red-100 text-red-700",
    "no-show": "bg-purple-100 text-purple-700",
  }

  if (isEditing) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
        <div className="w-full max-w-lg rounded-2xl bg-background p-6 neu-card max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Edit Appointment</h2>
            <button
              onClick={() => setIsEditing(false)}
              className="rounded-xl p-2 text-muted-foreground hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" defaultValue={appointment.date} className="rounded-xl neu-pressed border-0" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input type="time" defaultValue={appointment.startTime} className="rounded-xl neu-pressed border-0" />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input type="time" defaultValue={appointment.endTime} className="rounded-xl neu-pressed border-0" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Doctor</Label>
              <Select defaultValue={appointment.dentistId}>
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
              <Select defaultValue={appointment.roomId}>
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
              <Select defaultValue={appointment.status}>
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
                defaultValue={appointment.notes || ""}
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
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-background p-6 neu-card max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Appointment Details</h2>
            <span
              className={cn(
                "inline-block mt-2 rounded-full px-3 py-1 text-xs font-medium capitalize",
                statusColors[appointment.status],
              )}
            >
              {appointment.status.replace("-", " ")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-xl p-2 text-muted-foreground hover:bg-muted transition-colors"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded-xl p-2 text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button onClick={onClose} className="rounded-xl p-2 text-muted-foreground hover:bg-muted transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Patient Info */}
        <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-lg font-semibold text-primary-foreground">
            {patient.firstName[0]}
            {patient.lastName[0]}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground">
              {patient.firstName} {patient.lastName}
            </p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {patient.phone}
              </span>
            </div>
          </div>
          <Link href={`/patients/${patient.id}`}>
            <Button variant="ghost" size="sm" className="rounded-xl text-primary">
              View
            </Button>
          </Link>
        </div>

        {/* Allergies Warning */}
        {patient.allergies.length > 0 && (
          <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3 mb-4">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">Patient Allergies</p>
              <p className="text-sm text-amber-700">{patient.allergies.join(", ")}</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium text-foreground">{appointment.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-medium text-foreground">
                  {appointment.startTime} - {appointment.endTime} ({appointment.duration} min)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Stethoscope className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Treatment</p>
                <p className="font-medium text-foreground">{appointment.treatmentType}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Doctor</p>
                <p className="font-medium text-foreground">{appointment.dentistName}</p>
              </div>
            </div>
          </div>

          {/* Room Info */}
          {room && (
            <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Room & Chair</p>
                <p className="font-medium text-foreground">
                  {room.name} - Chair #{room.chairNumber} (Floor {room.floor})
                </p>
                <p className="text-xs text-muted-foreground mt-1">Equipment: {room.equipment.join(", ")}</p>
              </div>
            </div>
          )}

          {appointment.notes && (
            <div className="rounded-xl bg-muted/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-foreground">Notes</p>
              </div>
              <p className="text-sm text-muted-foreground">{appointment.notes}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          {appointment.status === "scheduled" && (
            <>
              <Button className="flex-1 rounded-xl neu-button bg-green-600 text-white hover:bg-green-700">
                Confirm
              </Button>
              <Button
                variant="outline"
                className="flex-1 rounded-xl neu-button border-0 bg-amber-100 text-amber-700 hover:bg-amber-200"
              >
                Reschedule
              </Button>
            </>
          )}
          {appointment.status === "confirmed" && (
            <Button className="flex-1 rounded-xl neu-button bg-primary text-primary-foreground">
              Start Appointment
            </Button>
          )}
          {appointment.status === "in-progress" && (
            <Button className="flex-1 rounded-xl neu-button bg-green-600 text-white hover:bg-green-700">
              Mark Complete
            </Button>
          )}
          <Button variant="outline" className="rounded-xl neu-button border-0 bg-transparent" onClick={onClose}>
            Close
          </Button>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/90 rounded-2xl">
            <div className="text-center p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mx-auto mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Delete Appointment?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This action cannot be undone. The appointment will be permanently removed.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl bg-transparent"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1 rounded-xl bg-red-600 text-white hover:bg-red-700">Delete</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
