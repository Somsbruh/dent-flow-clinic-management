"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Check,
  Clock,
  Upload,
  FileText,
  ImageIcon,
  File,
  Trash2,
  ChevronDown,
  Phone,
  Mail,
  ArrowRight,
  UserPlus,
  Calendar,
  X,
} from "lucide-react"
import { patients } from "@/lib/data"
import { useStore } from "@/lib/store"

interface AddToWaitlistModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date
  selectedTime?: string
  selectedEndTime?: string // Added end time prop
  selectedDentistId?: string
}

interface UploadedFile {
  id: string
  name: string
  size: string
  type: "doc" | "image" | "pdf"
  progress: number
  status: "uploading" | "completed"
}

interface Treatment {
  id: string
  name: string
  duration: string
  price: string
}

interface Dentist {
  id: string
  name: string
  avatar: string
  todayAppointments: number
}

interface Patient {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  dateOfBirth: string
  gender: "male" | "female"
  address: string
}

const popularTreatments: Treatment[] = [
  { id: "T001", name: "Tooth Scaling", duration: "± 1 hour(s)", price: "$750" },
  { id: "T002", name: "Tooth Extraction", duration: "± 1.5 hour(s)", price: "$300" },
  { id: "T003", name: "Tooth Braces (Metal)", duration: "± 2 hour(s)", price: "$3,000" },
]

const allTreatments: Treatment[] = [
  ...popularTreatments,
  { id: "T004", name: "General Checkup", duration: "± 30 min", price: "$100" },
  { id: "T005", name: "Dental Filling", duration: "± 45 min", price: "$150" },
  { id: "T006", name: "Root Canal", duration: "± 2 hours", price: "$800" },
  { id: "T007", name: "Teeth Whitening", duration: "± 1 hour", price: "$400" },
  { id: "T008", name: "Bleaching", duration: "± 1 hour", price: "$350" },
]

const dentistsList: Dentist[] = [
  { id: "D001", name: "Drg Soap Mactavish", avatar: "/placeholder.svg?height=40&width=40", todayAppointments: 4 },
  { id: "D002", name: "Drg Cipeng", avatar: "/placeholder.svg?height=40&width=40", todayAppointments: 1 },
  { id: "D003", name: "Drg Putri Larasati", avatar: "/placeholder.svg?height=40&width=40", todayAppointments: 0 },
]

