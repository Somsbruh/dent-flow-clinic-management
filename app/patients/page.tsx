"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Grid, List, UserPlus } from "lucide-react"
import { PatientCard } from "@/components/patients/patient-card"
import { PatientTable } from "@/components/patients/patient-table"
import { patients } from "@/lib/data"
import Link from "next/link"

export default function PatientsPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")

  const filteredPatients = patients.filter(
    (patient) =>
      patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery),
  )

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
      <div className="flex-1 lg:ml-[240px]">
        <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <main className="p-4 md:p-6">
          <div className="mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Patients</h1>
              <p className="mt-1 text-sm md:text-base text-muted-foreground">
                Manage patient records and medical history
              </p>
            </div>
            <Link href="/patients/new">
              <Button className="w-full sm:w-auto rounded-xl neu-button bg-primary text-primary-foreground hover:bg-primary/90">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Patient
              </Button>
            </Link>
          </div>

          <div className="mb-6 rounded-2xl bg-background p-4 neu-card">
            <div className="flex flex-col gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search patients by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl neu-input border-0 bg-background"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[180px] rounded-xl neu-button border-0">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="neu-card">
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="lastVisit">Last Visit</SelectItem>
                    <SelectItem value="createdAt">Date Added</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="w-full sm:w-auto rounded-xl neu-button border-0 bg-transparent">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
                <div className="flex items-center rounded-xl bg-background neu-pressed p-1 ml-auto">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex-1 sm:flex-none rounded-lg p-2 transition-all ${
                      viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`flex-1 sm:flex-none rounded-lg p-2 transition-all ${
                      viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="rounded-2xl bg-background p-3 md:p-4 neu-card">
              <p className="text-xs md:text-sm text-muted-foreground">Total Patients</p>
              <p className="text-xl md:text-2xl font-bold text-foreground">{patients.length}</p>
            </div>
            <div className="rounded-2xl bg-background p-3 md:p-4 neu-card">
              <p className="text-xs md:text-sm text-muted-foreground">New This Month</p>
              <p className="text-xl md:text-2xl font-bold text-primary">12</p>
            </div>
            <div className="rounded-2xl bg-background p-3 md:p-4 neu-card">
              <p className="text-xs md:text-sm text-muted-foreground">With Insurance</p>
              <p className="text-xl md:text-2xl font-bold text-foreground">
                {patients.filter((p) => p.insuranceProvider).length}
              </p>
            </div>
            <div className="rounded-2xl bg-background p-3 md:p-4 neu-card">
              <p className="text-xs md:text-sm text-muted-foreground">Pending Appointments</p>
              <p className="text-xl md:text-2xl font-bold text-accent">8</p>
            </div>
          </div>

          {viewMode === "list" ? (
            <PatientTable patients={filteredPatients} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredPatients.map((patient) => (
                <PatientCard key={patient.id} patient={patient} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
