"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, CheckCircle, Clock, AlertCircle, Edit, Trash2, Save } from "lucide-react"
import { treatmentTypes, staff } from "@/lib/data"

interface PatientTreatmentsProps {
  patientId: string
}

const initialTreatments = [
  {
    id: "T001",
    date: "2024-12-05",
    treatment: "Root Canal Treatment",
    treatmentTypeId: "T002",
    tooth: "14",
    status: "completed" as const,
    dentistId: "S001",
    dentist: "Dr. Sarah Chen",
    cost: 800,
    notes: "Successful root canal. Patient to return for crown fitting.",
  },
  {
    id: "T002",
    date: "2024-11-20",
    treatment: "Dental Cleaning",
    treatmentTypeId: "T001",
    tooth: null,
    status: "completed" as const,
    dentistId: "S003",
    dentist: "Maria Garcia",
    cost: 150,
    notes: "Regular cleaning completed. Minor tartar buildup addressed.",
  },
  {
    id: "T003",
    date: "2024-12-20",
    treatment: "Crown Fitting",
    treatmentTypeId: "T004",
    tooth: "14",
    status: "planned" as const,
    dentistId: "S001",
    dentist: "Dr. Sarah Chen",
    cost: 1200,
    notes: "Follow-up from root canal treatment.",
  },
  {
    id: "T004",
    date: "2024-10-15",
    treatment: "Dental Filling",
    treatmentTypeId: "T005",
    tooth: "26",
    status: "completed" as const,
    dentistId: "S002",
    dentist: "Dr. James Lee",
    cost: 150,
    notes: "Composite filling for small cavity.",
  },
]

type TreatmentStatus = "planned" | "in-progress" | "completed"

interface Treatment {
  id: string
  date: string
  treatment: string
  treatmentTypeId: string
  tooth: string | null
  status: TreatmentStatus
  dentistId: string
  dentist: string
  cost: number
  notes: string
}

