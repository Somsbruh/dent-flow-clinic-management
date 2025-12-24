"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, UserCheck, UserX, Coffee, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { staff } from "@/lib/data"

const attendanceData = [
  { staffId: "S001", date: "2024-12-10", clockIn: "08:55", clockOut: "17:05", status: "present", breakTime: 60 },
  { staffId: "S002", date: "2024-12-10", clockIn: "09:10", clockOut: "17:30", status: "late", breakTime: 45 },
  { staffId: "S003", date: "2024-12-10", clockIn: "08:45", clockOut: "17:00", status: "present", breakTime: 60 },
  { staffId: "S004", date: "2024-12-10", clockIn: null, clockOut: null, status: "absent", breakTime: 0 },
  { staffId: "S005", date: "2024-12-10", clockIn: "08:30", clockOut: "12:30", status: "half-day", breakTime: 30 },
  { staffId: "S001", date: "2024-12-09", clockIn: "08:50", clockOut: "17:10", status: "present", breakTime: 60 },
  { staffId: "S002", date: "2024-12-09", clockIn: "08:45", clockOut: "17:00", status: "present", breakTime: 60 },
  { staffId: "S003", date: "2024-12-09", clockIn: null, clockOut: null, status: "leave", breakTime: 0 },
]

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState("2024-12-10")
  const [filterStatus, setFilterStatus] = useState("all")

  const todayAttendance = attendanceData.filter((a) => a.date === selectedDate)
  const filteredAttendance =
    filterStatus === "all" ? todayAttendance : todayAttendance.filter((a) => a.status === filterStatus)

  const getStaffInfo = (staffId: string) => staff.find((s) => s.id === staffId)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-700"
      case "late":
        return "bg-amber-100 text-amber-700"
      case "absent":
        return "bg-red-100 text-red-700"
      case "half-day":
        return "bg-blue-100 text-blue-700"
      case "leave":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <UserCheck className="h-4 w-4" />
      case "late":
        return <Clock className="h-4 w-4" />
      case "absent":
        return <UserX className="h-4 w-4" />
      case "half-day":
        return <Coffee className="h-4 w-4" />
      case "leave":
        return <Calendar className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const stats = {
    present: todayAttendance.filter((a) => a.status === "present").length,
    late: todayAttendance.filter((a) => a.status === "late").length,
    absent: todayAttendance.filter((a) => a.status === "absent").length,
    leave: todayAttendance.filter((a) => a.status === "leave").length,
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 pl-64">
        <Header />
        <main className="p-6">
          {/* Page Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Attendance</h1>
              <p className="mt-1 text-muted-foreground">Track staff attendance and working hours</p>
            </div>
            <Button className="rounded-xl neu-button bg-primary text-primary-foreground">
              <Clock className="mr-2 h-4 w-4" />
              Clock In/Out
            </Button>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <div className="rounded-2xl bg-green-50 p-6 neu-card">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                  <UserCheck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-green-600">Present</p>
                  <p className="text-2xl font-bold text-green-700">{stats.present}</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-amber-50 p-6 neu-card">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-amber-600">Late</p>
                  <p className="text-2xl font-bold text-amber-700">{stats.late}</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-red-50 p-6 neu-card">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                  <UserX className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-red-600">Absent</p>
                  <p className="text-2xl font-bold text-red-700">{stats.absent}</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-purple-50 p-6 neu-card">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-purple-600">On Leave</p>
                  <p className="text-2xl font-bold text-purple-700">{stats.leave}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="rounded-2xl bg-background p-6 neu-card mb-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="neu-button">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-40 rounded-xl neu-input border-0"
                />
                <Button variant="ghost" size="icon" className="neu-button">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40 rounded-xl neu-button border-0">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="neu-card">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="leave">On Leave</SelectItem>
                  <SelectItem value="half-day">Half Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="rounded-2xl bg-background neu-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Employee</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Clock In</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Clock Out</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Break</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Working Hours</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map((record, idx) => {
                  const staffInfo = getStaffInfo(record.staffId)
                  if (!staffInfo) return null

                  const workingHours =
                    record.clockIn && record.clockOut
                      ? (() => {
                          const [inH, inM] = record.clockIn.split(":").map(Number)
                          const [outH, outM] = record.clockOut.split(":").map(Number)
                          const totalMinutes = outH * 60 + outM - (inH * 60 + inM) - record.breakTime
                          const hours = Math.floor(totalMinutes / 60)
                          const minutes = totalMinutes % 60
                          return `${hours}h ${minutes}m`
                        })()
                      : "-"

                  return (
                    <tr key={idx} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold">
                            {staffInfo.firstName[0]}
                            {staffInfo.lastName[0]}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {staffInfo.role === "dentist" ? "Dr. " : ""}
                              {staffInfo.firstName} {staffInfo.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">{staffInfo.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground capitalize">{staffInfo.role}</td>
                      <td className="px-6 py-4 text-foreground">{record.clockIn || "-"}</td>
                      <td className="px-6 py-4 text-foreground">{record.clockOut || "-"}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {record.breakTime > 0 ? `${record.breakTime}m` : "-"}
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">{workingHours}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(record.status)}`}
                        >
                          {getStatusIcon(record.status)}
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1).replace("-", " ")}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  )
}
