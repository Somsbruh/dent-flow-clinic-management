"use client"

import type React from "react"
import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Camera } from "lucide-react"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { notFound } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function EditEmployeeContent({ id }: { id: string }) {
  const router = useRouter()
  const { staffList, updateStaff } = useStore()
  const { toast } = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const employee = staffList.find((s) => s.id === id)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
    email: "",
    phone: "",
    telegramUsername: "",
    role: "",
    specialization: "",
    salary: "",
    startDate: "",
    status: "",
    systemAccess: false,
    avatar: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        fullName: employee.fullName || `${employee.firstName} ${employee.lastName}`,
        email: employee.email || "",
        phone: employee.phone || "",
        telegramUsername: employee.telegramUsername || "",
        role: employee.role,
        specialization: employee.specialization || "",
        salary: (employee.salary || 0).toString(),
        startDate: employee.startDate,
        status: employee.status,
        systemAccess: employee.systemAccess || false,
        avatar: employee.avatar || "",
      })
      setPreviewImage(employee.avatar || null)
    }
  }, [employee])

  if (!mounted) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar isOpen={false} onClose={() => {}} />
        <div className="flex-1 lg:pl-[240px]">
          <Header onMenuClick={() => {}} />
          <main className="p-4 md:p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-32 bg-muted rounded" />
              <div className="h-48 bg-muted rounded-xl" />
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!employee) {
    notFound()
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 2MB",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setPreviewImage(base64)
        setFormData({ ...formData, avatar: base64 })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const nameParts = formData.fullName.trim().split(" ")
      const firstName = nameParts[0] || formData.firstName
      const lastName = nameParts.slice(1).join(" ") || formData.lastName

      updateStaff(id, {
        firstName,
        lastName,
        fullName: formData.fullName,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        telegramUsername: formData.telegramUsername,
        role: formData.role as any,
        specialization: formData.specialization || undefined,
        salary: Number(formData.salary) || 0,
        startDate: formData.startDate,
        status: formData.status as "active" | "inactive" | "on_leave",
        systemAccess: formData.systemAccess,
        avatar: formData.avatar || undefined,
      })

      toast({
        title: "Employee updated",
        description: "The employee details have been saved successfully.",
      })

      router.push(`/staff/${id}`)
    } catch (error) {
      console.error("Failed to update staff:", error)
      toast({
        title: "Error",
        description: "Failed to update employee. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 lg:pl-[240px]">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6">
          {/* Page Header */}
          <div className="mb-6">
            <Link
              href={`/staff/${id}`}
              className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Link>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Edit Employee</h1>
            <p className="mt-1 text-muted-foreground">Update details for {formData.fullName}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <div className="neu-card rounded-xl bg-card p-4 md:p-6">
                  <h2 className="mb-4 text-lg font-semibold text-foreground">Personal Information</h2>
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        placeholder="Enter full name"
                        className="neu-input bg-background"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telegramUsername">Telegram Username *</Label>
                      <Input
                        id="telegramUsername"
                        placeholder="@username"
                        className="neu-input bg-background"
                        value={formData.telegramUsername}
                        onChange={(e) => setFormData({ ...formData, telegramUsername: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+855 123 456 789"
                        className="neu-input bg-background"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="employee@dentflow.com"
                        className="neu-input bg-background"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Employment Details */}
                <div className="neu-card rounded-xl bg-card p-4 md:p-6">
                  <h2 className="mb-4 text-lg font-semibold text-foreground">Employment Details</h2>
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="role">Role *</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value) => setFormData({ ...formData, role: value })}
                      >
                        <SelectTrigger id="role" className="neu-input bg-background">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="neu-flat bg-popover">
                          <SelectItem value="clinic_admin">Clinic Admin</SelectItem>
                          <SelectItem value="reception">Reception</SelectItem>
                          <SelectItem value="dentist">Dentist</SelectItem>
                          <SelectItem value="assistant">Assistant</SelectItem>
                          <SelectItem value="other_staff">Other Staff</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status *</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData({ ...formData, status: value })}
                      >
                        <SelectTrigger id="status" className="neu-input bg-background">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="neu-flat bg-popover">
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="on_leave">On Leave</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {formData.role === "dentist" && (
                      <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <Select
                          value={formData.specialization}
                          onValueChange={(value) => setFormData({ ...formData, specialization: value })}
                        >
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
                            <SelectItem value="Cosmetic Dentistry">Cosmetic Dentistry</SelectItem>
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
                    <div className="space-y-2 md:col-span-2">
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="space-y-1">
                          <Label htmlFor="systemAccess" className="text-sm font-medium">
                            System Access
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {formData.systemAccess
                              ? "Staff can log in to DentFlow"
                              : "Directory only. No login access."}
                          </p>
                        </div>
                        <Switch
                          id="systemAccess"
                          checked={formData.systemAccess}
                          onCheckedChange={(checked) => setFormData({ ...formData, systemAccess: checked })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Photo Upload */}
                <div className="neu-card rounded-xl bg-card p-4 md:p-6">
                  <h2 className="mb-4 text-lg font-semibold text-foreground">Profile Photo</h2>
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <Avatar className="h-32 w-32 border-4 border-primary/20">
                        <AvatarImage src={previewImage || "/placeholder.svg"} alt="Preview" />
                        <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                          {formData.firstName[0]}
                          {formData.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-colors"
                      >
                        <Camera className="h-5 w-5" />
                      </label>
                      <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Click the camera icon to upload a photo
                      <br />
                      PNG, JPG up to 2MB
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="neu-card rounded-xl bg-card p-4 md:p-6">
                  <h2 className="mb-4 text-lg font-semibold text-foreground">Actions</h2>
                  <div className="space-y-3">
                    <Button
                      type="submit"
                      className="neu-button w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      disabled={isSubmitting}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button type="button" variant="outline" className="neu-button w-full bg-background" asChild>
                      <Link href={`/staff/${id}`}>Cancel</Link>
                    </Button>
                  </div>
                  {formData.role === "dentist" && (
                    <p className="mt-4 text-xs text-muted-foreground">
                      Note: Changes to dentist status will reflect in the Reservations calendar.
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

export default function EditEmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <EditEmployeeContent id={id} />
}
