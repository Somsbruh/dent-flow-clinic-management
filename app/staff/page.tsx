"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { StaffTable } from "@/components/staff/staff-table"
import { StaffStats } from "@/components/staff/staff-stats"
import { AddEmployeeModal } from "@/components/staff/add-employee-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Users, Clock, Calendar } from "lucide-react"
import { AttendanceOverview } from "@/components/staff/attendance-overview"
import { PayrollSummary } from "@/components/staff/payroll-summary"

export default function StaffPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 lg:pl-[240px]">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6">
          {/* Page Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">Staff Management</h1>
              <p className="mt-1 text-sm text-muted-foreground">Manage employees, access, and scheduling</p>
            </div>
            <Button
              className="neu-button bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </div>

          {/* Stats Cards */}
          <StaffStats />

          {/* Tabs for different views */}
          <Tabs defaultValue="employees" className="mt-6">
            <TabsList className="neu-flat bg-background p-1 w-full overflow-x-auto flex-nowrap">
              <TabsTrigger
                value="employees"
                className="data-[state=active]:neu-pressed data-[state=active]:bg-primary/10 text-xs sm:text-sm"
              >
                <Users className="mr-1 sm:mr-2 h-4 w-4" />
                <span className="hidden xs:inline">Employees</span>
                <span className="xs:hidden">Staff</span>
              </TabsTrigger>
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
                <Calendar className="mr-1 sm:mr-2 h-4 w-4" />
                Payroll
              </TabsTrigger>
            </TabsList>

            <TabsContent value="employees" className="mt-6">
              {/* Search */}
              <div className="mb-4">
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, telegram, phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="neu-input bg-background pl-10"
                  />
                </div>
              </div>
              <StaffTable searchQuery={searchQuery} />
            </TabsContent>

            <TabsContent value="attendance" className="mt-6">
              <AttendanceOverview />
            </TabsContent>

            <TabsContent value="payroll" className="mt-6">
              <PayrollSummary />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      <AddEmployeeModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  )
}
