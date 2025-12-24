"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Save, Trash2, Edit, History } from "lucide-react"
import { treatmentTypes, staff } from "@/lib/data"

interface ToothChartProps {
  patientId: string
}

type ToothStatus =
  | "healthy"
  | "treated"
  | "filling"
  | "cavity"
  | "crown"
  | "missing"
  | "extraction"
  | "implant"
  | "bridge"

interface ToothTreatment {
  id: string
  date: string
  treatment: string
  dentist: string
  surface?: string
  notes?: string
}

interface ToothData {
  status: ToothStatus
  treatments: ToothTreatment[]
  notes?: string
}

// Initial tooth data with treatment history
const initialTeethData: Record<number, ToothData> = {
  11: { status: "healthy", treatments: [] },
  12: { status: "healthy", treatments: [] },
  13: { status: "healthy", treatments: [] },
  14: {
    status: "treated",
    treatments: [
      {
        id: "TT001",
        date: "2024-12-05",
        treatment: "Root Canal Treatment",
        dentist: "Dr. Sarah Chen",
        notes: "Successful root canal",
      },
      {
        id: "TT002",
        date: "2024-12-12",
        treatment: "Crown Fitting",
        dentist: "Dr. Sarah Chen",
        notes: "Porcelain crown placed",
      },
    ],
  },
  15: { status: "healthy", treatments: [] },
  16: {
    status: "filling",
    treatments: [
      {
        id: "TT003",
        date: "2024-06-15",
        treatment: "Dental Filling",
        dentist: "Dr. James Lee",
        surface: "MO",
        notes: "Composite filling",
      },
    ],
  },
  17: { status: "healthy", treatments: [] },
  18: {
    status: "missing",
    treatments: [
      {
        id: "TT004",
        date: "2023-03-10",
        treatment: "Tooth Extraction",
        dentist: "Dr. Sarah Chen",
        notes: "Wisdom tooth extraction",
      },
    ],
  },
  21: { status: "healthy", treatments: [] },
  22: { status: "healthy", treatments: [] },
  23: { status: "healthy", treatments: [] },
  24: { status: "healthy", treatments: [] },
  25: { status: "cavity", treatments: [] },
  26: {
    status: "filling",
    treatments: [
      {
        id: "TT005",
        date: "2024-10-15",
        treatment: "Dental Filling",
        dentist: "Dr. James Lee",
        surface: "M",
        notes: "Composite filling for small cavity",
      },
    ],
  },
  27: { status: "healthy", treatments: [] },
  28: { status: "missing", treatments: [] },
  31: { status: "healthy", treatments: [] },
  32: { status: "healthy", treatments: [] },
  33: { status: "healthy", treatments: [] },
  34: { status: "healthy", treatments: [] },
  35: { status: "healthy", treatments: [] },
  36: {
    status: "crown",
    treatments: [
      {
        id: "TT006",
        date: "2023-08-20",
        treatment: "Crown Fitting",
        dentist: "Dr. Sarah Chen",
        notes: "Full ceramic crown",
      },
    ],
  },
  37: { status: "healthy", treatments: [] },
  38: { status: "healthy", treatments: [] },
  41: { status: "healthy", treatments: [] },
  42: { status: "healthy", treatments: [] },
  43: { status: "healthy", treatments: [] },
  44: { status: "healthy", treatments: [] },
  45: { status: "healthy", treatments: [] },
  46: { status: "healthy", treatments: [] },
  47: {
    status: "filling",
    treatments: [
      {
        id: "TT007",
        date: "2024-02-28",
        treatment: "Dental Filling",
        dentist: "Dr. James Lee",
        surface: "DO",
        notes: "Amalgam filling replaced with composite",
      },
    ],
  },
  48: { status: "extraction", treatments: [], notes: "Scheduled for extraction due to impaction" },
}

