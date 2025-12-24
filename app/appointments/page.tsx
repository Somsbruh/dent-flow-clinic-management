"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Plus, CalendarIcon, List, LayoutGrid } from "lucide-react"
import { CalendarView } from "@/components/appointments/calendar-view"
import { AppointmentsList } from "@/components/appointments/appointments-list"
import { DoctorSchedule } from "@/components/appointments/doctor-schedule"
import { DayDetailView } from "@/components/appointments/day-detail-view"
import Link from "next/link"

export default function AppointmentsPage() {
  const [viewMode, setViewMode] = useState<"calendar" | "list" | "doctor" | "day">("calendar")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDoctor, setSelectedDoctor] = useState("all")
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const handleDaySelect = (date: Date) => {
    setSelectedDay(date)
    setViewMode("day")
  }

  const handleBackToCalendar = () => {
    setViewMode("calendar")
    setSelectedDay(null)
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
              <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
              <p className="mt-1 text-muted-foreground">Manage patient appointments and schedules</p>
            </div>
            <Link href="/appointments/new">
              <Button className="rounded-xl neu-button bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                New Appointment
              </Button>
            </Link>
          </div>

          {/* Controls */}
          <div className="mb-6 rounded-2xl bg-background p-4 neu-card">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Date Navigation */}
              <div className="flex items-center gap-4">
                {viewMode === "day" && selectedDay ? (
                  <>
                    <Button variant="ghost" className="rounded-xl neu-button" onClick={handleBackToCalendar}>
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back to Calendar
                    </Button>
                    <span className="text-lg font-semibold text-foreground">
                      {selectedDay.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="rounded-xl neu-button" onClick={goToPreviousMonth}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="min-w-[180px] text-center text-lg font-semibold text-foreground">
                        {formatDate(currentDate)}
                      </span>
                      <Button variant="ghost" size="icon" className="rounded-xl neu-button" onClick={goToNextMonth}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      className="rounded-xl neu-button border-0 bg-transparent"
                      onClick={goToToday}
                    >
                      Today
                    </Button>
                  </>
                )}
              </div>

              {/* Filters and View Toggle */}
              <div className="flex items-center gap-4">
                <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                  <SelectTrigger className="w-[200px] rounded-xl neu-button border-0">
                    <SelectValue placeholder="All Doctors" />
                  </SelectTrigger>
                  <SelectContent className="neu-card">
                    <SelectItem value="all">All Doctors</SelectItem>
                    <SelectItem value="S001">Dr. Sarah Chen</SelectItem>
                    <SelectItem value="S002">Dr. James Lee</SelectItem>
                  </SelectContent>
                </Select>

                {viewMode !== "day" && (
                  <div className="flex items-center rounded-xl bg-background neu-pressed p-1">
                    <button
                      onClick={() => setViewMode("calendar")}
                      className={`rounded-lg p-2 transition-all ${
                        viewMode === "calendar" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`rounded-lg p-2 transition-all ${
                        viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("doctor")}
                      className={`rounded-lg p-2 transition-all ${
                        viewMode === "doctor" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats - hide when in day view */}
          {viewMode !== "day" && (
            <div className="mb-6 grid gap-4 md:grid-cols-5">
              <div className="rounded-2xl bg-background p-4 neu-card">
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-2xl font-bold text-foreground">18</p>
              </div>
              <div className="rounded-2xl bg-background p-4 neu-card">
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold text-foreground">82</p>
              </div>
              <div className="rounded-2xl bg-background p-4 neu-card">
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">5</p>
              </div>
              <div className="rounded-2xl bg-background p-4 neu-card">
                <p className="text-sm text-muted-foreground">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">2</p>
              </div>
              <div className="rounded-2xl bg-background p-4 neu-card">
                <p className="text-sm text-muted-foreground">No Shows</p>
                <p className="text-2xl font-bold text-amber-600">1</p>
              </div>
            </div>
          )}

          {/* Main Content */}
          {viewMode === "calendar" && <CalendarView currentDate={currentDate} onDaySelect={handleDaySelect} />}
          {viewMode === "list" && <AppointmentsList />}
          {viewMode === "doctor" && <DoctorSchedule />}
          {viewMode === "day" && selectedDay && <DayDetailView date={selectedDay} selectedDoctor={selectedDoctor} />}
        </main>
      </div>
    </div>
  )
}