export function PatientTreatments({ patientId }: PatientTreatmentsProps) {
  const [treatments, setTreatments] = useState<Treatment[]>(initialTreatments)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null)
  const [newTreatment, setNewTreatment] = useState({
    treatmentTypeId: "",
    tooth: "",
    date: "",
    dentistId: "",
    notes: "",
    status: "planned" as TreatmentStatus,
  })

  const doctors = staff.filter((s) => s.role === "dentist" || s.role === "hygienist")

  const handleAddTreatment = () => {
    const treatmentType = treatmentTypes.find((t) => t.id === newTreatment.treatmentTypeId)
    const dentist = staff.find((s) => s.id === newTreatment.dentistId)

    if (treatmentType && dentist) {
      const treatment: Treatment = {
        id: `T${Date.now()}`,
        date: newTreatment.date,
        treatment: treatmentType.name,
        treatmentTypeId: newTreatment.treatmentTypeId,
        tooth: newTreatment.tooth || null,
        status: newTreatment.status,
        dentistId: newTreatment.dentistId,
        dentist:
          dentist.role === "dentist"
            ? `Dr. ${dentist.firstName} ${dentist.lastName}`
            : `${dentist.firstName} ${dentist.lastName}`,
        cost: treatmentType.basePrice,
        notes: newTreatment.notes,
      }
      setTreatments([treatment, ...treatments])
      setNewTreatment({ treatmentTypeId: "", tooth: "", date: "", dentistId: "", notes: "", status: "planned" })
      setIsAddModalOpen(false)
    }
  }

  const handleUpdateTreatment = () => {
    if (editingTreatment) {
      setTreatments(treatments.map((t) => (t.id === editingTreatment.id ? editingTreatment : t)))
      setEditingTreatment(null)
    }
  }

  const handleDeleteTreatment = (id: string) => {
    setTreatments(treatments.filter((t) => t.id !== id))
  }

  const handleStatusChange = (id: string, status: TreatmentStatus) => {
    setTreatments(treatments.map((t) => (t.id === id ? { ...t, status } : t)))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Treatment Plan</h2>
          <p className="text-sm text-muted-foreground">Manage patient treatments and procedures</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl neu-button bg-primary text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" />
              Add Treatment
            </Button>
          </DialogTrigger>
          <DialogContent className="neu-card max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Treatment</DialogTitle>
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
                        {type.name} - ${type.basePrice}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tooth Number (optional)</Label>
                  <Input
                    value={newTreatment.tooth}
                    onChange={(e) => setNewTreatment({ ...newTreatment, tooth: e.target.value })}
                    placeholder="e.g., 14"
                    className="neu-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={newTreatment.date}
                    onChange={(e) => setNewTreatment({ ...newTreatment, date: e.target.value })}
                    className="neu-input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Assigned Doctor</Label>
                  <Select
                    value={newTreatment.dentistId}
                    onValueChange={(value) => setNewTreatment({ ...newTreatment, dentistId: value })}
                  >
                    <SelectTrigger className="neu-input">
                      <SelectValue placeholder="Select doctor" />
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
                  <Label>Status</Label>
                  <Select
                    value={newTreatment.status}
                    onValueChange={(value: TreatmentStatus) => setNewTreatment({ ...newTreatment, status: value })}
                  >
                    <SelectTrigger className="neu-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="neu-card">
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={newTreatment.notes}
                  onChange={(e) => setNewTreatment({ ...newTreatment, notes: e.target.value })}
                  placeholder="Add any notes..."
                  className="neu-input"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="neu-button border-0">
                Cancel
              </Button>
              <Button onClick={handleAddTreatment} className="neu-button bg-primary text-primary-foreground">
                <Save className="mr-2 h-4 w-4" />
                Add Treatment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-green-50 p-4 neu-card">
          <p className="text-sm text-green-600">Completed</p>
          <p className="text-2xl font-bold text-green-700">
            {treatments.filter((t) => t.status === "completed").length}
          </p>
        </div>
        <div className="rounded-xl bg-blue-50 p-4 neu-card">
          <p className="text-sm text-blue-600">Planned</p>
          <p className="text-2xl font-bold text-blue-700">{treatments.filter((t) => t.status === "planned").length}</p>
        </div>
        <div className="rounded-xl bg-amber-50 p-4 neu-card">
          <p className="text-sm text-amber-600">In Progress</p>
          <p className="text-2xl font-bold text-amber-700">
            {treatments.filter((t) => t.status === "in-progress").length}
          </p>
        </div>
      </div>

      {/* Treatment List */}
      <div className="space-y-4">
        {treatments.map((treatment) => (
          <div key={treatment.id} className="rounded-2xl bg-background p-6 neu-card">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    treatment.status === "completed"
                      ? "bg-green-100 text-green-600"
                      : treatment.status === "planned"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-amber-100 text-amber-600"
                  }`}
                >
                  {treatment.status === "completed" ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : treatment.status === "planned" ? (
                    <Clock className="h-5 w-5" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{treatment.treatment}</h3>
                  <p className="text-sm text-muted-foreground">
                    {treatment.date} - {treatment.dentist}
                    {treatment.tooth && ` - Tooth #${treatment.tooth}`}
                  </p>
                  {treatment.notes && <p className="mt-2 text-sm text-muted-foreground">{treatment.notes}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right mr-4">
                  <p className="text-lg font-semibold text-foreground">${treatment.cost}</p>
                  <Select
                    value={treatment.status}
                    onValueChange={(value: TreatmentStatus) => handleStatusChange(treatment.id, value)}
                  >
                    <SelectTrigger
                      className={`h-7 w-28 text-xs font-medium border-0 ${
                        treatment.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : treatment.status === "planned"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="neu-card">
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Dialog
                  open={editingTreatment?.id === treatment.id}
                  onOpenChange={(open) => !open && setEditingTreatment(null)}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 neu-button"
                      onClick={() => setEditingTreatment(treatment)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="neu-card max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Edit Treatment</DialogTitle>
                    </DialogHeader>
                    {editingTreatment && (
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label>Treatment</Label>
                          <Input value={editingTreatment.treatment} disabled className="neu-input" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Tooth Number</Label>
                            <Input
                              value={editingTreatment.tooth || ""}
                              onChange={(e) =>
                                setEditingTreatment({ ...editingTreatment, tooth: e.target.value || null })
                              }
                              className="neu-input"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Date</Label>
                            <Input
                              type="date"
                              value={editingTreatment.date}
                              onChange={(e) => setEditingTreatment({ ...editingTreatment, date: e.target.value })}
                              className="neu-input"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Cost</Label>
                          <Input
                            type="number"
                            value={editingTreatment.cost}
                            onChange={(e) => setEditingTreatment({ ...editingTreatment, cost: Number(e.target.value) })}
                            className="neu-input"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Notes</Label>
                          <Textarea
                            value={editingTreatment.notes}
                            onChange={(e) => setEditingTreatment({ ...editingTreatment, notes: e.target.value })}
                            className="neu-input"
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setEditingTreatment(null)}
                        className="neu-button border-0"
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateTreatment} className="neu-button bg-primary text-primary-foreground">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 neu-button"
                  onClick={() => handleDeleteTreatment(treatment.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