const statusOptions: { value: ToothStatus; label: string; color: string }[] = [
  { value: "healthy", label: "Healthy", color: "bg-green-100 text-green-700 hover:bg-green-200" },
  { value: "treated", label: "Treated", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
  { value: "filling", label: "Filling", color: "bg-amber-100 text-amber-700 hover:bg-amber-200" },
  { value: "cavity", label: "Cavity", color: "bg-red-100 text-red-700 hover:bg-red-200" },
  { value: "crown", label: "Crown", color: "bg-purple-100 text-purple-700 hover:bg-purple-200" },
  { value: "missing", label: "Missing", color: "bg-gray-200 text-gray-500" },
  { value: "extraction", label: "Extraction Needed", color: "bg-red-200 text-red-800 hover:bg-red-300" },
  { value: "implant", label: "Implant", color: "bg-cyan-100 text-cyan-700 hover:bg-cyan-200" },
  { value: "bridge", label: "Bridge", color: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" },
]

const surfaceOptions = ["M", "O", "D", "B", "L", "I", "MO", "DO", "MOD", "MODBL"]

export function ToothChart({ patientId }: ToothChartProps) {
  const [teethData, setTeethData] = useState<Record<number, ToothData>>(initialTeethData)
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null)
  const [isAddTreatmentOpen, setIsAddTreatmentOpen] = useState(false)
  const [isEditToothOpen, setIsEditToothOpen] = useState(false)

  const [newTreatment, setNewTreatment] = useState({
    treatmentTypeId: "",
    date: new Date().toISOString().split("T")[0],
    dentistId: "",
    surface: "",
    notes: "",
  })

  const doctors = staff.filter((s) => s.role === "dentist" || s.role === "hygienist")

  const upperRight = [18, 17, 16, 15, 14, 13, 12, 11]
  const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28]
  const lowerLeft = [31, 32, 33, 34, 35, 36, 37, 38]
  const lowerRight = [48, 47, 46, 45, 44, 43, 42, 41]

  const getStatusColor = (status: ToothStatus) => {
    return statusOptions.find((s) => s.value === status)?.color || "bg-gray-100"
  }

  const handleAddTreatment = () => {
    if (selectedTooth && newTreatment.treatmentTypeId && newTreatment.dentistId) {
      const treatmentType = treatmentTypes.find((t) => t.id === newTreatment.treatmentTypeId)
      const dentist = staff.find((s) => s.id === newTreatment.dentistId)

      if (treatmentType && dentist) {
        const treatment: ToothTreatment = {
          id: `TT${Date.now()}`,
          date: newTreatment.date,
          treatment: treatmentType.name,
          dentist:
            dentist.role === "dentist"
              ? `Dr. ${dentist.firstName} ${dentist.lastName}`
              : `${dentist.firstName} ${dentist.lastName}`,
          surface: newTreatment.surface || undefined,
          notes: newTreatment.notes || undefined,
        }

        setTeethData({
          ...teethData,
          [selectedTooth]: {
            ...teethData[selectedTooth],
            status: "treated",
            treatments: [treatment, ...teethData[selectedTooth].treatments],
          },
        })

        setNewTreatment({
          treatmentTypeId: "",
          date: new Date().toISOString().split("T")[0],
          dentistId: "",
          surface: "",
          notes: "",
        })
        setIsAddTreatmentOpen(false)
      }
    }
  }

  const handleUpdateToothStatus = (status: ToothStatus) => {
    if (selectedTooth) {
      setTeethData({
        ...teethData,
        [selectedTooth]: {
          ...teethData[selectedTooth],
          status,
        },
      })
    }
  }

  const handleDeleteTreatment = (treatmentId: string) => {
    if (selectedTooth) {
      setTeethData({
        ...teethData,
        [selectedTooth]: {
          ...teethData[selectedTooth],
          treatments: teethData[selectedTooth].treatments.filter((t) => t.id !== treatmentId),
        },
      })
    }
  }

  const ToothButton = ({ toothNumber }: { toothNumber: number }) => {
    const tooth = teethData[toothNumber]
    const hasHistory = tooth.treatments.length > 0
    return (
      <button
        onClick={() => setSelectedTooth(toothNumber)}
        className={cn(
          "relative flex h-12 w-12 items-center justify-center rounded-lg text-sm font-medium transition-all neu-button",
          getStatusColor(tooth.status),
          selectedTooth === toothNumber && "ring-2 ring-primary ring-offset-2",
        )}
      >
        {toothNumber}
        {hasHistory && (
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary border-2 border-white" />
        )}
      </button>
    )
  }

  const selectedToothData = selectedTooth ? teethData[selectedTooth] : null

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-background p-6 neu-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Tooth Chart</h2>
          <p className="text-sm text-muted-foreground">Click on a tooth to view/add treatments</p>
        </div>

        {/* Legend */}
        <div className="mb-6 flex flex-wrap gap-3">
          {statusOptions.map(({ value, label, color }) => (
            <div key={value} className="flex items-center gap-2">
              <div className={cn("h-4 w-4 rounded", color.split(" ")[0])} />
              <span className="text-sm text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        {/* Tooth Chart */}
        <div className="space-y-4">
          {/* Upper Jaw */}
          <div className="flex justify-center gap-1">
            <div className="flex gap-1">
              {upperRight.map((num) => (
                <ToothButton key={num} toothNumber={num} />
              ))}
            </div>
            <div className="w-4" />
            <div className="flex gap-1">
              {upperLeft.map((num) => (
                <ToothButton key={num} toothNumber={num} />
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-sm text-muted-foreground px-4">Upper / Lower</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Lower Jaw */}
          <div className="flex justify-center gap-1">
            <div className="flex gap-1">
              {lowerRight.map((num) => (
                <ToothButton key={num} toothNumber={num} />
              ))}
            </div>
            <div className="w-4" />
            <div className="flex gap-1">
              {lowerLeft.map((num) => (
                <ToothButton key={num} toothNumber={num} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Tooth Details */}
      {selectedTooth && selectedToothData && (
        <div className="rounded-2xl bg-background p-6 neu-card">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Tooth #{selectedTooth}</h3>
              <span
                className={cn(
                  "inline-block mt-2 rounded-full px-3 py-1 text-sm font-medium capitalize",
                  getStatusColor(selectedToothData.status),
                )}
              >
                {selectedToothData.status}
              </span>
            </div>
            <div className="flex gap-2">
              {/* Edit Status */}
              <Dialog open={isEditToothOpen} onOpenChange={setIsEditToothOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="rounded-xl neu-button border-0 bg-transparent">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Status
                  </Button>
                </DialogTrigger>
                <DialogContent className="neu-card">
                  <DialogHeader>
                    <DialogTitle>Edit Tooth #{selectedTooth} Status</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <Label className="mb-3 block">Select Status</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {statusOptions.map(({ value, label, color }) => (
                        <button
                          key={value}
                          onClick={() => {
                            handleUpdateToothStatus(value)
                            setIsEditToothOpen(false)
                          }}
                          className={cn(
                            "rounded-lg px-3 py-2 text-sm font-medium transition-all",
                            color,
                            selectedToothData.status === value && "ring-2 ring-primary",
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Add Treatment */}
              <Dialog open={isAddTreatmentOpen} onOpenChange={setIsAddTreatmentOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-xl neu-button bg-primary text-primary-foreground">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Treatment
                  </Button>
                </DialogTrigger>
                <DialogContent className="neu-card">
                  <DialogHeader>
                    <DialogTitle>Add Treatment for Tooth #{selectedTooth}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Treatment Type</Label>
                      <Select
                        value={newTreatment.treatmentTypeId}
                        onValueChange={(value) => setNewTreatment({ ...newTreatment, treatmentTypeId: value })}
                      >
                        <SelectTrigger className="neu-input">
                          <SelectValue placeholder="Select treatment" />
                        </SelectTrigger>
                        <SelectContent className="neu-card">
                          {treatmentTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input
                          type="date"
                          value={newTreatment.date}
                          onChange={(e) => setNewTreatment({ ...newTreatment, date: e.target.value })}
                          className="neu-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Surface (Optional)</Label>
                        <Select
                          value={newTreatment.surface}
                          onValueChange={(value) => setNewTreatment({ ...newTreatment, surface: value })}
                        >
                          <SelectTrigger className="neu-input">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="neu-card">
                            {surfaceOptions.map((surface) => (
                              <SelectItem key={surface} value={surface}>
                                {surface}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Dentist</Label>
                      <Select
                        value={newTreatment.dentistId}
                        onValueChange={(value) => setNewTreatment({ ...newTreatment, dentistId: value })}
                      >
                        <SelectTrigger className="neu-input">
                          <SelectValue placeholder="Select dentist" />
                        </SelectTrigger>
                        <SelectContent className="neu-card">
                          {doctors.map((doc) => (
                            <SelectItem key={doc.id} value={doc.id}>
                              {doc.role === "dentist" ? "Dr. " : ""}
                              {doc.firstName} {doc.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Notes (Optional)</Label>
                      <Textarea
                        value={newTreatment.notes}
                        onChange={(e) => setNewTreatment({ ...newTreatment, notes: e.target.value })}
                        placeholder="Add treatment notes..."
                        className="neu-input"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddTreatmentOpen(false)}
                      className="neu-button border-0"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddTreatment} className="neu-button bg-primary text-primary-foreground">
                      <Save className="mr-2 h-4 w-4" />
                      Save Treatment
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Treatment History */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <History className="h-5 w-5 text-primary" />
              <h4 className="font-medium text-foreground">Treatment History</h4>
            </div>

            {selectedToothData.treatments.length === 0 ? (
              <div className="rounded-xl bg-background p-6 text-center neu-pressed">
                <p className="text-muted-foreground">No treatments recorded for this tooth.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedToothData.treatments.map((treatment) => (
                  <div key={treatment.id} className="rounded-xl bg-background p-4 neu-pressed">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="font-medium text-foreground">{treatment.treatment}</h5>
                        <p className="text-sm text-muted-foreground">
                          {treatment.date} - {treatment.dentist}
                          {treatment.surface && ` - Surface: ${treatment.surface}`}
                        </p>
                        {treatment.notes && <p className="text-sm text-muted-foreground mt-1">{treatment.notes}</p>}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteTreatment(treatment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          {selectedToothData.notes && (
            <div className="mt-4 rounded-xl bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-700 mb-1">Notes</p>
              <p className="text-sm text-amber-800">{selectedToothData.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
