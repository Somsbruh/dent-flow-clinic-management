"use client"

import { useState } from "react"
import { Stethoscope, Camera, HeartPulse, FileCheck, ChevronRight, Smile, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InteractiveToothChart } from "@/components/shared/interactive-tooth-chart"
import { ToothData, TOOTH_NAMES, CONDITIONS } from "@/lib/tooth-types"

interface MedicalCheckupModalProps {
  isOpen: boolean
  onClose: () => void
  appointmentId: string
  patientName?: string
  onComplete?: (data: MedicalCheckupData) => void
}

// ToothData type is imported from @/lib/tooth-types

interface ToothHistoryEntry {
  date: string
  condition: string
  treatment: string
  dentist: string
  status: "done" | "pending"
  note: string
  reason?: string
}

interface MedicalCheckupData {
  bloodPressureMm: string
  bloodPressureHg: string
  sicknesses: string[]
  allergies: string[]
  otherAllergies: string
  teethData: Record<number, ToothData>
  oralCheckNotes: string
  agreedToPlan: boolean
  occlusi: string
  torusPalatinus: string
  torusMandibularis: string
  palatum: string
  diastema: boolean
  diastemaNotes: string
}

const SICKNESSES = ["Heart Disease", "Covid-19", "Haemophilia", "Hepatitis", "Gastring", "Other Disease"]
const ALLERGIES = ["Penicillin", "Aspirin", "Latex", "Local Anesthesia", "Ibuprofen", "Other"]

// CONDITIONS is imported from @/lib/tooth-types
// TREATMENTS is now defined locally since the shared one has different structure
const TREATMENTS = [
  { code: "multi", label: "Teeth Whitening", type: "multi" },
  { code: "single", label: "Teeth Cleaning", type: "single" },
  { code: "single", label: "Tooth Fillings", type: "single" },
  { code: "multi", label: "Tooth Extraction", type: "multi" },
  { code: "single", label: "Crowns", type: "single" },
  { code: "multi", label: "Tooth Scaling", type: "multi" },
  { code: "single", label: "Replace tooth", type: "single" },
]

// TOOTH_NAMES is imported from @/lib/tooth-types

const steps = [
  { id: 1, name: "Medical data", icon: Stethoscope },
  { id: 2, name: "Treatment Plan", icon: Camera },
  { id: 3, name: "Oral Check", icon: HeartPulse },
  { id: 4, name: "Plan Agreement", icon: FileCheck },
]

