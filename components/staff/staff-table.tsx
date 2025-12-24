"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Eye,
  Edit,
  Send,
  Lock,
  ShieldOff,
  ShieldCheck,
  UserX,
  UserCheck,
  Trash2,
  Filter,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

interface StaffTableProps {
  searchQuery: string
}

export function StaffTable({ searchQuery }: StaffTableProps) {
  const router = useRouter()
  const { staffList, deleteStaff, updateStaff } = useStore()
  const { toast } = useToast()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [accessFilter, setAccessFilter] = useState<string>("all")

  const filteredEmployees = staffList.filter((emp) => {
    // Search filter
    const searchMatch =
      emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.telegramUsername.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase())

    // Role filter
    const roleMatch = roleFilter === "all" || emp.role === roleFilter

    // Status filter
    const statusMatch = statusFilter === "all" || emp.status === statusFilter

    // Access filter
    const accessMatch =
      accessFilter === "all" ||
      (accessFilter === "enabled" && emp.systemAccess) ||
      (accessFilter === "disabled" && !emp.systemAccess)

    return searchMatch && roleMatch && statusMatch && accessMatch
  })

  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      clinic_admin: "Clinic Admin",
      reception: "Reception",
      dentist: "Dentist",
      assistant: "Assistant",
      other_staff: "Other Staff",
    }
    return roleMap[role] || role
  }

  const handleDelete = () => {
    if (deleteId) {
      deleteStaff(deleteId)
      setDeleteId(null)
      toast({
        title: "Employee deleted",
        description: "The employee has been removed from the system.",
      })
    }
  }

  const handleToggleAccess = (id: string, currentAccess: boolean) => {
    updateStaff(id, { systemAccess: !currentAccess })
    toast({
      title: currentAccess ? "Access disabled" : "Access enabled",
      description: currentAccess
        ? "The employee can no longer log in to the system."
        : "The employee can now log in to the system.",
    })
  }

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active"
    updateStaff(id, { status: newStatus })
    toast({
      title: newStatus === "active" ? "Employee activated" : "Employee deactivated",
      description: newStatus === "active" ? "The employee is now active." : "The employee has been deactivated.",
    })
  }

  const handleResendTelegram = (name: string, telegram: string) => {
    toast({
      title: "Setup link sent",
      description: `Login setup link sent to ${telegram}`,
    })
  }

  const handleResetPassword = (name: string) => {
    toast({
      title: "Password reset initiated",
      description: `A password reset link has been sent to ${name}'s Telegram.`,
    })
  }

  const handleViewProfile = (id: string) => {
    router.push(`/staff/${id}`)
  }

  const handleEditDetails = (id: string) => {
    router.push(`/staff/${id}/edit`)
  }

  return (
    <>
      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filters:</span>
        </div>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[120px] sm:w-[140px] h-9 text-xs sm:text-sm">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="clinic_admin">Clinic Admin</SelectItem>
            <SelectItem value="reception">Reception</SelectItem>
            <SelectItem value="dentist">Dentist</SelectItem>
            <SelectItem value="assistant">Assistant</SelectItem>
            <SelectItem value="other_staff">Other Staff</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[100px] sm:w-[130px] h-9 text-xs sm:text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select value={accessFilter} onValueChange={setAccessFilter}>
          <SelectTrigger className="w-[100px] sm:w-[130px] h-9 text-xs sm:text-sm">
            <SelectValue placeholder="Access" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Access</SelectItem>
            <SelectItem value="enabled">Enabled</SelectItem>
            <SelectItem value="disabled">No Access</SelectItem>
          </SelectContent>
        </Select>

        {(roleFilter !== "all" || statusFilter !== "all" || accessFilter !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => {
              setRoleFilter("all")
              setStatusFilter("all")
              setAccessFilter("all")
            }}
          >
            Clear
          </Button>
        )}
      </div>

      <div className="neu-card overflow-hidden rounded-xl bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">
                  Employee
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">
                  Role
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground hidden md:table-cell">
                  Telegram
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground hidden lg:table-cell">
                  Phone
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">
                  Access
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground hidden xl:table-cell">
                  Start Date
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    {searchQuery || roleFilter !== "all" || statusFilter !== "all" || accessFilter !== "all"
                      ? "No employees match your search criteria."
                      : 'No employees found. Click "Add Employee" to add your first team member.'}
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer"
                    onClick={() => handleViewProfile(employee.id)}
                  >
                    <td className="px-3 sm:px-4 py-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                          <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.fullName} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs sm:text-sm">
                            {employee.firstName[0]}
                            {employee.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">
                            {employee.role === "dentist" ? "Dr. " : ""}
                            {employee.fullName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate md:hidden">
                            {employee.telegramUsername}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <div>
                        <p className="text-xs sm:text-sm text-foreground">{getRoleDisplay(employee.role)}</p>
                        {employee.specialization && (
                          <p className="text-xs text-muted-foreground hidden sm:block">{employee.specialization}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-primary font-medium hidden md:table-cell">
                      {employee.telegramUsername}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-muted-foreground hidden lg:table-cell">
                      {employee.phone || "-"}
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <Badge
                        variant={employee.systemAccess ? "default" : "secondary"}
                        className={`text-xs ${
                          employee.systemAccess
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {employee.systemAccess ? "Enabled" : "No Access"}
                      </Badge>
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <Badge
                        variant={employee.status === "active" ? "default" : "secondary"}
                        className={`text-xs ${
                          employee.status === "active"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-red-100 text-red-700 hover:bg-red-100"
                        }`}
                      >
                        {employee.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-muted-foreground hidden xl:table-cell">
                      {new Date(employee.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-3 sm:px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="neu-flat bg-popover">
                          <DropdownMenuItem onClick={() => handleViewProfile(employee.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditDetails(employee.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Details
                          </DropdownMenuItem>

                          {employee.systemAccess && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleResendTelegram(employee.fullName, employee.telegramUsername)}
                              >
                                <Send className="mr-2 h-4 w-4" />
                                Resend Telegram Setup
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleResetPassword(employee.fullName)}>
                                <Lock className="mr-2 h-4 w-4" />
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleAccess(employee.id, employee.systemAccess)}>
                                <ShieldOff className="mr-2 h-4 w-4" />
                                Disable Access
                              </DropdownMenuItem>
                            </>
                          )}

                          {!employee.systemAccess && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleToggleAccess(employee.id, employee.systemAccess)}>
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                Enable Access
                              </DropdownMenuItem>
                            </>
                          )}

                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleToggleStatus(employee.id, employee.status)}>
                            {employee.status === "active" ? (
                              <>
                                <UserX className="mr-2 h-4 w-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => setDeleteId(employee.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Employee
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="neu-card bg-card max-w-[90vw] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this employee? This action cannot be undone. If this is a dentist, they
              will also be removed from the reservation calendar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="neu-button bg-background">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
