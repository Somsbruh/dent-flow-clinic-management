"use client"

import { use, useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Phone, Calendar, Clock, DollarSign, FileText, User, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { notFound } from "next/navigation"

function EmployeeProfileContent({ id }: { id: string }) {
  const { staffList, appointmentList } = useStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const employee = staffList.find((s) => s.id === id)

  if (!mounted) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar isOpen={false} onClose={() => { }} />
        <div className="flex-1 lg:pl-[240px]">
          <Header onMenuClick={() => { }} />
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

  const fullName = `${employee.role === "dentist" ? "Dr. " : ""}${employee.fullName || `${employee.firstName} ${employee.lastName}`}`

  // Get today's appointments for this staff member (if dentist)
  const todayAppointments =
    employee.role === "dentist"
      ? appointmentList.filter((a) => a.dentistId === employee.id && a.date === new Date().toISOString().split("T")[0])
      : []

  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      clinic_admin: "Clinic Admin",
      reception: "Reception",
      dentist: "Dentist",
      assistant: "Assistant",
      other_staff: "Other Staff",
      hygienist: "Dental Hygienist",
      receptionist: "Receptionist",
      admin: "Admin",
    }
    return roleMap[role] || role
  }

  const attendanceHistory = [
    { date: "Dec 10, 2024", clockIn: "08:45 AM", clockOut: "05:30 PM", hours: "8h 45m", status: "Present" },
    { date: "Dec 9, 2024", clockIn: "09:00 AM", clockOut: "06:00 PM", hours: "9h 00m", status: "Present" },
    { date: "Dec 8, 2024", clockIn: "08:30 AM", clockOut: "05:15 PM", hours: "8h 45m", status: "Present" },
    { date: "Dec 7, 2024", clockIn: "-", clockOut: "-", hours: "-", status: "Weekend" },
    { date: "Dec 6, 2024", clockIn: "09:15 AM", clockOut: "05:45 PM", hours: "8h 30m", status: "Late" },
  ]

  const payrollHistory = [
    {
      month: "December 2024",
      base: employee.salary || 0,
      bonus: 1500,
      deductions: 850,
      net: (employee.salary || 0) + 650,
      status: "Pending",
    },
    {
      month: "November 2024",
      base: employee.salary || 0,
      bonus: 1200,
      deductions: 820,
      net: (employee.salary || 0) + 380,
      status: "Paid",
    },
    {
      month: "October 2024",
      base: employee.salary || 0,
      bonus: 1000,
      deductions: 800,
      net: (employee.salary || 0) + 200,
      status: "Paid",
    },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 lg:pl-[240px]">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6">
          {/* Back Button */}
          <Link
            href="/staff"
            className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Staff
          </Link>

          {/* Profile Header */}
          <div className="neu-card mb-6 rounded-xl bg-card p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-primary/20">
                  <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={fullName} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl md:text-2xl">
                    {employee.firstName[0]}
                    {employee.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                  <h1 className="text-xl md:text-2xl font-bold text-foreground">{fullName}</h1>
                  <p className="text-muted-foreground">
                    {getRoleDisplay(employee.role)}
                    {employee.specialization ? ` - ${employee.specialization}` : ""}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <Badge
                      className={
                        employee.status === "active"
                          ? "bg-green-100 text-green-700"
                          : employee.status === "on_leave"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                      }
                    >
                      {employee.status === "active"
                        ? "Active"
                        : employee.status === "on_leave"
                          ? "On Leave"
                          : "Inactive"}
                    </Badge>
                    {employee.systemAccess && <Badge className="bg-blue-100 text-blue-700">System Access</Badge>}
                    <span className="text-xs text-muted-foreground">ID: {employee.id}</span>
                    {employee.role === "dentist" && (
                      <span className="text-xs text-primary">{todayAppointments.length} appointments today</span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                className="neu-button bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
                asChild
              >
                <Link href={`/staff/${employee.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
            </div>

            {/* Contact Info */}
            <div className="mt-6 grid gap-4 border-t border-border pt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <MessageCircle className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Telegram</p>
                  <p className="text-sm font-medium text-foreground truncate">
                    {employee.telegramUsername || "Not set"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium text-foreground">{employee.phone || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Start Date</p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(employee.startDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Monthly Salary</p>
                  <p className="text-sm font-medium text-foreground">${(employee.salary || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="attendance">
            <TabsList className="neu-flat bg-background p-1 flex-wrap h-auto w-full overflow-x-auto">
              <TabsTrigger
                value="attendance"
                className="data-[state=active]:neu-pressed data-[state=active]:bg-primary/10 text-xs sm:text-sm"
              >
                <Clock className="mr-1 sm:mr-2 h-4 w-4" />
                <span className="hidden xs:inline">Attendance</span>
                <span className="xs:hidden">Attend.</span>
              </TabsTrigger>
              <TabsTrigger
                value="payroll"
                className="data-[state=active]:neu-pressed data-[state=active]:bg-primary/10 text-xs sm:text-sm"
              >
                <DollarSign className="mr-1 sm:mr-2 h-4 w-4" />
                Payroll
              </TabsTrigger>
              {employee.role === "dentist" && (
                <TabsTrigger
                  value="appointments"
                  className="data-[state=active]:neu-pressed data-[state=active]:bg-primary/10 text-xs sm:text-sm"
                >
                  <User className="mr-1 sm:mr-2 h-4 w-4" />
                  <span className="hidden xs:inline">Appointments</span>
                  <span className="xs:hidden">Appts</span>
                </TabsTrigger>
              )}
              <TabsTrigger
                value="documents"
                className="data-[state=active]:neu-pressed data-[state=active]:bg-primary/10 text-xs sm:text-sm"
              >
                <FileText className="mr-1 sm:mr-2 h-4 w-4" />
                Docs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="attendance" className="mt-6">
              <div className="neu-card overflow-hidden rounded-xl bg-card">
                <div className="border-b border-border p-4">
                  <h3 className="font-semibold text-foreground">Attendance History</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[500px]">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Clock In</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Clock Out</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Hours</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceHistory.map((record, idx) => (
                        <tr key={idx} className="border-b border-border last:border-0">
                          <td className="px-4 py-3 text-sm text-foreground">{record.date}</td>
                          <td className="px-4 py-3 text-sm text-foreground">{record.clockIn}</td>
                          <td className="px-4 py-3 text-sm text-foreground">{record.clockOut}</td>
                          <td className="px-4 py-3 text-sm text-foreground">{record.hours}</td>
                          <td className="px-4 py-3">
                            <Badge
                              className={
                                record.status === "Present"
                                  ? "bg-green-100 text-green-700"
                                  : record.status === "Late"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-muted text-muted-foreground"
                              }
                            >
                              {record.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payroll" className="mt-6">
              <div className="neu-card overflow-hidden rounded-xl bg-card">
                <div className="border-b border-border p-4">
                  <h3 className="font-semibold text-foreground">Payroll History</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Month</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Base</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Bonus</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Deductions</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Net Pay</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payrollHistory.map((record, idx) => (
                        <tr key={idx} className="border-b border-border last:border-0">
                          <td className="px-4 py-3 text-sm text-foreground">{record.month}</td>
                          <td className="px-4 py-3 text-sm text-foreground">${record.base.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-green-600">+${record.bonus.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-red-500">-${record.deductions.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-foreground">
                            ${record.net.toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              className={
                                record.status === "Paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                              }
                            >
                              {record.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {employee.role === "dentist" && (
              <TabsContent value="appointments" className="mt-6">
                <div className="neu-card rounded-xl bg-card p-4 md:p-6">
                  <h3 className="font-semibold text-foreground mb-4">Today's Appointments</h3>
                  {todayAppointments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No appointments scheduled for today.</p>
                  ) : (
                    <div className="space-y-3">
                      {todayAppointments.map((apt) => (
                        <div
                          key={apt.id}
                          className="neu-flat rounded-lg bg-background p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div>
                            <p className="font-medium text-foreground">{apt.patientName}</p>
                            <p className="text-sm text-muted-foreground">
                              {apt.treatment} - {apt.time}
                            </p>
                          </div>
                          <Badge
                            className={
                              apt.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : apt.status === "in_progress"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-blue-100 text-blue-700"
                            }
                          >
                            {apt.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button className="mt-4 w-full neu-button bg-background" asChild>
                    <Link href="/reservations">View All in Calendar</Link>
                  </Button>
                </div>
              </TabsContent>
            )}

            <TabsContent value="documents" className="mt-6">
              <div className="neu-card rounded-xl bg-card p-4 md:p-6">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    "Employment Contract",
                    "ID Verification",
                    employee.role === "dentist" ? "Medical License" : "Certification",
                    "Tax Forms",
                    "NDA Agreement",
                  ].map((doc) => (
                    <div
                      key={doc}
                      className="neu-flat flex items-center gap-3 rounded-lg bg-background p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="rounded-lg bg-primary/10 p-2">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{doc}</p>
                        <p className="text-xs text-muted-foreground">PDF Document</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

export default function EmployeeProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <EmployeeProfileContent id={id} />
}
