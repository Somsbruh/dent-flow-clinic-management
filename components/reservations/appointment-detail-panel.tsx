"use client"

import { useState } from "react"
import { X, Pencil, Bell, FileText, ClipboardCheck, Info } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { MedicalCheckupModal } from "./medical-checkup-modal"

interface AppointmentDetailPanelProps {
  isOpen: boolean
  onClose: () => void
  appointment: {
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
  } | null
  onStatusChange?: (appointmentId: string, newStatus: string) => void
  onExtendTime?: (appointmentId: string) => void
  onSendReminder?: (appointmentId: string) => void
  onAddMedicalRecord?: (appointmentId: string) => void
  onFinish?: (appointmentId: string) => void
}

export function AppointmentDetailPanel({
  isOpen,
  onClose,
  appointment,
  onStatusChange,
  onExtendTime,
  onSendReminder,
  onAddMedicalRecord,
  onFinish,
}: AppointmentDetailPanelProps) {
  const [status, setStatus] = useState(appointment?.status || "registered")
  const [medicalCheckupDone, setMedicalCheckupDone] = useState(appointment?.medicalCheckupDone || false)
  const [showMedicalCheckup, setShowMedicalCheckup] = useState(false)

  if (!isOpen || !appointment) return null

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const suffix = hour < 12 ? "AM" : "PM"
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minutes} ${suffix}`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "finished":
        return "bg-emerald-500"
      case "doing-treatment":
        return "bg-amber-500"
      case "registered":
        return "bg-blue-500"
      case "waiting-payment":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus as typeof status)
    onStatusChange?.(appointment.id, newStatus)
  }

  const handleMedicalCheckupComplete = (data: any) => {
    setMedicalCheckupDone(true)
    setShowMedicalCheckup(false)
  }

  const canFinish = medicalCheckupDone && appointment.medicalRecordAdded

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">Reservation ID</span>
                <span className="font-bold text-gray-900">#{appointment.id}</span>
                {appointment.isManual && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 border-gray-300 text-gray-500">
                    MANUAL APPOINTMENT
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
              <Pencil className="h-4 w-4 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={onClose}>
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Patient Info */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg?height=48&width=48" />
                <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">
                  {getInitials(appointment.patientName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs text-gray-500">Patient name</p>
                <p className="font-semibold text-gray-900">{appointment.patientName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Change Status</span>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[140px] h-8 text-xs rounded-lg">
                  <div className="flex items-center gap-1.5">
                    <span className={cn("h-2 w-2 rounded-full", getStatusColor(status))} />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="registered">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                      Registered
                    </div>
                  </SelectItem>
                  <SelectItem value="doing-treatment">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      Encounter
                    </div>
                  </SelectItem>
                  <SelectItem value="waiting-payment">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-orange-500" />
                      Waiting Payment
                    </div>
                  </SelectItem>
                  <SelectItem value="finished">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Finished
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Info Banner */}
          <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-amber-600" />
              <span className="text-sm text-amber-800">
                Time slot available in the future, you can extend the reservation time
              </span>
            </div>
            <button
              className="text-sm font-medium text-amber-600 hover:text-amber-700"
              onClick={() => onExtendTime?.(appointment.id)}
            >
              Extend time
            </button>
          </div>

          {/* Treatment Details */}
          <div className="grid grid-cols-3 gap-4 py-3">
            <div>
              <p className="text-[10px] uppercase text-gray-400 tracking-wider mb-1">Treatment</p>
              <p className="text-sm font-medium text-gray-900">{appointment.treatment}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-gray-400 tracking-wider mb-1">Date and Time</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(appointment.date)}</p>
              <p className="text-xs text-gray-600">
                {formatTime(appointment.startTime)}-{formatTime(appointment.endTime)}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-gray-400 tracking-wider mb-1">Dentist</p>
              <p className="text-sm font-medium text-gray-900">{appointment.dentistName || "Drg Putri Larasati"}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Payment</span>
              <span className="font-semibold text-gray-900">Bill #{appointment.billId || "10102"}</span>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] px-1.5 py-0 h-5 uppercase font-semibold",
                  appointment.billStatus === "paid"
                    ? "border-emerald-300 text-emerald-600 bg-emerald-50"
                    : "border-rose-300 text-rose-600 bg-rose-50",
                )}
              >
                {appointment.billStatus || "UNPAID"}
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-lg text-xs bg-transparent"
              onClick={() => onSendReminder?.(appointment.id)}
            >
              <Bell className="h-3.5 w-3.5 mr-1.5" />
              Send Reminder
            </Button>
          </div>

          {/* General Info */}
          <div className="py-3 border-t border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">General info</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase text-gray-400 tracking-wider mb-1">Full Name</p>
                <p className="text-sm font-medium text-gray-900">{appointment.patientName}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-gray-400 tracking-wider mb-1">Phone Number</p>
                <p className="text-sm font-medium text-gray-900">{appointment.patientPhone || "+1 (409)-832-3913"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-gray-400 tracking-wider mb-1">Age</p>
                <p className="text-sm font-medium text-gray-900">{appointment.patientAge || 24}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-gray-400 tracking-wider mb-1">Email</p>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {appointment.patientEmail || "patient@mail.com"}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-gray-400 tracking-wider mb-1">Gender</p>
                <p className="text-sm font-medium text-gray-900">{appointment.patientGender || "Male"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-gray-400 tracking-wider mb-1">Address</p>
                <p className="text-sm font-medium text-gray-900 line-clamp-2">
                  {appointment.patientAddress || "4337 Lynn Ogden Lane, Beaumont, TX 77701"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 space-y-3">
          <div className="flex gap-3">
            <Button
              variant={medicalCheckupDone ? "default" : "outline"}
              className={cn(
                "flex-1 h-11 rounded-xl text-sm font-medium",
                medicalCheckupDone
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                  : "border-emerald-300 text-emerald-600 hover:bg-emerald-50",
              )}
              onClick={() => setShowMedicalCheckup(true)}
            >
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Edit Medical Checkup
              {medicalCheckupDone && (
                <span className="ml-2 h-5 w-5 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </Button>
            <Button
              variant="outline"
              className={cn(
                "flex-1 h-11 rounded-xl text-sm font-medium",
                appointment.medicalRecordAdded
                  ? "border-emerald-300 bg-emerald-50 text-emerald-600"
                  : "border-gray-300 text-gray-700",
              )}
              onClick={() => onAddMedicalRecord?.(appointment.id)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Add Medical Record
            </Button>
          </div>

          <Button
            disabled={!canFinish}
            className={cn(
              "w-full h-11 rounded-xl text-sm font-medium",
              canFinish ? "bg-primary hover:bg-primary/90 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed",
            )}
            onClick={() => canFinish && onFinish?.(appointment.id)}
          >
            Finish
          </Button>

          {!canFinish && (
            <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
              <Info className="h-3.5 w-3.5" />
              Please add Medical checkup & Medical record to finish treatment
            </p>
          )}
        </div>
      </div>

      {/* Medical Checkup Modal */}
      <MedicalCheckupModal
        isOpen={showMedicalCheckup}
        onClose={() => setShowMedicalCheckup(false)}
        appointmentId={appointment.id}
        patientName={appointment.patientName}
        onComplete={handleMedicalCheckupComplete}
      />
    </>
  )
}
