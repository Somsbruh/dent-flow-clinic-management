"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Search, DoorOpen } from "lucide-react"
import Link from "next/link"
import { patients, staff, treatmentTypes, dentalRooms } from "@/lib/data"

export default function NewAppointmentPage() {
  const searchParams = useSearchParams()
  const preselectedPatient = searchParams.get("patient") || ""

  const [selectedPatient, setSelectedPatient] = useState(preselectedPatient)
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [selectedTreatment, setSelectedTreatment] = useState("")
  const [selectedRoom, setSelectedRoom] = useState("") // Added room selection
  const [patientSearch, setPatientSearch] = useState("")

  const filteredPatients = patients.filter(
    (p) =>
      p.firstName.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.lastName.toLowerCase().includes(patientSearch.toLowerCase()),
  )

  const doctors = staff.filter((s) => s.role === "dentist")
  const availableRooms = dentalRooms.filter((r) => r.status !== "maintenance") // Filter available rooms

  const selectedTreatmentData = treatmentTypes.find((t) => t.id === selectedTreatment)
  const selectedRoomData = dentalRooms.find((r) => r.id === selectedRoom) // Get selected room data

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 pl-64">
        <Header />
        <main className="p-6">
          {/* Back Button */}
          <Link
            href="/appointments"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Appointments
          </Link>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">New Appointment</h1>
            <p className="mt-1 text-muted-foreground">Schedule a new patient appointment</p>
          </div>

          <form className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Patient Selection */}
              <div className="rounded-2xl bg-background p-6 neu-card">
                <h2 className="text-lg font-semibold text-foreground mb-6">Select Patient</h2>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search patients..."
                      value={patientSearch}
                      onChange={(e) => setPatientSearch(e.target.value)}
                      className="pl-10 rounded-xl neu-input border-0"
                    />
                  </div>
                  <div className="max-h-[300px] overflow-y-auto space-y-2">
                    {filteredPatients.map((patient) => (
                      <button
                        key={patient.id}
                        type="button"
                        onClick={() => setSelectedPatient(patient.id)}
                        className={`w-full rounded-xl p-3 text-left transition-all ${
                          selectedPatient === patient.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 hover:bg-muted"
                        }`}
                      >
                        <p className="font-medium">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p
                          className={`text-sm ${selectedPatient === patient.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                        >
                          {patient.phone} - {patient.email}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="rounded-2xl bg-background p-6 neu-card">
                <h2 className="text-lg font-semibold text-foreground mb-6">Appointment Details</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor">Doctor</Label>
                    <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                      <SelectTrigger className="rounded-xl neu-button border-0">
                        <SelectValue placeholder="Select a doctor" />
                      </SelectTrigger>
                      <SelectContent className="neu-card">
                        {doctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="treatment">Treatment Type</Label>
                    <Select value={selectedTreatment} onValueChange={setSelectedTreatment}>
                      <SelectTrigger className="rounded-xl neu-button border-0">
                        <SelectValue placeholder="Select treatment" />
                      </SelectTrigger>
                      <SelectContent className="neu-card">
                        {treatmentTypes.map((treatment) => (
                          <SelectItem key={treatment.id} value={treatment.id}>
                            {treatment.name} ({treatment.duration} min)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="room">Dental Room / Chair</Label>
                    <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                      <SelectTrigger className="rounded-xl neu-button border-0">
                        <SelectValue placeholder="Select room" />
                      </SelectTrigger>
                      <SelectContent className="neu-card">
                        {availableRooms.map((room) => (
                          <SelectItem key={room.id} value={room.id}>
                            <div className="flex items-center gap-2">
                              <DoorOpen className="h-4 w-4" />
                              {room.name} - Chair #{room.chairNumber} (Floor {room.floor})
                              {room.status === "occupied" && (
                                <span className="text-xs text-amber-600">(Currently Occupied)</span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" type="date" className="rounded-xl neu-input border-0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input id="time" type="time" className="rounded-xl neu-input border-0" />
                    </div>
                  </div>

                  {(selectedTreatmentData || selectedRoomData) && (
                    <div className="rounded-xl bg-primary/5 p-4 space-y-3">
                      {selectedTreatmentData && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Estimated Duration</span>
                            <span className="font-semibold text-foreground">
                              {selectedTreatmentData.duration} minutes
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Base Price</span>
                            <span className="font-semibold text-foreground">${selectedTreatmentData.basePrice}</span>
                          </div>
                        </>
                      )}
                      {selectedRoomData && (
                        <>
                          <div className="border-t border-border pt-3">
                            <p className="text-sm font-medium text-foreground mb-2">Room Equipment:</p>
                            <div className="flex flex-wrap gap-1">
                              {selectedRoomData.equipment.map((eq, idx) => (
                                <span key={idx} className="text-xs bg-muted px-2 py-1 rounded-full">
                                  {eq}
                                </span>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any notes or special instructions..."
                      className="rounded-xl neu-input border-0 min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Link href="/appointments">
                <Button variant="outline" className="rounded-xl neu-button border-0 bg-transparent">
                  Cancel
                </Button>
              </Link>
              <Button className="rounded-xl neu-button bg-primary text-primary-foreground">
                <Save className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
