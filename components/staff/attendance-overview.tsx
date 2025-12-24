"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight, Clock, LogIn, LogOut } from "lucide-react"

const todayAttendance = [
  {
    id: "EMP001",
    name: "Dr. Sarah Chen",
    avatar: "/female-doctor.png",
    clockIn: "08:45 AM",
    clockOut: null,
    status: "Present",
    hoursWorked: "5h 30m",
  },
  {
    id: "EMP002",
    name: "Dr. Michael Rodriguez",
    avatar: "/male-doctor.png",
    clockIn: "09:00 AM",
    clockOut: null,
    status: "Present",
    hoursWorked: "5h 15m",
  },
  {
    id: "EMP003",
    name: "Emily Watson",
    avatar: "/female-nurse.png",
    clockIn: "08:30 AM",
    clockOut: null,
    status: "Present",
    hoursWorked: "5h 45m",
  },
  {
    id: "EMP004",
    name: "James Miller",
    avatar: "/male-receptionist.jpg",
    clockIn: "09:15 AM",
    clockOut: null,
    status: "Late",
    hoursWorked: "5h 00m",
  },
  {
    id: "EMP005",
    name: "Dr. Lisa Park",
    avatar: "/asian-female-doctor.jpg",
    clockIn: null,
    clockOut: null,
    status: "On Leave",
    hoursWorked: "-",
  },
  {
    id: "EMP006",
    name: "Robert Johnson",
    avatar: "/male-dental-assistant.jpg",
    clockIn: "08:50 AM",
    clockOut: "05:00 PM",
    status: "Completed",
    hoursWorked: "8h 10m",
  },
]

export function AttendanceOverview() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1))
    setSelectedDate(newDate)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-700"
      case "Late":
        return "bg-amber-100 text-amber-700"
      case "On Leave":
        return "bg-blue-100 text-blue-700"
      case "Completed":
        return "bg-primary/10 text-primary"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Date Navigation */}
      <div className="neu-card flex items-center justify-between rounded-xl bg-card p-3 sm:p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateDate("prev")}
          className="neu-button h-8 w-8 sm:h-10 sm:w-10"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <div className="flex items-center gap-2 sm:gap-3">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          <span className="text-sm sm:text-lg font-medium text-foreground">{formatDate(selectedDate)}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateDate("next")}
          className="neu-button h-8 w-8 sm:h-10 sm:w-10"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>

      {/* Summary Cards - 2x2 grid on mobile */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4">
        <div className="neu-flat rounded-xl bg-green-50 p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-green-600">Present</p>
          <p className="mt-1 text-xl sm:text-2xl font-bold text-green-700">18</p>
        </div>
        <div className="neu-flat rounded-xl bg-amber-50 p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-amber-600">Late</p>
          <p className="mt-1 text-xl sm:text-2xl font-bold text-amber-700">3</p>
        </div>
        <div className="neu-flat rounded-xl bg-blue-50 p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-blue-600">On Leave</p>
          <p className="mt-1 text-xl sm:text-2xl font-bold text-blue-700">2</p>
        </div>
        <div className="neu-flat rounded-xl bg-red-50 p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-red-600">Absent</p>
          <p className="mt-1 text-xl sm:text-2xl font-bold text-red-700">1</p>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="neu-card overflow-hidden rounded-xl bg-card">
        <div className="border-b border-border p-3 sm:p-4">
          <h3 className="font-semibold text-foreground text-sm sm:text-base">Today&apos;s Attendance Log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">
                  Employee
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">
                  Clock In
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground hidden sm:table-cell">
                  Clock Out
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground hidden md:table-cell">
                  Hours
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {todayAttendance.map((record) => (
                <tr key={record.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="px-3 sm:px-4 py-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                        <AvatarImage src={record.avatar || "/placeholder.svg"} alt={record.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {record.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">
                        {record.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    {record.clockIn ? (
                      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-foreground">
                        <LogIn className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                        {record.clockIn}
                      </div>
                    ) : (
                      <span className="text-xs sm:text-sm text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-3 sm:px-4 py-3 hidden sm:table-cell">
                    {record.clockOut ? (
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <LogOut className="h-4 w-4 text-red-500" />
                        {record.clockOut}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-3 sm:px-4 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {record.hoursWorked}
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    <Badge className={`${getStatusColor(record.status)} text-xs`}>{record.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
