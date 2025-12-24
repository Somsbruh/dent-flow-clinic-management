"use client"

import { useState } from "react"
import type { Patient } from "@/lib/data"
import { Calendar, User, Shield, Heart, Phone, Edit, Save, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PatientOverviewProps {
  patient: Patient
}

export function PatientOverview({ patient }: PatientOverviewProps) {
  const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
  const [isEditingMedical, setIsEditingMedical] = useState(false)
  const [isEditingInsurance, setIsEditingInsurance] = useState(false)
  const [isEditingEmergency, setIsEditingEmergency] = useState(false)

  const [allergies, setAllergies] = useState(patient.allergies)
  const [conditions, setConditions] = useState(patient.medicalConditions)
  const [newAllergy, setNewAllergy] = useState("")
  const [newCondition, setNewCondition] = useState("")

  const [insurance, setInsurance] = useState({
    provider: patient.insuranceProvider || "",
    number: patient.insuranceNumber || "",
  })

  const [emergency, setEmergency] = useState({
    contact: patient.emergencyContact,
    phone: patient.emergencyPhone,
  })

  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      setAllergies([...allergies, newAllergy.trim()])
      setNewAllergy("")
    }
  }

  const handleRemoveAllergy = (allergy: string) => {
    setAllergies(allergies.filter((a) => a !== allergy))
  }

  const handleAddCondition = () => {
    if (newCondition.trim()) {
      setConditions([...conditions, newCondition.trim()])
      setNewCondition("")
    }
  }

  const handleRemoveCondition = (condition: string) => {
    setConditions(conditions.filter((c) => c !== condition))
  }

  const visitStats = {
    totalVisits: 12,
    completedTreatments: 8,
    pendingTreatments: 2,
    totalSpent: 2450,
    nextAppointment: patient.nextAppointment,
    lastVisit: patient.lastVisit,
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Personal Information */}
      <div className="rounded-2xl bg-background p-6 neu-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="font-medium text-foreground">{patient.dateOfBirth}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Age</p>
              <p className="font-medium text-foreground">{age} years</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Gender</p>
              <p className="font-medium text-foreground capitalize">{patient.gender}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Patient Since</p>
              <p className="font-medium text-foreground">{patient.createdAt}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Address</p>
            <p className="font-medium text-foreground">{patient.address}</p>
          </div>
        </div>
      </div>

      {/* Emergency Contact - Editable */}
      <div className="rounded-2xl bg-background p-6 neu-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Emergency Contact</h2>
          </div>
          <Dialog open={isEditingEmergency} onOpenChange={setIsEditingEmergency}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="neu-button h-8 w-8 p-0">
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="neu-card">
              <DialogHeader>
                <DialogTitle>Edit Emergency Contact</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Contact Name</Label>
                  <Input
                    value={emergency.contact}
                    onChange={(e) => setEmergency({ ...emergency, contact: e.target.value })}
                    className="neu-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    value={emergency.phone}
                    onChange={(e) => setEmergency({ ...emergency, phone: e.target.value })}
                    className="neu-input"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsEditingEmergency(false)} className="neu-button border-0">
                  Cancel
                </Button>
                <Button
                  onClick={() => setIsEditingEmergency(false)}
                  className="neu-button bg-primary text-primary-foreground"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Contact Name</p>
            <p className="font-medium text-foreground">{emergency.contact}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone Number</p>
            <p className="font-medium text-foreground">{emergency.phone}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Relationship</p>
            <p className="font-medium text-foreground">Spouse</p>
          </div>
        </div>
      </div>

      {/* Insurance Information - Editable */}
      <div className="rounded-2xl bg-background p-6 neu-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Insurance Information</h2>
          </div>
          <Dialog open={isEditingInsurance} onOpenChange={setIsEditingInsurance}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="neu-button h-8 w-8 p-0">
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="neu-card">
              <DialogHeader>
                <DialogTitle>Edit Insurance Information</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Insurance Provider</Label>
                  <Select
                    value={insurance.provider}
                    onValueChange={(value) => setInsurance({ ...insurance, provider: value })}
                  >
                    <SelectTrigger className="neu-input">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent className="neu-card">
                      <SelectItem value="Blue Cross">Blue Cross</SelectItem>
                      <SelectItem value="Aetna">Aetna</SelectItem>
                      <SelectItem value="United Healthcare">United Healthcare</SelectItem>
                      <SelectItem value="Cigna">Cigna</SelectItem>
                      <SelectItem value="Delta Dental">Delta Dental</SelectItem>
                      <SelectItem value="MetLife">MetLife</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Policy Number</Label>
                  <Input
                    value={insurance.number}
                    onChange={(e) => setInsurance({ ...insurance, number: e.target.value })}
                    className="neu-input"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsEditingInsurance(false)} className="neu-button border-0">
                  Cancel
                </Button>
                <Button
                  onClick={() => setIsEditingInsurance(false)}
                  className="neu-button bg-primary text-primary-foreground"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        {insurance.provider ? (
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Provider</p>
              <p className="font-medium text-foreground">{insurance.provider}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Policy Number</p>
              <p className="font-medium text-foreground">{insurance.number}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Coverage Status</p>
              <span className="inline-block mt-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                Active
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-3">No insurance information on file.</p>
            <Button onClick={() => setIsEditingInsurance(true)} variant="outline" className="neu-button border-0">
              <Plus className="mr-2 h-4 w-4" />
              Add Insurance
            </Button>
          </div>
        )}
      </div>

      {/* Medical History - Editable with CRUD */}
      <div className="rounded-2xl bg-background p-6 neu-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Medical History</h2>
          </div>
          <Dialog open={isEditingMedical} onOpenChange={setIsEditingMedical}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="neu-button h-8 w-8 p-0">
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="neu-card max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit Medical History</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                {/* Allergies Section */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Allergies</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      placeholder="Add allergy..."
                      className="neu-input"
                      onKeyDown={(e) => e.key === "Enter" && handleAddAllergy()}
                    />
                    <Button onClick={handleAddAllergy} className="neu-button bg-primary text-primary-foreground">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allergies.map((allergy) => (
                      <span
                        key={allergy}
                        className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700"
                      >
                        {allergy}
                        <button onClick={() => handleRemoveAllergy(allergy)} className="hover:text-red-900">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    {allergies.length === 0 && (
                      <span className="text-sm text-muted-foreground">No known allergies</span>
                    )}
                  </div>
                </div>

                {/* Medical Conditions Section */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Medical Conditions</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value)}
                      placeholder="Add condition..."
                      className="neu-input"
                      onKeyDown={(e) => e.key === "Enter" && handleAddCondition()}
                    />
                    <Button onClick={handleAddCondition} className="neu-button bg-primary text-primary-foreground">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {conditions.map((condition) => (
                      <span
                        key={condition}
                        className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700"
                      >
                        {condition}
                        <button onClick={() => handleRemoveCondition(condition)} className="hover:text-amber-900">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    {conditions.length === 0 && (
                      <span className="text-sm text-muted-foreground">No medical conditions</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsEditingMedical(false)} className="neu-button border-0">
                  Cancel
                </Button>
                <Button
                  onClick={() => setIsEditingMedical(false)}
                  className="neu-button bg-primary text-primary-foreground"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Allergies</p>
            {allergies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {allergies.map((allergy) => (
                  <span key={allergy} className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                    {allergy}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-foreground">No known allergies</p>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Medical Conditions</p>
            {conditions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {conditions.map((condition) => (
                  <span
                    key={condition}
                    className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700"
                  >
                    {condition}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-foreground">No medical conditions on record</p>
            )}
          </div>
        </div>
      </div>

      {/* Visit Summary */}
      <div className="lg:col-span-2 rounded-2xl bg-background p-6 neu-card">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Visit Summary</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-xl bg-primary/5 p-4 text-center neu-button">
            <p className="text-3xl font-bold text-primary">{visitStats.totalVisits}</p>
            <p className="text-sm text-muted-foreground">Total Visits</p>
          </div>
          <div className="rounded-xl bg-green-50 p-4 text-center neu-button">
            <p className="text-3xl font-bold text-green-600">{visitStats.completedTreatments}</p>
            <p className="text-sm text-muted-foreground">Treatments Completed</p>
          </div>
          <div className="rounded-xl bg-amber-50 p-4 text-center neu-button">
            <p className="text-3xl font-bold text-amber-600">{visitStats.pendingTreatments}</p>
            <p className="text-sm text-muted-foreground">Pending Treatments</p>
          </div>
          <div className="rounded-xl bg-blue-50 p-4 text-center neu-button">
            <p className="text-3xl font-bold text-blue-600">${visitStats.totalSpent.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Spent</p>
          </div>
        </div>

        {/* Upcoming/Recent Visit Info */}
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-background p-4 neu-pressed">
            <p className="text-sm text-muted-foreground mb-1">Last Visit</p>
            <p className="font-semibold text-foreground">{visitStats.lastVisit || "No previous visits"}</p>
          </div>
          <div className="rounded-xl bg-background p-4 neu-pressed">
            <p className="text-sm text-muted-foreground mb-1">Next Appointment</p>
            <p className="font-semibold text-foreground">{visitStats.nextAppointment || "No upcoming appointments"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