const formatTimeForDisplay = (time: string) => {
  if (!time) return ""
  const [hours, minutes] = time.split(":")
  const hour = Number.parseInt(hours)
  const ampm = hour >= 12 ? "pm" : "am"
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${displayHour.toString().padStart(2, "0")}:${minutes} ${ampm}`
}

export function AddToWaitlistModal({
  isOpen,
  onClose,
  selectedDate,
  selectedTime,
  selectedEndTime,
  selectedDentistId,
}: AddToWaitlistModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const store = useStore()

  // Step 1 state
  const [selectedTreatment, setSelectedTreatment] = useState<string>("")
  const [selectedDentist, setSelectedDentist] = useState<string>(selectedDentistId || "")
  const [appointmentDate, setAppointmentDate] = useState(selectedDate)
  const [startTime, setStartTime] = useState(selectedTime ? formatTimeForDisplay(selectedTime) : "02:00 pm")
  const [endTime, setEndTime] = useState(selectedEndTime ? formatTimeForDisplay(selectedEndTime) : "03:00 pm")
  const [quickNote, setQuickNote] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  useEffect(() => {
    if (selectedTime) {
      setStartTime(formatTimeForDisplay(selectedTime))
    }
    if (selectedEndTime) {
      setEndTime(formatTimeForDisplay(selectedEndTime))
    }
    if (selectedDentistId) {
      setSelectedDentist(selectedDentistId)
    }
    setAppointmentDate(selectedDate)
  }, [selectedTime, selectedEndTime, selectedDentistId, selectedDate])

  // Step 2 state
  const [patientSearch, setPatientSearch] = useState("")
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)
  const [showPatientDropdown, setShowPatientDropdown] = useState(false)
  const [isCreatingNewPatient, setIsCreatingNewPatient] = useState(false)
  const [newPatientData, setNewPatientData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    gender: "" as "male" | "female" | "",
    address: "",
  })

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const fileType = file.type.includes("image") ? "image" : file.type.includes("pdf") ? "pdf" : "doc"

      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        type: fileType,
        progress: 0,
        status: "uploading",
      }

      setUploadedFiles((prev) => [...prev, newFile])

      // Simulate upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 30
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          setUploadedFiles((prev) =>
            prev.map((f) => (f.id === newFile.id ? { ...f, progress: 100, status: "completed" } : f)),
          )
        } else {
          setUploadedFiles((prev) =>
            prev.map((f) => (f.id === newFile.id ? { ...f, progress: Math.round(progress) } : f)),
          )
        }
      }, 200)
    })
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-5 w-5 text-emerald-500" />
      case "pdf":
        return <FileText className="h-5 w-5 text-rose-500" />
      default:
        return <File className="h-5 w-5 text-blue-500" />
    }
  }

  const filteredPatients = patients.filter((p) => {
    if (!patientSearch) return false
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase()
    return fullName.includes(patientSearch.toLowerCase()) || p.email.toLowerCase().includes(patientSearch.toLowerCase())
  })

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId)
    const patient = patients.find((p) => p.id === patientId)
    if (patient) {
      setPatientSearch(`${patient.firstName} ${patient.lastName}`)
    }
    setShowPatientDropdown(false)
    setIsCreatingNewPatient(false)
  }

  const handleCreateNewPatient = () => {
    setIsCreatingNewPatient(true)
    setSelectedPatientId(null)
    setShowPatientDropdown(false)
    // Pre-fill the name from search if it looks like a name
    if (patientSearch && !patientSearch.includes("@")) {
      const nameParts = patientSearch.trim().split(" ")
      if (nameParts.length >= 2) {
        setNewPatientData({
          ...newPatientData,
          firstName: nameParts[0],
          lastName: nameParts.slice(1).join(" "),
        })
      } else if (nameParts.length === 1) {
        setNewPatientData({
          ...newPatientData,
          firstName: nameParts[0],
          lastName: "",
        })
      }
    }
  }

  const handleSave = () => {
    if (isCreatingNewPatient) {
      // Create new patient logic here
      const newPatient: Patient = {
        id: Math.random().toString(36).substr(2, 9),
        ...newPatientData,
      }
      store.addPatient(newPatient)
    }
    // Save waitlist logic here
    onClose()
    // Reset state
    setCurrentStep(1)
    setSelectedTreatment("")
    setSelectedDentist("")
    setQuickNote("")
    setUploadedFiles([])
    setPatientSearch("")
    setSelectedPatientId(null)
    setNewPatientData({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      address: "",
    })
    setIsCreatingNewPatient(false)
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-4 mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                currentStep > step
                  ? "bg-emerald-500 text-white"
                  : currentStep === step
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-400",
              )}
            >
              {currentStep > step ? <Check className="h-5 w-5" /> : step}
            </div>
            <span className="text-xs text-gray-500 mt-2">
              {step === 1 && "STEP 1"}
              {step === 2 && "STEP 2"}
              {step === 3 && "STEP 3"}
            </span>
            <span className="text-xs font-medium text-gray-700">
              {step === 1 && "Treatment & Dentist"}
              {step === 2 && "Basic Information"}
              {step === 3 && "Oral Hygiene habits"}
            </span>
          </div>
          {step < 3 && (
            <div
              className={cn("h-0.5 w-16 mx-2 transition-colors", currentStep > step ? "bg-emerald-500" : "bg-gray-200")}
            />
          )}
        </div>
      ))}
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Treatment Selection */}
      <div>
        <Label className="text-sm text-gray-600 mb-2 block">Treatment</Label>
        <Select value={selectedTreatment} onValueChange={setSelectedTreatment}>
          <SelectTrigger className="w-full rounded-lg border-gray-200">
            <SelectValue placeholder="Select Treatment" />
          </SelectTrigger>
          <SelectContent>
            {allTreatments.map((treatment) => (
              <SelectItem key={treatment.id} value={treatment.id}>
                {treatment.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Popular Treatments */}
      <div>
        <Label className="text-xs text-gray-400 mb-3 block">POPULAR TREATMENTS</Label>
        <div className="space-y-2">
          {popularTreatments.map((treatment) => (
            <button
              key={treatment.id}
              onClick={() => setSelectedTreatment(treatment.id)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-lg border transition-all hover:border-primary/50 hover:bg-primary/5",
                selectedTreatment === treatment.id ? "border-primary bg-primary/5" : "border-gray-200",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-primary rounded-full" />
                <span className="font-medium text-gray-900">{treatment.name}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{treatment.duration}</span>
                <span className="text-gray-400">|</span>
                <span>
                  Start from <span className="font-semibold text-gray-900">{treatment.price}</span>
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Dentist Selection */}
      <div>
        <Label className="text-sm text-gray-600 mb-2 block">Dentist</Label>
        <div className="space-y-2">
          {dentistsList.map((dentist) => (
            <button
              key={dentist.id}
              onClick={() => setSelectedDentist(dentist.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg border transition-all hover:border-primary/50 hover:bg-primary/5",
                selectedDentist === dentist.id ? "border-primary bg-primary/5" : "border-gray-200",
              )}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={dentist.avatar || "/placeholder.svg"} />
                <AvatarFallback>{dentist.name.slice(4, 6)}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="font-semibold text-gray-900">{dentist.name}</p>
                <p className="text-xs text-gray-500">
                  Today's appointment: <span className="text-primary">{dentist.todayAppointments} patient(s)</span>
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-sm text-gray-600 mb-2 block">Date & Time</Label>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg flex-1">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <span className="text-sm text-gray-900">{formatDate(appointmentDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 border border-primary bg-primary/5 rounded-lg">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">{startTime}</span>
              <ChevronDown className="h-4 w-4 text-primary" />
            </div>
            <span className="text-gray-400">to</span>
            <div className="flex items-center gap-2 px-3 py-2 border border-primary bg-primary/5 rounded-lg">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">{endTime}</span>
              <ChevronDown className="h-4 w-4 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Note */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm text-gray-600">
            Quick Note <span className="text-gray-400">(Optional)</span>
          </Label>
          <span className="text-xs text-gray-400">{quickNote.length} / 200</span>
        </div>
        <Textarea
          value={quickNote}
          onChange={(e) => setQuickNote(e.target.value.slice(0, 200))}
          placeholder="Type a message..."
          className="rounded-lg border-gray-200 resize-none"
          rows={3}
        />
      </div>

      {/* File Upload */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm text-gray-600">
            Attached Files <span className="text-gray-400">(Optional)</span>
          </Label>
          <span className="text-xs text-gray-400">{uploadedFiles.length} of 5</span>
        </div>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
        >
          <div className="flex items-center justify-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
              <Upload className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Drag & drop files here</span>
              <span className="text-gray-300 mx-2">|</span>
              <span className="text-primary font-medium">Browse Files</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Maximum upload file sizes : 10MB</p>
        </div>
        <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileUpload} />

        {/* Uploaded files list */}
        {uploadedFiles.length > 0 && (
          <div className="mt-4 space-y-3">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {getFileIcon(file.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{file.size}</p>
                  {file.status === "uploading" && (
                    <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {file.status === "completed" ? (
                    <span className="text-xs text-emerald-600">Completed</span>
                  ) : (
                    <span className="text-xs text-gray-500">{file.progress}%</span>
                  )}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Patient Name Search */}
      <div className="relative">
        <Label className="text-sm text-gray-600 mb-2 block">Patient Name</Label>
        <div className="relative">
          <Input
            value={patientSearch}
            onChange={(e) => {
              setPatientSearch(e.target.value)
              setShowPatientDropdown(true)
              setSelectedPatientId(null)
              setIsCreatingNewPatient(false)
            }}
            onFocus={() => !isCreatingNewPatient && setShowPatientDropdown(true)}
            placeholder="Search patient name..."
            className="rounded-lg border-gray-200 pl-4"
            disabled={isCreatingNewPatient}
          />
          {showPatientDropdown && patientSearch && !isCreatingNewPatient && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {filteredPatients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => handlePatientSelect(patient.id)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {patient.firstName[0]}
                      {patient.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-900">
                    {patient.firstName} {patient.lastName}
                  </span>
                </button>
              ))}
              {filteredPatients.length === 0 && (
                <button
                  onClick={handleCreateNewPatient}
                  className="w-full flex items-center gap-3 p-3 hover:bg-primary/5 transition-colors text-left border-t"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserPlus className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm text-primary font-medium">Create new patient "{patientSearch}"</span>
                </button>
              )}
            </div>
          )}
        </div>
        {isCreatingNewPatient && (
          <button
            onClick={() => {
              setIsCreatingNewPatient(false)
              setPatientSearch("")
              setNewPatientData({
                firstName: "",
                lastName: "",
                phone: "",
                email: "",
                dateOfBirth: "",
                gender: "",
                address: "",
              })
            }}
            className="mt-2 text-sm text-primary hover:underline"
          >
            Search for existing patient instead
          </button>
        )}
      </div>

      {isCreatingNewPatient && (
        <>
          {/* First Name and Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-600 mb-2 block">First Name *</Label>
              <Input
                value={newPatientData.firstName}
                onChange={(e) => setNewPatientData({ ...newPatientData, firstName: e.target.value })}
                placeholder="Enter first name"
                className="rounded-lg border-gray-200"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-600 mb-2 block">Last Name *</Label>
              <Input
                value={newPatientData.lastName}
                onChange={(e) => setNewPatientData({ ...newPatientData, lastName: e.target.value })}
                placeholder="Enter last name"
                className="rounded-lg border-gray-200"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <Label className="text-sm text-gray-600 mb-2 block">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                value={newPatientData.email}
                onChange={(e) => setNewPatientData({ ...newPatientData, email: e.target.value })}
                placeholder="Enter email address"
                className="rounded-lg border-gray-200 pl-10"
              />
            </div>
          </div>

          {/* Date of Birth and Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-600 mb-2 block">Date of Birth</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  value={newPatientData.dateOfBirth}
                  onChange={(e) => setNewPatientData({ ...newPatientData, dateOfBirth: e.target.value })}
                  className="rounded-lg border-gray-200 pl-10"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm text-gray-600 mb-2 block">Gender</Label>
              <Select
                value={newPatientData.gender}
                onValueChange={(value: "male" | "female") => setNewPatientData({ ...newPatientData, gender: value })}
              >
                <SelectTrigger className="rounded-lg border-gray-200">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      )}

      {/* Phone Number - shown for both existing patient selection and new patient */}
      <div>
        <Label className="text-sm text-gray-600 mb-2 block">Phone Number {isCreatingNewPatient && "*"}</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={newPatientData.phone}
            onChange={(e) => setNewPatientData({ ...newPatientData, phone: e.target.value })}
            placeholder="Enter patient phone number"
            className="rounded-lg border-gray-200 pl-10"
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm text-gray-600">Address</Label>
          <span className="text-xs text-gray-400">{newPatientData.address.length} / 200</span>
        </div>
        <Textarea
          value={newPatientData.address}
          onChange={(e) => setNewPatientData({ ...newPatientData, address: e.target.value.slice(0, 200) })}
          placeholder="Type patient address"
          className="rounded-lg border-gray-200 resize-none"
          rows={3}
        />
      </div>
    </div>
  )

  // Step 3 state - Oral Hygiene Habits
  const [oralHygiene, setOralHygiene] = useState({
    lastDentalVisit: "",
    startedDentalCare: "",
    brushingFrequency: "",
    usesMouthwash: "",
    usesDentalFloss: "",
    toothbrushReplacement: "",
    oralHygieneDuration: "",
  })

  const renderStep3 = () => {
    const RadioOption = ({
      name,
      value,
      label,
      selected,
      onChange,
    }: {
      name: string
      value: string
      label: string
      selected: boolean
      onChange: () => void
    }) => (
      <button
        type="button"
        onClick={onChange}
        className={cn(
          "flex-1 px-4 py-3 rounded-lg border text-sm font-medium transition-all",
          selected
            ? "border-primary bg-primary/5 text-primary"
            : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50",
        )}
      >
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-4 w-4 rounded-full border-2 flex items-center justify-center",
              selected ? "border-primary" : "border-gray-300",
            )}
          >
            {selected && <div className="h-2 w-2 rounded-full bg-primary" />}
          </div>
          {label}
        </div>
      </button>
    )

    return (
      <div className="space-y-6">
        {/* Info banner */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700 flex items-center gap-2">
            <span className="text-blue-500">ℹ️</span>
            Oral Hygiene Habits it's optional, you can do it later
          </p>
        </div>

        {/* Question 1 */}
        <div>
          <Label className="text-sm text-gray-700 mb-3 block">1. When did you make the latest dental visit?</Label>
          <div className="grid grid-cols-2 gap-3">
            <RadioOption
              name="lastVisit"
              value="less3months"
              label="Less than 3 months ago"
              selected={oralHygiene.lastDentalVisit === "less3months"}
              onChange={() => setOralHygiene({ ...oralHygiene, lastDentalVisit: "less3months" })}
            />
            <RadioOption
              name="lastVisit"
              value="1year"
              label="1 year ago"
              selected={oralHygiene.lastDentalVisit === "1year"}
              onChange={() => setOralHygiene({ ...oralHygiene, lastDentalVisit: "1year" })}
            />
            <RadioOption
              name="lastVisit"
              value="3months"
              label="Less than 3 months ago"
              selected={oralHygiene.lastDentalVisit === "3months"}
              onChange={() => setOralHygiene({ ...oralHygiene, lastDentalVisit: "3months" })}
            />
            <RadioOption
              name="lastVisit"
              value="dontremember"
              label="I don't remember"
              selected={oralHygiene.lastDentalVisit === "dontremember"}
              onChange={() => setOralHygiene({ ...oralHygiene, lastDentalVisit: "dontremember" })}
            />
          </div>
        </div>

        {/* Question 2 */}
        <div>
          <Label className="text-sm text-gray-700 mb-3 block">2. What time did you start dental care?</Label>
          <div className="grid grid-cols-2 gap-3">
            <RadioOption
              name="startedCare"
              value="teenager"
              label="Teenager"
              selected={oralHygiene.startedDentalCare === "teenager"}
              onChange={() => setOralHygiene({ ...oralHygiene, startedDentalCare: "teenager" })}
            />
            <RadioOption
              name="startedCare"
              value="about30"
              label="About 30 years old"
              selected={oralHygiene.startedDentalCare === "about30"}
              onChange={() => setOralHygiene({ ...oralHygiene, startedDentalCare: "about30" })}
            />
            <RadioOption
              name="startedCare"
              value="about20"
              label="About 20 years old"
              selected={oralHygiene.startedDentalCare === "about20"}
              onChange={() => setOralHygiene({ ...oralHygiene, startedDentalCare: "about20" })}
            />
            <RadioOption
              name="startedCare"
              value="after30"
              label="After 30 years old"
              selected={oralHygiene.startedDentalCare === "after30"}
              onChange={() => setOralHygiene({ ...oralHygiene, startedDentalCare: "after30" })}
            />
          </div>
        </div>

        {/* Question 3 */}
        <div>
          <Label className="text-sm text-gray-700 mb-3 block">
            3. How many times, in a day, do you wash your teeth?
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <RadioOption
              name="brushing"
              value="never"
              label="Never"
              selected={oralHygiene.brushingFrequency === "never"}
              onChange={() => setOralHygiene({ ...oralHygiene, brushingFrequency: "never" })}
            />
            <RadioOption
              name="brushing"
              value="twice"
              label="Twice"
              selected={oralHygiene.brushingFrequency === "twice"}
              onChange={() => setOralHygiene({ ...oralHygiene, brushingFrequency: "twice" })}
            />
            <RadioOption
              name="brushing"
              value="once"
              label="Once"
              selected={oralHygiene.brushingFrequency === "once"}
              onChange={() => setOralHygiene({ ...oralHygiene, brushingFrequency: "once" })}
            />
            <RadioOption
              name="brushing"
              value="3times"
              label="3 times"
              selected={oralHygiene.brushingFrequency === "3times"}
              onChange={() => setOralHygiene({ ...oralHygiene, brushingFrequency: "3times" })}
            />
          </div>
        </div>

        {/* Question 4 */}
        <div>
          <Label className="text-sm text-gray-700 mb-3 block">4. Do you use mouthwash?</Label>
          <div className="grid grid-cols-2 gap-3">
            <RadioOption
              name="mouthwash"
              value="yes"
              label="Yes"
              selected={oralHygiene.usesMouthwash === "yes"}
              onChange={() => setOralHygiene({ ...oralHygiene, usesMouthwash: "yes" })}
            />
            <RadioOption
              name="mouthwash"
              value="no"
              label="No"
              selected={oralHygiene.usesMouthwash === "no"}
              onChange={() => setOralHygiene({ ...oralHygiene, usesMouthwash: "no" })}
            />
          </div>
        </div>

        {/* Question 5 */}
        <div>
          <Label className="text-sm text-gray-700 mb-3 block">5. Do you use dental floss?</Label>
          <div className="grid grid-cols-2 gap-3">
            <RadioOption
              name="floss"
              value="yes"
              label="Yes"
              selected={oralHygiene.usesDentalFloss === "yes"}
              onChange={() => setOralHygiene({ ...oralHygiene, usesDentalFloss: "yes" })}
            />
            <RadioOption
              name="floss"
              value="no"
              label="No"
              selected={oralHygiene.usesDentalFloss === "no"}
              onChange={() => setOralHygiene({ ...oralHygiene, usesDentalFloss: "no" })}
            />
          </div>
        </div>

        {/* Question 6 */}
        <div>
          <Label className="text-sm text-gray-700 mb-3 block">6. How often do you change your toothbrush?</Label>
          <div className="grid grid-cols-2 gap-3">
            <RadioOption
              name="toothbrush"
              value="3months"
              label="Every 3 months"
              selected={oralHygiene.toothbrushReplacement === "3months"}
              onChange={() => setOralHygiene({ ...oralHygiene, toothbrushReplacement: "3months" })}
            />
            <RadioOption
              name="toothbrush"
              value="6months"
              label="Every 6 months"
              selected={oralHygiene.toothbrushReplacement === "6months"}
              onChange={() => setOralHygiene({ ...oralHygiene, toothbrushReplacement: "6months" })}
            />
            <RadioOption
              name="toothbrush"
              value="year"
              label="Every year"
              selected={oralHygiene.toothbrushReplacement === "year"}
              onChange={() => setOralHygiene({ ...oralHygiene, toothbrushReplacement: "year" })}
            />
            <RadioOption
              name="toothbrush"
              value="asoccur"
              label="As occur"
              selected={oralHygiene.toothbrushReplacement === "asoccur"}
              onChange={() => setOralHygiene({ ...oralHygiene, toothbrushReplacement: "asoccur" })}
            />
          </div>
        </div>

        {/* Question 7 */}
        <div>
          <Label className="text-sm text-gray-700 mb-3 block">7. How long do you take for oral hygiene</Label>
          <div className="grid grid-cols-2 gap-3">
            <RadioOption
              name="duration"
              value="1min"
              label="Every 1 minute"
              selected={oralHygiene.oralHygieneDuration === "1min"}
              onChange={() => setOralHygiene({ ...oralHygiene, oralHygieneDuration: "1min" })}
            />
            <RadioOption
              name="duration"
              value="2min"
              label="About 2 minute"
              selected={oralHygiene.oralHygieneDuration === "2min"}
              onChange={() => setOralHygiene({ ...oralHygiene, oralHygieneDuration: "2min" })}
            />
            <RadioOption
              name="duration"
              value="more2min"
              label="More than 2 minutes"
              selected={oralHygiene.oralHygieneDuration === "more2min"}
              onChange={() => setOralHygiene({ ...oralHygiene, oralHygieneDuration: "more2min" })}
            />
            <RadioOption
              name="duration"
              value="dontknow"
              label="I don't know"
              selected={oralHygiene.oralHygieneDuration === "dontknow"}
              onChange={() => setOralHygiene({ ...oralHygiene, oralHygieneDuration: "dontknow" })}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-hidden flex flex-col p-0 [&>button]:hidden">
        {/* Header - removed duplicate X button, DialogContent's close button is hidden via CSS */}
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-xl font-semibold text-gray-900">Add patient to waitlist</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="px-6 pt-6">{renderStepIndicator()}</div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 pt-4 border-t border-gray-100">
          <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            Cancel
          </Button>
          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handlePrevious} className="border-gray-300 bg-transparent">
                Previous
              </Button>
            )}
            {currentStep < 3 ? (
              <Button onClick={handleNext} className="bg-primary hover:bg-primary/90 text-white gap-2">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-white">
                Save
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
