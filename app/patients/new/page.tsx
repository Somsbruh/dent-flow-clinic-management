"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, X, Plus } from "lucide-react"
import Link from "next/link"

export default function NewPatientPage() {
  const [allergies, setAllergies] = useState<string[]>([])
  const [newAllergy, setNewAllergy] = useState("")
  const [conditions, setConditions] = useState<string[]>([])
  const [newCondition, setNewCondition] = useState("")

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setAllergies([...allergies, newAllergy.trim()])
      setNewAllergy("")
    }
  }

  const removeAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index))
  }

  const addCondition = () => {
    if (newCondition.trim()) {
      setConditions([...conditions, newCondition.trim()])
      setNewCondition("")
    }
  }

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index))
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 pl-64">
        <Header />
        <main className="p-6">
          {/* Back Button */}
          <Link
            href="/patients"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Patients
          </Link>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Add New Patient</h1>
            <p className="mt-1 text-muted-foreground">Enter the patient&apos;s information to create their profile</p>
          </div>

          <form className="space-y-8">
            {/* Personal Information */}
            <div className="rounded-2xl bg-background p-6 neu-card">
              <h2 className="text-lg font-semibold text-foreground mb-6">Personal Information</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Enter first name" className="rounded-xl neu-input border-0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Enter last name" className="rounded-xl neu-input border-0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    className="rounded-xl neu-input border-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="(555) 123-4567" className="rounded-xl neu-input border-0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" className="rounded-xl neu-input border-0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select>
                    <SelectTrigger className="rounded-xl neu-button border-0">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="neu-card">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter full address"
                    className="rounded-xl neu-input border-0 min-h-[80px]"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="rounded-2xl bg-background p-6 neu-card">
              <h2 className="text-lg font-semibold text-foreground mb-6">Emergency Contact</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="emergencyName">Contact Name</Label>
                  <Input
                    id="emergencyName"
                    placeholder="Enter contact name"
                    className="rounded-xl neu-input border-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Contact Phone</Label>
                  <Input id="emergencyPhone" placeholder="(555) 123-4567" className="rounded-xl neu-input border-0" />
                </div>
              </div>
            </div>

            {/* Insurance Information */}
            <div className="rounded-2xl bg-background p-6 neu-card">
              <h2 className="text-lg font-semibold text-foreground mb-6">Insurance Information</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                  <Input
                    id="insuranceProvider"
                    placeholder="Enter insurance provider"
                    className="rounded-xl neu-input border-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insuranceNumber">Policy Number</Label>
                  <Input
                    id="insuranceNumber"
                    placeholder="Enter policy number"
                    className="rounded-xl neu-input border-0"
                  />
                </div>
              </div>
            </div>

            {/* Medical History */}
            <div className="rounded-2xl bg-background p-6 neu-card">
              <h2 className="text-lg font-semibold text-foreground mb-6">Medical History</h2>
              <div className="space-y-6">
                {/* Allergies */}
                <div className="space-y-3">
                  <Label>Allergies</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      placeholder="Enter allergy"
                      className="rounded-xl neu-input border-0"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAllergy())}
                    />
                    <Button
                      type="button"
                      onClick={addAllergy}
                      className="rounded-xl neu-button bg-primary text-primary-foreground"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {allergies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {allergies.map((allergy, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700"
                        >
                          {allergy}
                          <button
                            type="button"
                            onClick={() => removeAllergy(index)}
                            className="ml-1 hover:text-red-900"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Medical Conditions */}
                <div className="space-y-3">
                  <Label>Medical Conditions</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value)}
                      placeholder="Enter medical condition"
                      className="rounded-xl neu-input border-0"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCondition())}
                    />
                    <Button
                      type="button"
                      onClick={addCondition}
                      className="rounded-xl neu-button bg-primary text-primary-foreground"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {conditions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {conditions.map((condition, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700"
                        >
                          {condition}
                          <button
                            type="button"
                            onClick={() => removeCondition(index)}
                            className="ml-1 hover:text-amber-900"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Link href="/patients">
                <Button variant="outline" className="rounded-xl neu-button border-0 bg-transparent">
                  Cancel
                </Button>
              </Link>
              <Button className="rounded-xl neu-button bg-primary text-primary-foreground">
                <Save className="mr-2 h-4 w-4" />
                Save Patient
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
