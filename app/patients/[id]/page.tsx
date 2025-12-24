"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  AlertCircle,
  Edit,
  Camera,
  Save,
  X,
  ImageIcon,
  ClipboardList,
} from "lucide-react"
import Link from "next/link"
import { patients } from "@/lib/data"
import { PatientOverview } from "@/components/patients/patient-overview"
import { PatientTreatments } from "@/components/patients/patient-treatments"
import { PatientAppointments } from "@/components/patients/patient-appointments"
import { ToothChart } from "@/components/patients/tooth-chart"
import { ClinicalNotes } from "@/components/patients/clinical-notes"
import { DentalImaging } from "@/components/patients/dental-imaging"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default async function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const patient = patients.find((p) => p.id === id)

  return <PatientDetailClientWrapper patient={patient} />
}

function PatientDetailClientWrapper({ patient }: { patient: (typeof patients)[0] | undefined }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(patient?.profileImage || null)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!patient) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Patient not found</h1>
          <Link href="/patients">
            <Button className="mt-4">Back to Patients</Button>
          </Link>
        </div>
      </div>
    )
  }

  const initials = `${patient.firstName[0]}${patient.lastName[0]}`

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setProfileImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
      <div className="flex-1 lg:ml-[240px]">
        <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <main className="p-4 md:p-6">
          {/* Back Button */}
          <Link
            href="/patients"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Patients
          </Link>

          {/* Patient Header */}
          <div className="mb-6 md:mb-8 rounded-2xl bg-background p-4 md:p-6 neu-card">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <div className="relative group mx-auto sm:mx-0">
                  {profileImage ? (
                    <div className="relative">
                      <img
                        src={profileImage || "/placeholder.svg"}
                        alt={`${patient.firstName} ${patient.lastName}`}
                        className="h-24 w-24 rounded-2xl object-cover neu-button"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary text-3xl font-bold text-primary-foreground neu-button">
                      {initials}
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="profile-upload"
                  />
                  <label
                    htmlFor="profile-upload"
                    className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                  </label>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-xl md:text-2xl font-bold text-foreground">
                    {patient.firstName} {patient.lastName}
                  </h1>
                  <p className="text-sm md:text-base text-muted-foreground">Patient ID: {patient.id}</p>
                  <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <span className="flex items-center justify-center sm:justify-start gap-1 text-xs md:text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {patient.email}
                    </span>
                    <span className="flex items-center justify-center sm:justify-start gap-1 text-xs md:text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {patient.phone}
                    </span>
                    <span className="flex items-center justify-center sm:justify-start gap-1 text-xs md:text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate max-w-[200px]">{patient.address}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="rounded-xl neu-button border-0 bg-transparent">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="neu-card max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Patient Profile</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-firstName">First Name</Label>
                          <Input id="edit-firstName" defaultValue={patient.firstName} className="neu-input" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-lastName">Last Name</Label>
                          <Input id="edit-lastName" defaultValue={patient.lastName} className="neu-input" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-email">Email</Label>
                          <Input id="edit-email" type="email" defaultValue={patient.email} className="neu-input" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-phone">Phone</Label>
                          <Input id="edit-phone" defaultValue={patient.phone} className="neu-input" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-address">Address</Label>
                        <Input id="edit-address" defaultValue={patient.address} className="neu-input" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-emergency">Emergency Contact</Label>
                          <Input id="edit-emergency" defaultValue={patient.emergencyContact} className="neu-input" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-emergencyPhone">Emergency Phone</Label>
                          <Input id="edit-emergencyPhone" defaultValue={patient.emergencyPhone} className="neu-input" />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditingProfile(false)}
                        className="neu-button border-0"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => setIsEditingProfile(false)}
                        className="neu-button bg-primary text-primary-foreground"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Link href={`/appointments/new?patient=${patient.id}`}>
                  <Button className="rounded-xl neu-button bg-primary text-primary-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Appointment
                  </Button>
                </Link>
              </div>
            </div>

            {/* Alerts */}
            {(patient.allergies.length > 0 || patient.medicalConditions.length > 0) && (
              <div className="mt-6 flex flex-wrap gap-4">
                {patient.allergies.length > 0 && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-700">Allergies: {patient.allergies.join(", ")}</span>
                  </div>
                )}
                {patient.medicalConditions.length > 0 && (
                  <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2">
                    <FileText className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-700">
                      Conditions: {patient.medicalConditions.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tabs - Updated with new Clinical Notes and Imaging tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="rounded-xl bg-background p-1 neu-pressed flex overflow-x-auto h-auto gap-1 w-full">
              <TabsTrigger
                value="overview"
                className="rounded-lg data-[state=active]:neu-button data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="treatments"
                className="rounded-lg data-[state=active]:neu-button data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Treatment Plan
              </TabsTrigger>
              <TabsTrigger
                value="tooth-chart"
                className="rounded-lg data-[state=active]:neu-button data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Tooth Chart
              </TabsTrigger>
              <TabsTrigger
                value="clinical-notes"
                className="rounded-lg data-[state=active]:neu-button data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <ClipboardList className="mr-1.5 h-4 w-4" />
                Clinical Notes
              </TabsTrigger>
              <TabsTrigger
                value="imaging"
                className="rounded-lg data-[state=active]:neu-button data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <ImageIcon className="mr-1.5 h-4 w-4" />
                Images & X-Rays
              </TabsTrigger>
              <TabsTrigger
                value="appointments"
                className="rounded-lg data-[state=active]:neu-button data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Appointments
              </TabsTrigger>
              <TabsTrigger
                value="billing"
                className="rounded-lg data-[state=active]:neu-button data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Billing
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <PatientOverview patient={patient} />
            </TabsContent>
            <TabsContent value="treatments">
              <PatientTreatments patientId={patient.id} />
            </TabsContent>
            <TabsContent value="tooth-chart">
              <ToothChart patientId={patient.id} />
            </TabsContent>
            <TabsContent value="clinical-notes">
              <ClinicalNotes patientId={patient.id} />
            </TabsContent>
            <TabsContent value="imaging">
              <DentalImaging patientId={patient.id} />
            </TabsContent>
            <TabsContent value="appointments">
              <PatientAppointments patientId={patient.id} />
            </TabsContent>
            <TabsContent value="billing">
              <div className="rounded-2xl bg-background p-6 neu-card">
                <h2 className="text-lg font-semibold text-foreground mb-4">Billing History</h2>
                <p className="text-muted-foreground">Billing records will be displayed here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
