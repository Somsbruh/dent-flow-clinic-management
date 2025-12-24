"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import {
  staff as initialStaff,
  patients as initialPatients,
  appointments as initialAppointments,
  type Staff,
  type Patient,
  type Appointment,
} from "./data"

// Dentist type for reservation calendar
export interface Dentist {
  id: string
  name: string
  color: string
  avatar?: string
  todayAppointments: number
  isAvailable: boolean
  specialization?: string
}

// Color palette for dentists
const dentistColors = [
  "#f97316", // orange
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#10b981", // green
  "#ec4899", // pink
  "#f59e0b", // amber
  "#06b6d4", // cyan
  "#ef4444", // red
]

interface StoreContextType {
  // Staff
  staffList: Staff[]
  addStaff: (staff: Omit<Staff, "id">) => Staff
  updateStaff: (id: string, updates: Partial<Staff>) => void
  deleteStaff: (id: string) => void
  getStaffById: (id: string) => Staff | undefined

  isPhoneUnique: (phone: string, excludeId?: string) => boolean
  isTelegramUnique: (telegram: string, excludeId?: string) => boolean

  // Dentists (derived from staff)
  dentists: Dentist[]
  getDentistById: (id: string) => Dentist | undefined

  // Patients
  patientList: Patient[]
  addPatient: (patient: Omit<Patient, "id" | "createdAt">) => Patient
  updatePatient: (id: string, updates: Partial<Patient>) => void
  deletePatient: (id: string) => void

  // Appointments
  appointmentList: Appointment[]
  addAppointment: (appointment: Omit<Appointment, "id">) => Appointment
  updateAppointment: (id: string, updates: Partial<Appointment>) => void
  deleteAppointment: (id: string) => void

  // Loading states (for future backend integration)
  isLoading: boolean
  error: string | null
}

const StoreContext = createContext<StoreContextType | null>(null)

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}

// Generate unique ID
const generateId = (prefix: string) => {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).substr(2, 5)}`.toUpperCase()
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [staffList, setStaffList] = useState<Staff[]>(initialStaff)
  const [patientList, setPatientList] = useState<Patient[]>(initialPatients)
  const [appointmentList, setAppointmentList] = useState<Appointment[]>(initialAppointments)
  const [isLoading] = useState(false)
  const [error] = useState<string | null>(null)

  // Derive dentists from staff list
  const dentists: Dentist[] = staffList
    .filter((s) => s.role === "dentist" && s.status === "active" && s.canBeAssignedAppointments !== false)
    .map((s, index) => ({
      id: s.id,
      name: `Dr. ${s.firstName} ${s.lastName}`,
      color: dentistColors[index % dentistColors.length],
      avatar: s.avatar,
      specialization: s.specialization,
      todayAppointments: appointmentList.filter(
        (a) => a.dentistId === s.id && a.date === new Date().toISOString().split("T")[0],
      ).length,
      isAvailable: s.status === "active",
    }))

  const getDentistById = useCallback((id: string) => dentists.find((d) => d.id === id), [dentists])

  const getStaffById = useCallback((id: string) => staffList.find((s) => s.id === id), [staffList])

  const isPhoneUnique = useCallback(
    (phone: string, excludeId?: string) => {
      if (!phone) return true
      return !staffList.some((s) => s.phone === phone && s.id !== excludeId)
    },
    [staffList],
  )

  const isTelegramUnique = useCallback(
    (telegram: string, excludeId?: string) => {
      if (!telegram) return true
      const normalized = telegram.startsWith("@") ? telegram : `@${telegram}`
      return !staffList.some((s) => s.telegramUsername === normalized && s.id !== excludeId)
    },
    [staffList],
  )

  // Staff CRUD
  const addStaff = useCallback((staffData: Omit<Staff, "id">): Staff => {
    const newStaff: Staff = {
      ...staffData,
      id: generateId("S"),
    }
    setStaffList((prev) => [...prev, newStaff])
    return newStaff
  }, [])

  const updateStaff = useCallback((id: string, updates: Partial<Staff>) => {
    setStaffList((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)))
  }, [])

  const deleteStaff = useCallback((id: string) => {
    setStaffList((prev) => prev.filter((s) => s.id !== id))
  }, [])

  // Patient CRUD
  const addPatient = useCallback((patientData: Omit<Patient, "id" | "createdAt">): Patient => {
    const newPatient: Patient = {
      ...patientData,
      id: generateId("P"),
      createdAt: new Date().toISOString().split("T")[0],
    }
    setPatientList((prev) => [...prev, newPatient])
    return newPatient
  }, [])

  const updatePatient = useCallback((id: string, updates: Partial<Patient>) => {
    setPatientList((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }, [])

  const deletePatient = useCallback((id: string) => {
    setPatientList((prev) => prev.filter((p) => p.id !== id))
  }, [])

  // Appointment CRUD
  const addAppointment = useCallback((appointmentData: Omit<Appointment, "id">): Appointment => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: generateId("A"),
    }
    setAppointmentList((prev) => [...prev, newAppointment])
    return newAppointment
  }, [])

  const updateAppointment = useCallback((id: string, updates: Partial<Appointment>) => {
    setAppointmentList((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)))
  }, [])

  const deleteAppointment = useCallback((id: string) => {
    setAppointmentList((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const value: StoreContextType = {
    staffList,
    addStaff,
    updateStaff,
    deleteStaff,
    getStaffById,
    isPhoneUnique,
    isTelegramUnique,
    dentists,
    getDentistById,
    patientList,
    addPatient,
    updatePatient,
    deletePatient,
    appointmentList,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    isLoading,
    error,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
