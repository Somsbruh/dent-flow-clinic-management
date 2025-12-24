"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, Filter, Check } from "lucide-react"
import { ReservationCalendar } from "@/components/reservations/reservation-calendar"
import { WeeklyCalendarView } from "@/components/reservations/weekly-calendar-view"
import { MonthlyCalendarView } from "@/components/reservations/monthly-calendar-view"
import { AddToWaitlistModal } from "@/components/reservations/add-to-waitlist-modal"
import { FiltersModal } from "@/components/reservations/filters-modal"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"

export default function ReservationsPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day")
  const [selectedDentists, setSelectedDentists] = useState<string[]>(["all"])
  const [showDentistDropdown, setShowDentistDropdown] = useState(false)
  const [activeTab, setActiveTab] = useState<"calendar" | "history">("calendar")
  const [showWaitlistModal, setShowWaitlistModal] = useState(false)
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    time: string
    endTime: string
    dentistId: string
  } | null>(null)
  const [workingHours, setWorkingHours] = useState({ start: "07:00", end: "19:00" })
  const [viewHours, setViewHours] = useState({ start: "09:00", end: "16:00" })
  const [breakTime, setBreakTime] = useState({ start: "12:00", end: "13:00" })

  const { dentists, appointmentList } = useStore()

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatDateShort = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    })
  }

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
  }

  const formatWeekRange = (date: Date) => {
    const start = new Date(date)
    start.setDate(start.getDate() - start.getDay())
    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
  }

  const formatWeekRangeShort = (date: Date) => {
    const start = new Date(date)
    start.setDate(start.getDate() - start.getDay())
    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { day: "numeric" })}`
  }

  const goToPrevious = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setDate(newDate.getDate() - 1)
    }
    setCurrentDate(newDate)
  }

  const goToNext = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() + 1)
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setDate(newDate.getDate() + 1)
    }
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const handleSlotClick = (time: string, dentistId: string, endTime?: string) => {
    const calculatedEndTime =
      endTime ||
      (() => {
        const [hours, minutes] = time.split(":")
        const hour = Number.parseInt(hours)
        const min = Number.parseInt(minutes)
        const newMin = min + 30
        if (newMin >= 60) {
          return `${(hour + 1).toString().padStart(2, "0")}:00`
        }
        return `${hours}:30`
      })()

    setSelectedTimeSlot({ time, endTime: calculatedEndTime, dentistId })
    setShowWaitlistModal(true)
  }

  const handleDayClick = (date: Date) => {
    setCurrentDate(date)
    setViewMode("day")
  }

  const toggleDentist = (dentistId: string) => {
    if (dentistId === "all") {
      setSelectedDentists(["all"])
    } else {
      const newSelection = selectedDentists.filter((id) => id !== "all")
      if (newSelection.includes(dentistId)) {
        const filtered = newSelection.filter((id) => id !== dentistId)
        setSelectedDentists(filtered.length === 0 ? ["all"] : filtered)
      } else {
        setSelectedDentists([...newSelection, dentistId])
      }
    }
  }

  const getSelectedDentistLabel = () => {
    if (selectedDentists.includes("all")) return "All Dentist"
    if (selectedDentists.length === 1) {
      return dentists.find((d) => d.id === selectedDentists[0])?.name || "All Dentist"
    }
    return `${selectedDentists.length} Dentists`
  }

  const totalAppointments =
    appointmentList.filter((a) => a.date === currentDate.toISOString().split("T")[0]).length || 16

  return (
    <div className="flex h-screen bg-[#f8f9fc] overflow-hidden">
      <Sidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
      <div className="flex-1 flex flex-col lg:ml-[240px] overflow-hidden">
        <Header title="Reservations" onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <main className="flex-1 flex flex-col p-3 md:p-4 overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-gray-200 mb-3 md:mb-4 flex-shrink-0">
            <button
              onClick={() => setActiveTab("calendar")}
              className={`pb-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
                activeTab === "calendar" ? "text-primary" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Calendar
              {activeTab === "calendar" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`pb-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
                activeTab === "history" ? "text-primary" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Log History
              {activeTab === "history" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
          </div>

          {/* Controls - responsive layout */}
          <div className="flex flex-col gap-3 mb-3 md:mb-4 flex-shrink-0">
            {/* Row 1: Appointment count + Today + Navigation */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="flex items-center gap-1.5 md:gap-2 text-gray-600">
                  <Calendar className="h-4 w-4 hidden sm:block" />
                  <span className="text-lg md:text-xl font-bold text-gray-900">{totalAppointments}</span>
                  <span className="text-[10px] md:text-xs text-gray-500 hidden sm:inline">total appointments</span>
                </div>

                <Button
                  variant="outline"
                  className="rounded-lg border-gray-300 bg-white px-2 md:px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
                  onClick={goToToday}
                >
                  Today
                </Button>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-lg hover:bg-gray-100"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="min-w-[80px] md:min-w-[140px] text-center text-[10px] md:text-xs font-medium text-gray-900">
                  {viewMode === "month" ? (
                    formatMonthYear(currentDate)
                  ) : viewMode === "week" ? (
                    <span className="hidden sm:inline">{formatWeekRange(currentDate)}</span>
                  ) : (
                    <span className="hidden sm:inline">{formatDate(currentDate)}</span>
                  )}
                  {viewMode === "month" ? null : viewMode === "week" ? (
                    <span className="sm:hidden">{formatWeekRangeShort(currentDate)}</span>
                  ) : (
                    <span className="sm:hidden">{formatDateShort(currentDate)}</span>
                  )}
                </span>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-gray-100" onClick={goToNext}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Row 2: View mode + Dentist filter + Filters */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center rounded-lg border border-gray-300 bg-white p-0.5">
                {["day", "week", "month"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode as "day" | "week" | "month")}
                    className={`rounded-md px-2 md:px-3 py-1.5 text-[10px] md:text-xs font-medium transition-colors capitalize ${
                      viewMode === mode ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {mode === "day" ? "Day" : mode === "week" ? "Week" : "Month"}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Button
                    variant="outline"
                    className="rounded-lg border-gray-300 bg-white px-2 md:px-3 py-1.5 text-[10px] md:text-xs hover:bg-gray-50"
                    onClick={() => setShowDentistDropdown(!showDentistDropdown)}
                  >
                    <svg
                      className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 md:mr-1.5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="hidden sm:inline">{getSelectedDentistLabel()}</span>
                    <span className="sm:hidden">
                      {selectedDentists.includes("all") ? "All" : selectedDentists.length}
                    </span>
                  </Button>

                  {showDentistDropdown && (
                    <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                      <button
                        onClick={() => toggleDentist("all")}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors",
                          selectedDentists.includes("all") && "bg-blue-50",
                        )}
                      >
                        <div
                          className={cn(
                            "h-4 w-4 rounded border flex items-center justify-center",
                            selectedDentists.includes("all") ? "bg-blue-500 border-blue-500" : "border-gray-300",
                          )}
                        >
                          {selectedDentists.includes("all") && <Check className="h-3 w-3 text-white" />}
                        </div>
                        All Dentists
                      </button>
                      <div className="border-t border-gray-100" />
                      {dentists.map((dentist) => (
                        <button
                          key={dentist.id}
                          onClick={() => toggleDentist(dentist.id)}
                          className={cn(
                            "w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors",
                            selectedDentists.includes(dentist.id) && "bg-blue-50",
                          )}
                        >
                          <div
                            className={cn(
                              "h-4 w-4 rounded border flex items-center justify-center",
                              selectedDentists.includes(dentist.id) ? "bg-blue-500 border-blue-500" : "border-gray-300",
                            )}
                          >
                            {selectedDentists.includes(dentist.id) && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: dentist.color }} />
                          <span className="truncate">{dentist.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  className="rounded-lg border-gray-300 bg-white px-2 md:px-3 py-1.5 text-[10px] md:text-xs hover:bg-gray-50"
                  onClick={() => setShowFiltersModal(true)}
                >
                  <Filter className="mr-1 md:mr-1.5 h-3 w-3 md:h-3.5 md:w-3.5" />
                  <span className="hidden sm:inline">Filters</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Calendar View - fills remaining space */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {activeTab === "calendar" && viewMode === "day" && (
              <ReservationCalendar
                currentDate={currentDate}
                onSlotClick={handleSlotClick}
                selectedDentists={selectedDentists}
                workingHours={workingHours}
                breakTime={breakTime}
              />
            )}

            {activeTab === "calendar" && viewMode === "week" && (
              <WeeklyCalendarView
                currentDate={currentDate}
                onDayClick={handleDayClick}
                selectedDentists={selectedDentists}
              />
            )}

            {activeTab === "calendar" && viewMode === "month" && (
              <MonthlyCalendarView
                currentDate={currentDate}
                onDayClick={handleDayClick}
                selectedDentists={selectedDentists}
              />
            )}

            {activeTab === "history" && (
              <div className="rounded-2xl bg-white p-8 text-center h-full">
                <p className="text-gray-500">Log history coming soon...</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Close dentist dropdown when clicking outside */}
      {showDentistDropdown && <div className="fixed inset-0 z-40" onClick={() => setShowDentistDropdown(false)} />}

      <AddToWaitlistModal
        isOpen={showWaitlistModal}
        onClose={() => {
          setShowWaitlistModal(false)
          setSelectedTimeSlot(null)
        }}
        selectedDate={currentDate}
        selectedTime={selectedTimeSlot?.time}
        selectedEndTime={selectedTimeSlot?.endTime}
        selectedDentistId={selectedTimeSlot?.dentistId}
      />

      <FiltersModal
        isOpen={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        workingHours={workingHours}
        onWorkingHoursChange={setWorkingHours}
        breakTime={breakTime}
        onBreakTimeChange={setBreakTime}
      />
    </div>
  )
}
