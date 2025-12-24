"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Upload } from "lucide-react"
import Link from "next/link"
import { useStore } from "@/lib/store"

export default function NewEmployeePage() {
  const router = useRouter()
  const { addStaff } = useStore()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    specialization: "",
    salary: "",
    startDate: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      addStaff({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role as "dentist" | "hygienist" | "assistant" | "receptionist" | "admin",
        specialization: formData.specialization || undefined,
        salary: Number(formData.salary) || 0,
        startDate: formData.startDate,
        status: "active",
      })

      // Navigate back to staff list
      router.push("/staff")
    } catch (error) {
      console.error("Failed to add staff:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 lg:pl-64">
        <Header />
        <main className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <Link
              href="/staff"
              className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Staff
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Add New Employee</h1>
            <p className="mt-1 text-muted-foreground">Enter the details of the new team member</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <div className="neu-card rounded-xl bg-card p-6">
                  <h2 className="mb-4 text-lg font-semibold text-foreground">Personal Information</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        placeholder="Enter first name"
                        className="neu-input bg-background"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        placeholder="Enter last name"
                        className="neu-input bg-background"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="employee@dentflow.com"
                        className="neu-input bg-background"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+1 (555) 000-0000"
                        className="neu-input bg-background"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        placeholder="Enter full address"
                        className="neu-input bg-background"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Employment Details */}
                <div className="neu-card rounded-xl bg-card p-6">
                  <h2 className="mb-4 text-lg font-semibold text-foreground">Employment Details</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="role">Role *</Label>
                      <Select onValueChange={(value) => setFormData({ ...formData, role: value })} required>
                        <SelectTrigger id="role" className="neu-input bg-background">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="neu-flat bg-popover">
                          <SelectItem value="dentist">Dentist</SelectItem>
                          <SelectItem value="hygienist">Dental Hygienist</SelectItem>
                          <SelectItem value="assistant">Dental Assistant</SelectItem>
                          <SelectItem value="receptionist">Receptionist</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {formData.role === "dentist" && (
                      <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <Select onValueChange={(value) => setFormData({ ...formData, specialization: value })}>
                          <SelectTrigger id="specialization" className="neu-input bg-background">
                            <SelectValue placeholder="Select specialization" />
                          </SelectTrigger>
                          <SelectContent className="neu-flat bg-popover">
                            <SelectItem value="General Dentistry">General Dentistry</SelectItem>
                            <SelectItem value="Orthodontics">Orthodontics</SelectItem>
                            <SelectItem value="Endodontics">Endodontics</SelectItem>
                            <SelectItem value="Periodontics">Periodontics</SelectItem>
                            <SelectItem value="Oral Surgery">Oral Surgery</SelectItem>
                            <SelectItem value="Pediatric Dentistry">Pediatric Dentistry</SelectItem>
                            <SelectItem value="Prosthodontics">Prosthodontics</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="salary">Monthly Salary</Label>
                      <Input
                        id="salary"
                        type="number"
                        placeholder="Enter salary"
                        className="neu-input bg-background"
                        value={formData.salary}
                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        className="neu-input bg-background"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="neu-card rounded-xl bg-card p-6">
                  <h2 className="mb-4 text-lg font-semibold text-foreground">Emergency Contact</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Contact Name</Label>
                      <Input
                        id="emergencyContact"
                        placeholder="Emergency contact name"
                        className="neu-input bg-background"
                        value={formData.emergencyContact}
                        onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">Contact Phone</Label>
                      <Input
                        id="emergencyPhone"
                        placeholder="+1 (555) 000-0000"
                        className="neu-input bg-background"
                        value={formData.emergencyPhone}
                        onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Photo Upload */}
                <div className="neu-card rounded-xl bg-card p-6">
                  <h2 className="mb-4 text-lg font-semibold text-foreground">Profile Photo</h2>
                  <div className="neu-pressed flex aspect-square flex-col items-center justify-center rounded-xl bg-muted/30">
                    <Upload className="mb-2 h-10 w-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="neu-card rounded-xl bg-card p-6">
                  <h2 className="mb-4 text-lg font-semibold text-foreground">Actions</h2>
                  <div className="space-y-3">
                    <Button
                      type="submit"
                      className="neu-button w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      disabled={isSubmitting}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isSubmitting ? "Saving..." : "Save Employee"}
                    </Button>
                    <Button type="button" variant="outline" className="neu-button w-full bg-background" asChild>
                      <Link href="/staff">Cancel</Link>
                    </Button>
                  </div>
                  {formData.role === "dentist" && (
                    <p className="mt-4 text-xs text-muted-foreground">
                      Note: New dentists will automatically appear in the Reservations calendar.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
