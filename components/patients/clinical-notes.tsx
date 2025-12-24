"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Plus,
  FileText,
  Calendar,
  User,
  Edit,
  Trash2,
  Save,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  ClipboardList,
  Activity,
} from "lucide-react"
import { clinicalNotes as initialNotes, staff, type ClinicalNote } from "@/lib/data"
import { cn } from "@/lib/utils"

interface ClinicalNotesProps {
  patientId: string
}

export function ClinicalNotes({ patientId }: ClinicalNotesProps) {
  const [notes, setNotes] = useState<ClinicalNote[]>(initialNotes.filter((n) => n.patientId === patientId))
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<ClinicalNote | null>(null)
  const [expandedNote, setExpandedNote] = useState<string | null>(null)
  const [newNote, setNewNote] = useState({
    visitDate: new Date().toISOString().split("T")[0],
    dentistId: "",
    chiefComplaint: "",
    examination: "",
    diagnosis: "",
    treatmentProvided: "",
    recommendations: "",
    followUpDate: "",
  })

  const doctors = staff.filter((s) => s.role === "dentist" || s.role === "hygienist")

  const handleAddNote = () => {
    const dentist = staff.find((s) => s.id === newNote.dentistId)
    if (dentist && newNote.chiefComplaint) {
      const note: ClinicalNote = {
        id: `CN${Date.now()}`,
        patientId,
        visitDate: newNote.visitDate,
        dentistId: newNote.dentistId,
        dentistName:
          dentist.role === "dentist"
            ? `Dr. ${dentist.firstName} ${dentist.lastName}`
            : `${dentist.firstName} ${dentist.lastName}`,
        chiefComplaint: newNote.chiefComplaint,
        examination: newNote.examination,
        diagnosis: newNote.diagnosis,
        treatmentProvided: newNote.treatmentProvided,
        recommendations: newNote.recommendations,
        followUpDate: newNote.followUpDate || undefined,
        createdAt: new Date().toISOString(),
      }
      setNotes([note, ...notes])
      setNewNote({
        visitDate: new Date().toISOString().split("T")[0],
        dentistId: "",
        chiefComplaint: "",
        examination: "",
        diagnosis: "",
        treatmentProvided: "",
        recommendations: "",
        followUpDate: "",
      })
      setIsAddModalOpen(false)
    }
  }

  const handleUpdateNote = () => {
    if (editingNote) {
      setNotes(notes.map((n) => (n.id === editingNote.id ? editingNote : n)))
      setEditingNote(null)
    }
  }

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Clinical Notes</h2>
          <p className="text-sm text-muted-foreground">Visit-based clinical documentation and observations</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl neu-button bg-primary text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" />
              Add Clinical Note
            </Button>
          </DialogTrigger>
          <DialogContent className="neu-card max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Clinical Note</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Visit Date</Label>
                  <Input
                    type="date"
                    value={newNote.visitDate}
                    onChange={(e) => setNewNote({ ...newNote, visitDate: e.target.value })}
                    className="neu-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Clinician</Label>
                  <Select
                    value={newNote.dentistId}
                    onValueChange={(value) => setNewNote({ ...newNote, dentistId: value })}
                  >
                    <SelectTrigger className="neu-input">
                      <SelectValue placeholder="Select clinician" />
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
              </div>

              <div className="space-y-2">
                <Label>Chief Complaint</Label>
                <Textarea
                  value={newNote.chiefComplaint}
                  onChange={(e) => setNewNote({ ...newNote, chiefComplaint: e.target.value })}
                  placeholder="Patient's main concern or reason for visit..."
                  className="neu-input min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Clinical Examination</Label>
                <Textarea
                  value={newNote.examination}
                  onChange={(e) => setNewNote({ ...newNote, examination: e.target.value })}
                  placeholder="Examination findings, tests performed, observations..."
                  className="neu-input min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Diagnosis</Label>
                <Textarea
                  value={newNote.diagnosis}
                  onChange={(e) => setNewNote({ ...newNote, diagnosis: e.target.value })}
                  placeholder="Clinical diagnosis based on examination..."
                  className="neu-input min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Treatment Provided</Label>
                <Textarea
                  value={newNote.treatmentProvided}
                  onChange={(e) => setNewNote({ ...newNote, treatmentProvided: e.target.value })}
                  placeholder="Procedures performed during this visit..."
                  className="neu-input min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Recommendations / Post-op Instructions</Label>
                <Textarea
                  value={newNote.recommendations}
                  onChange={(e) => setNewNote({ ...newNote, recommendations: e.target.value })}
                  placeholder="Patient instructions, medications prescribed, care advice..."
                  className="neu-input min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Follow-up Date (Optional)</Label>
                <Input
                  type="date"
                  value={newNote.followUpDate}
                  onChange={(e) => setNewNote({ ...newNote, followUpDate: e.target.value })}
                  className="neu-input"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="neu-button border-0">
                Cancel
              </Button>
              <Button onClick={handleAddNote} className="neu-button bg-primary text-primary-foreground">
                <Save className="mr-2 h-4 w-4" />
                Save Note
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Notes Timeline */}
      <div className="space-y-4">
        {notes.length === 0 ? (
          <div className="rounded-2xl bg-background p-8 text-center neu-card">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No Clinical Notes</h3>
            <p className="text-muted-foreground mb-4">Start documenting patient visits by adding clinical notes.</p>
            <Button onClick={() => setIsAddModalOpen(true)} className="neu-button bg-primary text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" />
              Add First Note
            </Button>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="rounded-2xl bg-background p-6 neu-card">
              {/* Note Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-foreground">Visit Note</h3>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(note.visitDate)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {note.dentistName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog open={editingNote?.id === note.id} onOpenChange={(open) => !open && setEditingNote(null)}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 neu-button"
                        onClick={() => setEditingNote(note)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="neu-card max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Clinical Note</DialogTitle>
                      </DialogHeader>
                      {editingNote && (
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label>Chief Complaint</Label>
                            <Textarea
                              value={editingNote.chiefComplaint}
                              onChange={(e) => setEditingNote({ ...editingNote, chiefComplaint: e.target.value })}
                              className="neu-input min-h-[80px]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Clinical Examination</Label>
                            <Textarea
                              value={editingNote.examination}
                              onChange={(e) => setEditingNote({ ...editingNote, examination: e.target.value })}
                              className="neu-input min-h-[100px]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Diagnosis</Label>
                            <Textarea
                              value={editingNote.diagnosis}
                              onChange={(e) => setEditingNote({ ...editingNote, diagnosis: e.target.value })}
                              className="neu-input min-h-[80px]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Treatment Provided</Label>
                            <Textarea
                              value={editingNote.treatmentProvided}
                              onChange={(e) => setEditingNote({ ...editingNote, treatmentProvided: e.target.value })}
                              className="neu-input min-h-[100px]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Recommendations</Label>
                            <Textarea
                              value={editingNote.recommendations}
                              onChange={(e) => setEditingNote({ ...editingNote, recommendations: e.target.value })}
                              className="neu-input min-h-[80px]"
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setEditingNote(null)} className="neu-button border-0">
                          Cancel
                        </Button>
                        <Button onClick={handleUpdateNote} className="neu-button bg-primary text-primary-foreground">
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
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 neu-button"
                    onClick={() => setExpandedNote(expandedNote === note.id ? null : note.id)}
                  >
                    {expandedNote === note.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Chief Complaint Summary */}
              <div className="mb-4 rounded-xl bg-primary/5 p-4">
                <p className="text-sm font-medium text-primary mb-1">Chief Complaint</p>
                <p className="text-foreground">{note.chiefComplaint}</p>
              </div>

              {/* Expandable Details */}
              <div
                className={cn(
                  "grid gap-4 transition-all duration-300 overflow-hidden",
                  expandedNote === note.id ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0",
                )}
              >
                {note.examination && (
                  <div className="rounded-xl bg-background p-4 neu-pressed">
                    <div className="flex items-center gap-2 mb-2">
                      <Stethoscope className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium text-foreground">Examination</p>
                    </div>
                    <p className="text-muted-foreground text-sm">{note.examination}</p>
                  </div>
                )}

                {note.diagnosis && (
                  <div className="rounded-xl bg-background p-4 neu-pressed">
                    <div className="flex items-center gap-2 mb-2">
                      <ClipboardList className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium text-foreground">Diagnosis</p>
                    </div>
                    <p className="text-muted-foreground text-sm">{note.diagnosis}</p>
                  </div>
                )}

                {note.treatmentProvided && (
                  <div className="rounded-xl bg-background p-4 neu-pressed">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium text-foreground">Treatment Provided</p>
                    </div>
                    <p className="text-muted-foreground text-sm">{note.treatmentProvided}</p>
                  </div>
                )}

                {note.recommendations && (
                  <div className="rounded-xl bg-amber-50 p-4">
                    <p className="text-sm font-medium text-amber-700 mb-1">Recommendations</p>
                    <p className="text-amber-800 text-sm">{note.recommendations}</p>
                  </div>
                )}

                {note.followUpDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Follow-up scheduled for:</span>
                    <span className="font-medium text-foreground">{formatDate(note.followUpDate)}</span>
                  </div>
                )}
              </div>

              {/* Show more/less indicator */}
              {expandedNote !== note.id && (
                <button
                  onClick={() => setExpandedNote(note.id)}
                  className="mt-2 text-sm text-primary hover:text-primary/80"
                >
                  Show full note...
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
