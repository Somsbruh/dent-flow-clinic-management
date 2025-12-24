"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useStore } from "@/lib/store"
import { defaultPermissionsByRole, type Staff } from "@/lib/data"
import {
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  User,
  Shield,
  Calendar,
  Send,
  Lock,
  AlertCircle,
  Camera,
  X,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const countryCodes = [
  { code: "+855", country: "Cambodia", flag: "🇰🇭" },
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+66", country: "Thailand", flag: "🇹🇭" },
  { code: "+84", country: "Vietnam", flag: "🇻🇳" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+63", country: "Philippines", flag: "🇵🇭" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
]

interface AddEmployeeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Step = 1 | 2 | 3

const roles = [
  { value: "clinic_admin", label: "Clinic Admin" },
  { value: "reception", label: "Reception" },
  { value: "dentist", label: "Dentist" },
  { value: "assistant", label: "Assistant" },
  { value: "other_staff", label: "Other Staff" },
]

const specializations = [
  "General Dentistry",
  "Endodontics",
  "Orthodontics",
  "Periodontics",
  "Prosthodontics",
  "Oral Surgery",
  "Pediatric Dentistry",
  "Cosmetic Dentistry",
]

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function AddEmployeeModal({ open, onOpenChange }: AddEmployeeModalProps) {
  const { addStaff, isPhoneUnique, isTelegramUnique } = useStore()
  const { toast } = useToast()
  const [step, setStep] = useState<Step>(1)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Step 1 - Staff Details
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState<Staff["role"]>("reception")
  const [telegramUsername, setTelegramUsername] = useState("")
  const [phone, setPhone] = useState("")
  const [countryCode, setCountryCode] = useState("+855")
  const [countryCodeOpen, setCountryCodeOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"active" | "inactive">("active")
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0])
  const [systemAccess, setSystemAccess] = useState(true)
  const [profilePicture, setProfilePicture] = useState<string | null>(null)

  // Step 2 - Access Setup
  const [sendTelegramSetup, setSendTelegramSetup] = useState(true)
  const [manualPassword, setManualPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [requirePasswordChange, setRequirePasswordChange] = useState(true)
  const [permissions, setPermissions] = useState(defaultPermissionsByRole.reception)
  const [showAdvancedPermissions, setShowAdvancedPermissions] = useState(false)
  const [specialization, setSpecialization] = useState("")
  const [canBeAssignedAppointments, setCanBeAssignedAppointments] = useState(true)

  // Step 3 - Schedule (dentist only)
  const [workingDays, setWorkingDays] = useState([1, 2, 3, 4, 5, 6])
  const [workingHoursStart, setWorkingHoursStart] = useState("09:00")
  const [workingHoursEnd, setWorkingHoursEnd] = useState("17:00")
  const [hasSplitShift, setHasSplitShift] = useState(false)
  const [splitShiftStart, setSplitShiftStart] = useState("14:00")
  const [splitShiftEnd, setSplitShiftEnd] = useState("18:00")
  const [breakTimeEnabled, setBreakTimeEnabled] = useState(true)
  const [breakTimeStart, setBreakTimeStart] = useState("12:00")
  const [breakTimeEnd, setBreakTimeEnd] = useState("13:00")

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setStep(1)
      setFullName("")
      setRole("reception")
      setTelegramUsername("")
      setPhone("")
      setCountryCode("+855")
      setCountryCodeOpen(false)
      setEmail("")
      setStatus("active")
      setStartDate(new Date().toISOString().split("T")[0])
      setSystemAccess(true)
      setProfilePicture(null)
      setSendTelegramSetup(true)
      setManualPassword("")
      setConfirmPassword("")
      setRequirePasswordChange(true)
      setPermissions(defaultPermissionsByRole.reception)
      setShowAdvancedPermissions(false)
      setSpecialization("")
      setCanBeAssignedAppointments(true)
      setWorkingDays([1, 2, 3, 4, 5, 6])
      setWorkingHoursStart("09:00")
      setWorkingHoursEnd("17:00")
      setHasSplitShift(false)
      setBreakTimeEnabled(true)
      setBreakTimeStart("12:00")
      setBreakTimeEnd("13:00")
      setErrors({})
    }
  }, [open])

  // Update system access default based on role
  useEffect(() => {
    if (role === "other_staff") {
      setSystemAccess(false)
    } else {
      setSystemAccess(true)
    }
    setPermissions(defaultPermissionsByRole[role] || defaultPermissionsByRole.other_staff)
  }, [role])

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setProfilePicture(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!telegramUsername.trim()) {
      newErrors.telegramUsername = "Telegram username is required"
    } else if (!telegramUsername.startsWith("@")) {
      newErrors.telegramUsername = "Telegram username must start with @"
    } else if (!isTelegramUnique(telegramUsername)) {
      newErrors.telegramUsername = "This Telegram username already exists"
    }

    if (!startDate) {
      newErrors.startDate = "Start date is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}

    if (systemAccess && !phone.trim()) {
      newErrors.phone = "Phone number is required for system access"
    } else if (phone && !isPhoneUnique(`${countryCode}${phone}`)) {
      newErrors.phone = "This phone number already exists"
    }

    if (!sendTelegramSetup) {
      if (!manualPassword) {
        newErrors.manualPassword = "Password is required"
      } else if (manualPassword.length < 8) {
        newErrors.manualPassword = "Password must be at least 8 characters"
      }

      if (manualPassword !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
        if (systemAccess) {
          setStep(2)
        } else {
          handleCreate()
        }
      }
    } else if (step === 2) {
      if (validateStep2()) {
        if (role === "dentist" && canBeAssignedAppointments) {
          setStep(3)
        } else {
          handleCreate()
        }
      }
    } else if (step === 3) {
      handleCreate()
    }
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
    } else if (step === 3) {
      setStep(2)
    }
  }

  const handleCreate = () => {
    const nameParts = fullName.trim().split(" ")
    const firstName = nameParts[0] || ""
    const lastName = nameParts.slice(1).join(" ") || ""

    const fullPhone = phone ? `${countryCode}${phone}` : undefined

    const newStaff: Omit<Staff, "id"> = {
      firstName,
      lastName,
      fullName: fullName.trim(),
      email: email || undefined,
      phone: fullPhone,
      telegramUsername: telegramUsername.startsWith("@") ? telegramUsername : `@${telegramUsername}`,
      role,
      specialization: role === "dentist" ? specialization : undefined,
      salary: 0,
      startDate,
      status,
      systemAccess,
      permissions: systemAccess ? permissions : undefined,
      password: !sendTelegramSetup ? manualPassword : undefined,
      requirePasswordChange: !sendTelegramSetup ? requirePasswordChange : undefined,
      canBeAssignedAppointments: role === "dentist" ? canBeAssignedAppointments : undefined,
      workingDays: role === "dentist" && canBeAssignedAppointments ? workingDays : undefined,
      workingHoursStart: role === "dentist" && canBeAssignedAppointments ? workingHoursStart : undefined,
      workingHoursEnd: role === "dentist" && canBeAssignedAppointments ? workingHoursEnd : undefined,
      hasSplitShift: role === "dentist" && canBeAssignedAppointments ? hasSplitShift : undefined,
      splitShiftStart: role === "dentist" && canBeAssignedAppointments && hasSplitShift ? splitShiftStart : undefined,
      splitShiftEnd: role === "dentist" && canBeAssignedAppointments && hasSplitShift ? splitShiftEnd : undefined,
      breakTimeEnabled: role === "dentist" && canBeAssignedAppointments ? breakTimeEnabled : undefined,
      breakTimeStart: role === "dentist" && canBeAssignedAppointments && breakTimeEnabled ? breakTimeStart : undefined,
      breakTimeEnd: role === "dentist" && canBeAssignedAppointments && breakTimeEnabled ? breakTimeEnd : undefined,
      avatar: profilePicture || undefined,
    }

    addStaff(newStaff)

    toast({
      title: "Employee added successfully",
      description:
        systemAccess && sendTelegramSetup
          ? `Setup link sent to ${telegramUsername}`
          : `${fullName} has been added to the staff directory`,
    })

    onOpenChange(false)
  }

  const toggleWorkingDay = (day: number) => {
    if (workingDays.includes(day)) {
      setWorkingDays(workingDays.filter((d) => d !== day))
    } else {
      setWorkingDays([...workingDays, day].sort())
    }
  }

  const togglePermission = (key: keyof NonNullable<Staff["permissions"]>) => {
    if (permissions) {
      setPermissions({
        ...permissions,
        [key]: !permissions[key],
      })
    }
  }

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Staff Details"
      case 2:
        return "Access Setup"
      case 3:
        return "Schedule"
    }
  }

  const getTotalSteps = () => {
    if (!systemAccess) return 1
    if (role === "dentist" && canBeAssignedAppointments) return 3
    return 2
  }

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!fullName.trim()) return "?"
    const parts = fullName.trim().split(" ")
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?"
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">Add Employee</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Add staff to the directory and optionally enable system access.
          </p>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 py-4">
          {[1, 2, 3].slice(0, getTotalSteps()).map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                  step === s
                    ? "bg-primary text-primary-foreground"
                    : step > s
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {step > s ? (
                  <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : s === 1 ? (
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : s === 2 ? (
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </div>
              {s < getTotalSteps() && (
                <div className={cn("w-8 sm:w-12 h-0.5", step > s ? "bg-green-500" : "bg-muted")} />
              )}
            </div>
          ))}
        </div>

        <div className="text-center mb-4">
          <p className="text-xs text-muted-foreground">STEP {step}</p>
          <p className="font-medium">{getStepTitle()}</p>
        </div>

        {/* Step 1: Staff Details */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex flex-col items-center mb-4">
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-primary/20">
                  <AvatarImage src={profilePicture || undefined} alt="Profile" />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">{getInitials()}</AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                </button>
                {profilePicture && (
                  <button
                    type="button"
                    onClick={() => setProfilePicture(null)}
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureUpload}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Profile photo (optional)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.fullName && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.fullName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Staff["role"])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telegram">Telegram Username *</Label>
              <Input
                id="telegram"
                value={telegramUsername}
                onChange={(e) => {
                  let value = e.target.value
                  if (value && !value.startsWith("@")) {
                    value = "@" + value
                  }
                  setTelegramUsername(value)
                }}
                placeholder="@username"
                className={errors.telegramUsername ? "border-red-500" : ""}
              />
              {errors.telegramUsername && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.telegramUsername}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex items-center">
                <Popover open={countryCodeOpen} onOpenChange={setCountryCodeOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded-r-none border-r-0 bg-transparent min-w-[90px]"
                      onClick={() => setCountryCodeOpen(true)}
                    >
                      {countryCodes.find((c) => c.code === countryCode)?.flag} {countryCode}
                      <ChevronDown className="ml-1 h-3 w-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[220px] p-0">
                    <Command>
                      <CommandInput placeholder="Search country..." />
                      <CommandList>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                          {countryCodes.map((cc) => (
                            <CommandItem
                              key={cc.code}
                              onSelect={() => {
                                setCountryCode(cc.code)
                                setCountryCodeOpen(false)
                              }}
                            >
                              <span className="mr-2">{cc.flag}</span>
                              <span className="flex-1 truncate">{cc.country}</span>
                              <span className="text-muted-foreground">{cc.code}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter phone number"
                  className={cn("flex-1 rounded-l-none", errors.phone ? "border-red-500" : "")}
                />
              </div>
              <p className="text-xs text-muted-foreground">Recommended for future clock-in/out and account recovery.</p>
              {errors.phone && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as "active" | "inactive")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={errors.startDate ? "border-red-500" : ""}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="systemAccess" className="text-sm font-medium">
                  System Access
                </Label>
                <p className="text-xs text-muted-foreground">
                  {systemAccess ? "Staff can log in to DentFlow" : "Directory only. No login access."}
                </p>
              </div>
              <Switch id="systemAccess" checked={systemAccess} onCheckedChange={setSystemAccess} />
            </div>
          </div>
        )}

        {/* Step 2: Access Setup */}
        {step === 2 && (
          <div className="space-y-4">
            {/* Phone number with country code */}
            <div className="space-y-2">
              <Label htmlFor="phone2">Phone Number *</Label>
              <div className="flex items-center">
                <Popover open={countryCodeOpen} onOpenChange={setCountryCodeOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded-r-none border-r-0 bg-transparent min-w-[90px]"
                      onClick={() => setCountryCodeOpen(true)}
                    >
                      {countryCodes.find((c) => c.code === countryCode)?.flag} {countryCode}
                      <ChevronDown className="ml-1 h-3 w-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[220px] p-0">
                    <Command>
                      <CommandInput placeholder="Search country..." />
                      <CommandList>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                          {countryCodes.map((cc) => (
                            <CommandItem
                              key={cc.code}
                              onSelect={() => {
                                setCountryCode(cc.code)
                                setCountryCodeOpen(false)
                              }}
                            >
                              <span className="mr-2">{cc.flag}</span>
                              <span className="flex-1 truncate">{cc.country}</span>
                              <span className="text-muted-foreground">{cc.code}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Input
                  id="phone2"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter phone number"
                  className={cn("flex-1 rounded-l-none", errors.phone ? "border-red-500" : "")}
                />
              </div>
              <p className="text-xs text-muted-foreground">Required for system login and account recovery.</p>
              {errors.phone && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Login Method Card */}
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Send className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Telegram Login Setup</h4>
                  <p className="text-xs text-muted-foreground">Send setup link via Telegram bot</p>
                </div>
                <Switch checked={sendTelegramSetup} onCheckedChange={setSendTelegramSetup} />
              </div>
            </div>

            {!sendTelegramSetup && (
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Lock className="h-4 w-4" />
                  Manual Password Setup
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={manualPassword}
                    onChange={(e) => setManualPassword(e.target.value)}
                    placeholder="Enter password"
                    className={errors.manualPassword ? "border-red-500" : ""}
                  />
                  {errors.manualPassword && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.manualPassword}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="requirePasswordChange"
                    checked={requirePasswordChange}
                    onCheckedChange={(c) => setRequirePasswordChange(c as boolean)}
                  />
                  <Label htmlFor="requirePasswordChange" className="text-sm">
                    Require password change on first login
                  </Label>
                </div>
              </div>
            )}

            {/* Dentist specific - Specialization */}
            {role === "dentist" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Select value={specialization} onValueChange={setSpecialization}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Assignable to Appointments</Label>
                    <p className="text-xs text-muted-foreground">Show this dentist in the reservation calendar</p>
                  </div>
                  <Switch checked={canBeAssignedAppointments} onCheckedChange={setCanBeAssignedAppointments} />
                </div>
              </div>
            )}

            {/* Permissions */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowAdvancedPermissions(!showAdvancedPermissions)}
                className="flex items-center gap-2 text-sm font-medium text-primary"
              >
                <ChevronRight className={cn("h-4 w-4 transition-transform", showAdvancedPermissions && "rotate-90")} />
                Advanced Permissions
              </button>

              {showAdvancedPermissions && permissions && (
                <div className="grid grid-cols-2 gap-2 p-4 border rounded-lg">
                  {Object.entries(permissions).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <Checkbox
                        id={key}
                        checked={value}
                        onCheckedChange={() => togglePermission(key as keyof NonNullable<Staff["permissions"]>)}
                      />
                      <Label htmlFor={key} className="text-xs capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Schedule (Dentist Only) */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Working Days</Label>
              <div className="flex flex-wrap gap-2">
                {dayNames.map((day, index) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleWorkingDay(index)}
                    className={cn(
                      "w-10 h-10 sm:w-12 sm:h-12 rounded-lg text-xs sm:text-sm font-medium transition-colors",
                      workingDays.includes(index)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80",
                    )}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workStart">Work Start</Label>
                <Input
                  id="workStart"
                  type="time"
                  value={workingHoursStart}
                  onChange={(e) => setWorkingHoursStart(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workEnd">Work End</Label>
                <Input
                  id="workEnd"
                  type="time"
                  value={workingHoursEnd}
                  onChange={(e) => setWorkingHoursEnd(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Break Time</Label>
                <p className="text-xs text-muted-foreground">Enable lunch/break time</p>
              </div>
              <Switch checked={breakTimeEnabled} onCheckedChange={setBreakTimeEnabled} />
            </div>

            {breakTimeEnabled && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="breakStart">Break Start</Label>
                  <Input
                    id="breakStart"
                    type="time"
                    value={breakTimeStart}
                    onChange={(e) => setBreakTimeStart(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="breakEnd">Break End</Label>
                  <Input
                    id="breakEnd"
                    type="time"
                    value={breakTimeEnd}
                    onChange={(e) => setBreakTimeEnd(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Split Shift</Label>
                <p className="text-xs text-muted-foreground">Enable split/second shift</p>
              </div>
              <Switch checked={hasSplitShift} onCheckedChange={setHasSplitShift} />
            </div>

            {hasSplitShift && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="splitStart">2nd Shift Start</Label>
                  <Input
                    id="splitStart"
                    type="time"
                    value={splitShiftStart}
                    onChange={(e) => setSplitShiftStart(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="splitEnd">2nd Shift End</Label>
                  <Input
                    id="splitEnd"
                    type="time"
                    value={splitShiftEnd}
                    onChange={(e) => setSplitShiftEnd(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={handleBack}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          )}

          <Button onClick={handleNext}>
            {step === getTotalSteps() ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Create Employee
              </>
            ) : (
              <>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
