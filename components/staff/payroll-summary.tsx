"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, Download, FileText, TrendingUp } from "lucide-react"

const payrollData = [
  {
    id: "EMP001",
    name: "Dr. Sarah Chen",
    avatar: "/female-doctor.png",
    role: "Dentist",
    baseSalary: 12000,
    bonus: 1500,
    deductions: 850,
    netPay: 12650,
    status: "Pending",
  },
  {
    id: "EMP002",
    name: "Dr. Michael Rodriguez",
    avatar: "/male-doctor.png",
    role: "Dentist",
    baseSalary: 11500,
    bonus: 1200,
    deductions: 780,
    netPay: 11920,
    status: "Pending",
  },
  {
    id: "EMP003",
    name: "Emily Watson",
    avatar: "/female-nurse.png",
    role: "Dental Hygienist",
    baseSalary: 5500,
    bonus: 400,
    deductions: 420,
    netPay: 5480,
    status: "Pending",
  },
  {
    id: "EMP004",
    name: "James Miller",
    avatar: "/male-receptionist.jpg",
    role: "Receptionist",
    baseSalary: 3800,
    bonus: 200,
    deductions: 290,
    netPay: 3710,
    status: "Pending",
  },
  {
    id: "EMP005",
    name: "Dr. Lisa Park",
    avatar: "/asian-female-doctor.jpg",
    role: "Dentist",
    baseSalary: 11000,
    bonus: 0,
    deductions: 680,
    netPay: 10320,
    status: "On Leave",
  },
  {
    id: "EMP006",
    name: "Robert Johnson",
    avatar: "/male-dental-assistant.jpg",
    role: "Dental Assistant",
    baseSalary: 4200,
    bonus: 300,
    deductions: 340,
    netPay: 4160,
    status: "Pending",
  },
]

export function PayrollSummary() {
  const [selectedMonth, setSelectedMonth] = useState("december-2024")

  const totalPayroll = payrollData.reduce((sum, emp) => sum + emp.netPay, 0)
  const totalBonus = payrollData.reduce((sum, emp) => sum + emp.bonus, 0)
  const totalDeductions = payrollData.reduce((sum, emp) => sum + emp.deductions, 0)

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Month Selector and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="neu-input w-full sm:w-48 bg-background">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent className="neu-flat bg-popover">
            <SelectItem value="december-2024">December 2024</SelectItem>
            <SelectItem value="november-2024">November 2024</SelectItem>
            <SelectItem value="october-2024">October 2024</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2 sm:gap-3">
          <Button variant="outline" className="neu-button bg-background flex-1 sm:flex-none text-xs sm:text-sm">
            <FileText className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="hidden xs:inline">Generate</span> Report
          </Button>
          <Button className="neu-button bg-primary text-primary-foreground hover:bg-primary/90 flex-1 sm:flex-none text-xs sm:text-sm">
            <Download className="mr-1 sm:mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        <div className="neu-card rounded-xl bg-card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Total Payroll</p>
              <p className="mt-1 text-xl sm:text-2xl font-bold text-foreground">${totalPayroll.toLocaleString()}</p>
              <p className="mt-1 text-xs text-green-600">+5.2% from last month</p>
            </div>
            <div className="rounded-xl bg-primary/10 p-2 sm:p-3">
              <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
          </div>
        </div>
        <div className="neu-card rounded-xl bg-card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Total Bonuses</p>
              <p className="mt-1 text-xl sm:text-2xl font-bold text-foreground">${totalBonus.toLocaleString()}</p>
              <p className="mt-1 text-xs text-green-600">+12% from last month</p>
            </div>
            <div className="rounded-xl bg-green-100 p-2 sm:p-3">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="neu-card rounded-xl bg-card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Total Deductions</p>
              <p className="mt-1 text-xl sm:text-2xl font-bold text-foreground">${totalDeductions.toLocaleString()}</p>
              <p className="mt-1 text-xs text-muted-foreground">Tax & Insurance</p>
            </div>
            <div className="rounded-xl bg-amber-100 p-2 sm:p-3">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="neu-card overflow-hidden rounded-xl bg-card">
        <div className="border-b border-border p-3 sm:p-4">
          <h3 className="font-semibold text-foreground text-sm sm:text-base">Employee Payroll Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[550px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">
                  Employee
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground hidden md:table-cell">
                  Base
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground hidden lg:table-cell">
                  Bonus
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground hidden lg:table-cell">
                  Deductions
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">
                  Net Pay
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {payrollData.map((employee) => (
                <tr key={employee.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="px-3 sm:px-4 py-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                        <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {employee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground text-xs sm:text-sm truncate">{employee.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{employee.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-foreground hidden md:table-cell">
                    ${employee.baseSalary.toLocaleString()}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-green-600 hidden lg:table-cell">
                    +${employee.bonus.toLocaleString()}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-red-500 hidden lg:table-cell">
                    -${employee.deductions.toLocaleString()}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold text-foreground">
                    ${employee.netPay.toLocaleString()}
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    <Badge
                      className={`text-xs ${
                        employee.status === "Pending"
                          ? "bg-amber-100 text-amber-700"
                          : employee.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {employee.status}
                    </Badge>
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