export function MedicalCheckupModal({
  isOpen,
  onClose,
  appointmentId,
  patientName,
  onComplete,
}: MedicalCheckupModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null)
  const [showToothHistory, setShowToothHistory] = useState(false)
  const [toothPopup, setToothPopup] = useState<{ tooth: number; isEditing: boolean } | null>(null)

  const [formData, setFormData] = useState<MedicalCheckupData>({
    bloodPressureMm: "",
    bloodPressureHg: "",
    sicknesses: ["Heart Disease", "Hepatitis"],
    allergies: [],
    otherAllergies: "",
    teethData: {
      // Sample data for teeth with existing treatments
      21: { status: "hasTreatment", condition: "car", treatment: "Tooth Fillings" },
      22: {
        status: "hasTreatment",
        condition: "nvt",
        treatment: "Replace tooth",
        note: "Sick tooth, so we can filling this tooth for repair",
        history: [
          {
            date: "JUN 28",
            condition: "Caries",
            treatment: "Tooth filling",
            dentist: "Drg Soap Mactavish",
            status: "done",
            note: "Teeth have cavities, so we can filling this tooth for repair",
          },
          {
            date: "APR 15",
            condition: "Caries",
            treatment: "Tooth filling",
            dentist: "Drg Soap Mactavish",
            status: "pending",
            note: "Teeth have cavities, so we can filling this tooth for repair",
            reason: "Patient not aggree",
          },
        ],
      },
      34: {
        status: "recommended",
        condition: "car",
        treatment: "Tooth Fillings",
        note: "Sick tooth, so we can filling this tooth for repair",
      },
      35: { status: "recommended" },
    },
    oralCheckNotes: "",
    agreedToPlan: false,
    occlusi: "Normal Bite",
    torusPalatinus: "No",
    torusMandibularis: "No",
    palatum: "No",
    diastema: false,
    diastemaNotes: "",
  })

  // Temporary state for tooth popup editing
  const [tempToothData, setTempToothData] = useState<ToothData>({})

  const handleSicknessToggle = (sickness: string) => {
    setFormData((prev) => ({
      ...prev,
      sicknesses: prev.sicknesses.includes(sickness)
        ? prev.sicknesses.filter((s) => s !== sickness)
        : [...prev.sicknesses, sickness],
    }))
  }

  const handleAllergyToggle = (allergy: string) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter((a) => a !== allergy)
        : [...prev.allergies, allergy],
    }))
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1)
    } else {
      onComplete?.(formData)
      onClose()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleClose = () => {
    setCurrentStep(1)
    setSelectedTooth(null)
    setToothPopup(null)
    setShowToothHistory(false)
    onClose()
  }

  const handleToothClick = (toothId: number) => {
    const existingData = formData.teethData[toothId]
    if (existingData && existingData.condition && !toothPopup) {
      // Show existing tooth info
      setSelectedTooth(toothId)
      setToothPopup({ tooth: toothId, isEditing: false })
      setTempToothData({ ...existingData })
    } else if (!toothPopup) {
      // New tooth - show edit form
      setSelectedTooth(toothId)
      setToothPopup({ tooth: toothId, isEditing: true })
      setTempToothData({ status: "recent" })
    }
  }

  const handleSaveToothData = () => {
    if (selectedTooth && tempToothData.condition) {
      setFormData((prev) => ({
        ...prev,
        teethData: {
          ...prev.teethData,
          [selectedTooth]: { ...tempToothData, status: tempToothData.status || "recent" },
        },
      }))
    }
    setToothPopup(null)
    setSelectedTooth(null)
    setTempToothData({})
  }

  const handleDeleteToothData = () => {
    if (selectedTooth) {
      setFormData((prev) => {
        const newTeethData = { ...prev.teethData }
        delete newTeethData[selectedTooth]
        return { ...prev, teethData: newTeethData }
      })
    }
    setToothPopup(null)
    setSelectedTooth(null)
    setTempToothData({})
  }

  const handleViewHistory = (toothId: number) => {
    setSelectedTooth(toothId)
    setShowToothHistory(true)
    setToothPopup(null)
  }

  // Dental Arch Chart Component
  const DentalArchChart = () => {
    // Upper teeth positions (based on image layout)
    const toothPositions: Record<number, { x: number; y: number; w: number; h: number }> = {
      // Upper left (18-11)
      18: { x: 8, y: 28, w: 7, h: 8 },
      17: { x: 15, y: 24, w: 7, h: 8 },
      16: { x: 22, y: 20, w: 7, h: 9 },
      15: { x: 29, y: 17, w: 6, h: 8 },
      14: { x: 35, y: 14, w: 6, h: 8 },
      13: { x: 41, y: 10, w: 5, h: 9 },
      12: { x: 46, y: 7, w: 4, h: 8 },
      11: { x: 50, y: 5, w: 4, h: 9 },
      // Upper right (21-28)
      21: { x: 54, y: 5, w: 4, h: 8 },
      22: { x: 58, y: 7, w: 4, h: 8 },
      23: { x: 62, y: 10, w: 5, h: 9 },
      24: { x: 67, y: 14, w: 6, h: 8 },
      25: { x: 73, y: 17, w: 6, h: 8 },
      26: { x: 79, y: 20, w: 7, h: 9 },
      27: { x: 86, y: 24, w: 7, h: 8 },
      28: { x: 93, y: 28, w: 7, h: 8 },
      // Lower left (48-41)
      48: { x: 8, y: 72, w: 7, h: 8 },
      47: { x: 15, y: 68, w: 7, h: 8 },
      46: { x: 22, y: 63, w: 7, h: 9 },
      45: { x: 29, y: 58, w: 6, h: 8 },
      44: { x: 35, y: 53, w: 6, h: 8 },
      43: { x: 41, y: 48, w: 5, h: 8 },
      42: { x: 46, y: 44, w: 4, h: 8 },
      41: { x: 50, y: 42, w: 4, h: 8 },
      // Lower right (31-38)
      31: { x: 54, y: 42, w: 4, h: 8 },
      32: { x: 58, y: 44, w: 4, h: 8 },
      33: { x: 62, y: 48, w: 5, h: 8 },
      34: { x: 67, y: 53, w: 6, h: 8 },
      35: { x: 73, y: 58, w: 6, h: 8 },
      36: { x: 79, y: 63, w: 7, h: 9 },
      37: { x: 86, y: 68, w: 7, h: 8 },
      38: { x: 93, y: 72, w: 7, h: 8 },
    }

    const getToothHighlightColor = (toothId: number) => {
      const data = formData.teethData[toothId]
      if (!data?.status) return "transparent"
      switch (data.status) {
        case "recent":
          return "rgba(239, 68, 68, 0.3)" // red
        case "hasTreatment":
          return "rgba(59, 130, 246, 0.3)" // blue
        case "recommended":
          return "rgba(245, 158, 11, 0.3)" // amber
        default:
          return "transparent"
      }
    }

    return (
      <div className="relative">
        <div className="relative w-full max-w-[320px] mx-auto">
          <img
            src="/images/tooth-chart-new.jpg"
            alt="Dental Arch Chart"
            className="w-full h-auto"
            style={{ filter: "brightness(1.05)" }}
          />

          {/* Clickable overlay areas for each tooth */}
          <div className="absolute inset-0">
            {Object.entries(toothPositions).map(([toothId, pos]) => {
              const id = Number.parseInt(toothId)
              const data = formData.teethData[id]
              const isSelected = selectedTooth === id

              return (
                <button
                  key={id}
                  onClick={() => handleToothClick(id)}
                  className={cn(
                    "absolute rounded-full transition-all duration-300 hover:scale-110",
                    "hover:shadow-[0_0_12px_2px_rgba(59,130,246,0.6)] hover:bg-blue-400/20", // Glow effect
                    isSelected && "ring-2 ring-primary ring-offset-1 shadow-[0_0_12px_2px_rgba(59,130,246,0.6)]",
                  )}
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    width: `${pos.w}%`,
                    height: `${pos.h}%`,
                    backgroundColor: getToothHighlightColor(id),
                  }}
                  title={`${TOOTH_NAMES[id] || "Tooth"} (${id})`}
                />
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-gray-600">Recent findings</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-gray-600">Has treatment before</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-gray-600">Recomended to be treated</span>
          </div>
        </div>
      </div>
    )
  }

  // Tooth Popup Component
  const ToothPopup = () => {
    if (!toothPopup || !selectedTooth) return null

    const toothData = formData.teethData[selectedTooth]
    const toothName = TOOTH_NAMES[selectedTooth] || "Tooth"
    const isEditing = toothPopup.isEditing || !toothData?.condition

    return (
      <div className="absolute right-0 top-0 w-[220px] bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{toothName}</span>
            <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600">
              <svg
                className="w-3 h-3 inline mr-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              </svg>
              {selectedTooth}
            </span>
          </div>
          <button
            onClick={() => {
              setToothPopup(null)
              setSelectedTooth(null)
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isEditing ? (
          // Edit Form
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Select condition</Label>
              <Select
                value={tempToothData.condition || ""}
                onValueChange={(v) => setTempToothData((prev) => ({ ...prev, condition: v }))}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {CONDITIONS.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded font-mono">{c.code}</span>
                        <span>{c.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Select treatment</Label>
              <Select
                value={tempToothData.treatment || ""}
                onValueChange={(v) => setTempToothData((prev) => ({ ...prev, treatment: v }))}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select treatment" />
                </SelectTrigger>
                <SelectContent>
                  {TREATMENTS.map((t, i) => (
                    <SelectItem key={i} value={t.label}>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded font-medium",
                            t.type === "multi" ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700",
                          )}
                        >
                          {t.type}
                        </span>
                        <span>{t.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Input
                placeholder="Note"
                value={tempToothData.note || ""}
                onChange={(e) => setTempToothData((prev) => ({ ...prev, note: e.target.value }))}
                className="h-9 text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleDeleteToothData}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button className="flex-1 h-9" onClick={handleSaveToothData} disabled={!tempToothData.condition}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          // View existing data
          <div className="space-y-3">
            <div>
              <p className="text-[10px] uppercase text-gray-400 tracking-wider">Last Condition</p>
              <p className="text-sm font-medium text-gray-900">
                {CONDITIONS.find((c) => c.code === toothData?.condition)?.label || toothData?.condition}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-gray-400 tracking-wider">Last Treatment</p>
              <p className="text-sm font-medium text-gray-900">{toothData?.treatment || "-"}</p>
            </div>
            {toothData?.note && (
              <div>
                <p className="text-[10px] uppercase text-gray-400 tracking-wider">Notes</p>
                <p className="text-sm text-gray-700">{toothData.note}</p>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 h-9 text-sm bg-transparent"
                onClick={() => setToothPopup({ tooth: selectedTooth, isEditing: true })}
              >
                Edit
              </Button>
              {toothData?.history && toothData.history.length > 0 && (
                <Button
                  variant="ghost"
                  className="h-9 text-sm text-primary"
                  onClick={() => handleViewHistory(selectedTooth)}
                >
                  History
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Tooth History Panel
  const ToothHistoryPanel = () => {
    if (!showToothHistory || !selectedTooth) return null

    const toothData = formData.teethData[selectedTooth]
    const toothName = TOOTH_NAMES[selectedTooth] || "Tooth"
    const history = toothData?.history || []

    return (
      <Dialog open={showToothHistory} onOpenChange={(open) => !open && setShowToothHistory(false)}>
        <DialogContent className="sm:max-w-[500px] p-0 gap-0 [&>button]:hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{toothName}</span>
              <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600">
                <svg
                  className="w-3 h-3 inline mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                </svg>
                {selectedTooth}
              </span>
            </div>
            <button onClick={() => setShowToothHistory(false)} className="text-gray-400 hover:text-gray-600">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 max-h-[400px] overflow-y-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200" />

              {history.map((entry, index) => (
                <div key={index} className="relative pl-8 pb-6 last:pb-0">
                  {/* Timeline dot */}
                  <div
                    className={cn(
                      "absolute left-0 w-4 h-4 rounded-full border-2 bg-white",
                      entry.status === "done" ? "border-emerald-500" : "border-gray-300",
                    )}
                  />

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <p className="text-[10px] uppercase text-gray-400">{entry.date.split(" ")[0]}</p>
                          <p className="text-xl font-semibold text-gray-900">{entry.date.split(" ")[1]}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-gray-400">Condition</p>
                          <p className="font-medium text-gray-900">{entry.condition}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-gray-400">Treatment</p>
                          <p className="font-medium text-gray-900">{entry.treatment}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-gray-400">Dentist</p>
                          <p className="font-medium text-gray-900">{entry.dentist}</p>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "flex items-center gap-1 text-xs font-medium",
                          entry.status === "done" ? "text-emerald-600" : "text-red-500",
                        )}
                      >
                        {entry.status === "done" ? (
                          <>
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Done
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3" />
                            Pending
                          </>
                        )}
                      </span>
                    </div>

                    {entry.reason && (
                      <p className="text-sm text-gray-600 mb-2 border-l-2 border-gray-300 pl-2">
                        Reason: {entry.reason}
                      </p>
                    )}

                    <div className="flex items-start gap-2 bg-white rounded-lg p-3 border border-gray-100">
                      <svg
                        className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-sm text-gray-600">{entry.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden [&>button]:hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Medical Checkup</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={handleClose}>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </Button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isCompleted = currentStep > step.id
              const isCurrent = currentStep === step.id

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors",
                        isCompleted
                          ? "bg-primary text-white"
                          : isCurrent
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-400",
                      )}
                    >
                      {isCompleted ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="text-center">
                      <p
                        className={cn(
                          "text-[10px] uppercase tracking-wider",
                          isCurrent ? "text-primary font-medium" : "text-gray-400",
                        )}
                      >
                        Step {step.id}
                      </p>
                      <p className={cn("text-xs font-medium", isCurrent ? "text-gray-900" : "text-gray-500")}>
                        {step.name}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn("w-16 h-0.5 mx-2 mt-[-20px]", currentStep > step.id ? "bg-primary" : "bg-gray-200")}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-4 max-h-[450px] overflow-y-auto">
          {/* Step 1: Medical Data */}
          {currentStep === 1 && (
            <div className="space-y-4">
              {/* Info Banner */}
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                <svg
                  className="h-4 w-4 text-blue-500 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm text-blue-700">
                  Patient & Medical data are based on previous check, you can update it according to latest data.
                </span>
              </div>

              {/* View Oral Hygiene Habits Link */}
              <button type="button" className="flex items-center gap-2 text-primary hover:underline">
                <Smile className="h-4 w-4" />
                <span className="text-sm font-medium">View Oral Hygiene Habits</span>
              </button>

              {/* Blood Pressure */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Blood pressure</Label>
                <div className="flex gap-3 mt-2">
                  <div className="relative flex-1">
                    <Input
                      type="number"
                      placeholder="Enter value"
                      value={formData.bloodPressureMm}
                      onChange={(e) => setFormData((prev) => ({ ...prev, bloodPressureMm: e.target.value }))}
                      className="pr-10 h-11 rounded-xl"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">mm</span>
                  </div>
                  <div className="relative flex-1">
                    <Input
                      type="number"
                      placeholder="Enter value"
                      value={formData.bloodPressureHg}
                      onChange={(e) => setFormData((prev) => ({ ...prev, bloodPressureHg: e.target.value }))}
                      className="pr-10 h-11 rounded-xl"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">hg</span>
                  </div>
                </div>
              </div>

              {/* Particular Sickness */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Particular Sickness</Label>
                <div className="mt-2 space-y-2">
                  {SICKNESSES.map((sickness) => (
                    <div
                      key={sickness}
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-gray-300 cursor-pointer"
                      onClick={() => handleSicknessToggle(sickness)}
                    >
                      <Checkbox
                        checked={formData.sicknesses.includes(sickness)}
                        onCheckedChange={() => handleSicknessToggle(sickness)}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <span className="text-sm text-gray-700">{sickness}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Allergic */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Allergic</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {ALLERGIES.map((allergy) => (
                    <div
                      key={allergy}
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-gray-300 cursor-pointer"
                      onClick={() => handleAllergyToggle(allergy)}
                    >
                      <Checkbox
                        checked={formData.allergies.includes(allergy)}
                        onCheckedChange={() => handleAllergyToggle(allergy)}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <span className="text-sm text-gray-700">{allergy}</span>
                    </div>
                  ))}
                </div>
                {formData.allergies.includes("Other") && (
                  <Input
                    type="text"
                    placeholder="Specify other allergies..."
                    value={formData.otherAllergies}
                    onChange={(e) => setFormData((prev) => ({ ...prev, otherAllergies: e.target.value }))}
                    className="mt-2 h-11 rounded-xl"
                  />
                )}
              </div>
            </div>
          )}

          {/* Step 2: Treatment Plan - Medical Service with Dental Chart */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {/* Info Banner */}
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                <svg
                  className="h-4 w-4 text-blue-500 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm text-blue-700">
                  Patient & Medical data are based on previous check, you can update it according to latest data.
                </span>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2">
                <span className="w-6 h-6 rounded-full border border-gray-900 flex items-center justify-center text-xs font-medium">
                  1
                </span>
                <span className="w-4 h-px bg-gray-300" />
                <span className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-xs text-gray-400">
                  2
                </span>
              </div>

              {/* Medical Service Section */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">Medical service</h3>
                <p className="text-sm text-gray-500">Select a problem tooths</p>
              </div>

              {/* Dental Chart with Popup */}
              <div className="relative">
                <InteractiveToothChart
                  teethData={formData.teethData}
                  onToothDataChange={(toothId, data) => {
                    if (data) {
                      setFormData((prev) => ({
                        ...prev,
                        teethData: {
                          ...prev.teethData,
                          [toothId]: data,
                        },
                      }))
                    } else {
                      // Delete tooth data
                      setFormData((prev) => {
                        const newTeethData = { ...prev.teethData }
                        delete newTeethData[toothId]
                        return { ...prev, teethData: newTeethData }
                      })
                    }
                  }}
                  size="md"
                  showLegend={true}
                />
              </div>
            </div>
          )}

          {/* Step 3: Oral Check */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                <svg
                  className="h-4 w-4 text-blue-500 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm text-blue-700">
                  Patient & Medical data are based on previous check, you can update it according to latest data.
                </span>
              </div>

              {/* Occlusi */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Occlusi</Label>
                <div className="grid grid-cols-3 gap-2">
                  {["Normal Bite", "Cross Bite", "Steep Bite"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, occlusi: option }))}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all",
                        formData.occlusi === option
                          ? "bg-blue-50 border-primary text-primary font-medium"
                          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300",
                      )}
                    >
                      <div
                        className={cn(
                          "w-4 h-4 rounded-full border flex items-center justify-center",
                          formData.occlusi === option ? "border-primary" : "border-gray-300",
                        )}
                      >
                        {formData.occlusi === option && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Torus Palatinus */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Torus Palatinus</Label>
                <div className="grid grid-cols-3 gap-2">
                  {["No", "Small", "Medium", "Large", "Multiple"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, torusPalatinus: option }))}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all",
                        formData.torusPalatinus === option
                          ? "bg-blue-50 border-primary text-primary font-medium"
                          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300",
                      )}
                    >
                      <div
                        className={cn(
                          "w-4 h-4 rounded-full border flex items-center justify-center",
                          formData.torusPalatinus === option ? "border-primary" : "border-gray-300",
                        )}
                      >
                        {formData.torusPalatinus === option && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Torus Mandibularis */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Torus Mandibularis</Label>
                <div className="grid grid-cols-4 gap-2">
                  {["No", "Left side", "Right side", "Both side"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, torusMandibularis: option }))}
                      className={cn(
                        "flex items-center gap-2 px-2 py-2.5 rounded-xl border text-xs transition-all",
                        formData.torusMandibularis === option
                          ? "bg-blue-50 border-primary text-primary font-medium"
                          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300",
                      )}
                    >
                      <div
                        className={cn(
                          "w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0",
                          formData.torusMandibularis === option ? "border-primary" : "border-gray-300",
                        )}
                      >
                        {formData.torusMandibularis === option && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                      </div>
                      <span className="truncate">{option}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Palatum */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Palatum</Label>
                <div className="grid grid-cols-4 gap-2">
                  {["No", "Left side", "Right side", "Both side"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, palatum: option }))}
                      className={cn(
                        "flex items-center gap-2 px-2 py-2.5 rounded-xl border text-xs transition-all",
                        formData.palatum === option
                          ? "bg-blue-50 border-primary text-primary font-medium"
                          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300",
                      )}
                    >
                      <div
                        className={cn(
                          "w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0",
                          formData.palatum === option ? "border-primary" : "border-gray-300",
                        )}
                      >
                        {formData.palatum === option && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                      </div>
                      <span className="truncate">{option}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Diastema */}
              <div className="space-y-3">
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setFormData((prev) => ({ ...prev, diastema: !prev.diastema }))}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded border flex items-center justify-center transition-all",
                      formData.diastema ? "bg-primary border-primary" : "border-gray-300",
                    )}
                  >
                    {formData.diastema && (
                      <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <Label className="text-sm font-medium text-gray-700 cursor-pointer">Diastema</Label>
                </div>

                <div className={cn("space-y-2 transition-all duration-300", formData.diastema ? "opacity-100 h-auto" : "opacity-0 h-0 overflow-hidden")}>
                  <Textarea
                    placeholder="Explain where and how wide"
                    value={formData.diastemaNotes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, diastemaNotes: e.target.value }))}
                    className="min-h-[80px] rounded-xl bg-gray-50 border-none resize-none focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Plan Agreement */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                <svg
                  className="h-4 w-4 text-emerald-500 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-emerald-700">
                  Review the treatment plan summary and confirm with the patient.
                </span>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <h4 className="font-medium text-gray-900">Treatment Summary</h4>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Blood Pressure</p>
                    <p className="font-medium">
                      {formData.bloodPressureMm || "-"}/{formData.bloodPressureHg || "-"} mmHg
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Conditions</p>
                    <p className="font-medium">
                      {formData.sicknesses.length > 0 ? formData.sicknesses.join(", ") : "None"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Allergies</p>
                    <p className="font-medium">
                      {formData.allergies.length > 0 ? formData.allergies.join(", ") : "None"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Teeth Requiring Treatment</p>
                    <p className="font-medium">{Object.keys(formData.teethData).length} teeth</p>
                  </div>
                </div>
              </div>

              {/* Teeth Treatment Details */}
              {Object.keys(formData.teethData).length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Teeth Treatment Plan</h4>
                  <div className="space-y-2">
                    {Object.entries(formData.teethData).map(([toothId, data]) => (
                      <div
                        key={toothId}
                        className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
                      >
                        <span className="text-sm">
                          {TOOTH_NAMES[Number(toothId)]} #{toothId}
                        </span>
                        <span className="text-sm text-gray-600">{data.treatment || "Pending"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Agreement Checkbox */}
              <div
                className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 cursor-pointer"
                onClick={() => setFormData((prev) => ({ ...prev, agreedToPlan: !prev.agreedToPlan }))}
              >
                <Checkbox
                  checked={formData.agreedToPlan}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreedToPlan: checked as boolean }))}
                  className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Patient Agreement</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    I confirm that the patient has been informed about the treatment plan and agrees to proceed.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50">
          <Button variant="ghost" onClick={handleClose} className="text-gray-600">
            Cancel
          </Button>
          <div className="flex items-center gap-2">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handlePrevious} className="rounded-xl bg-transparent">
                Previous
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={currentStep === 4 && !formData.agreedToPlan}
              className="rounded-xl bg-primary hover:bg-primary/90 min-w-[100px]"
            >
              {currentStep === 4 ? "Complete" : "Next"}
            </Button>
          </div>
        </div>

        {/* Tooth History Panel */}
        <ToothHistoryPanel />
      </DialogContent>
    </Dialog>
  )
}
