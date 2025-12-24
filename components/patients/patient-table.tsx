"use client"

import type { Patient } from "@/lib/data"
import { MoreHorizontal, Eye, Calendar, Edit, Trash2, MoreVertical, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface PatientTableProps {
  patients: Patient[]
}

export function PatientTable({ patients }: PatientTableProps) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block rounded-2xl bg-background neu-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Patient</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Insurance</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Last Visit</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Next Appointment</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr
                  key={patient.id}
                  className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
                        {patient.firstName[0]}
                        {patient.lastName[0]}
                      </div>
                      <div>
                        <Link href={`/patients/${patient.id}`}>
                          <p className="font-medium text-foreground hover:text-primary transition-colors">
                            {patient.firstName} {patient.lastName}
                          </p>
                        </Link>
                        <p className="text-sm text-muted-foreground">{patient.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-foreground">{patient.email}</p>
                    <p className="text-sm text-muted-foreground">{patient.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    {patient.insuranceProvider ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        {patient.insuranceProvider}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">No insurance</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-foreground">{patient.lastVisit || "No visits"}</p>
                  </td>
                  <td className="px-6 py-4">
                    {patient.nextAppointment ? (
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        {patient.nextAppointment}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Not scheduled</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-xl">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="neu-card">
                        <DropdownMenuItem asChild>
                          <Link href={`/patients/${patient.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="mr-2 h-4 w-4" />
                          Book Appointment
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Patient
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {patients.map((patient) => (
          <Link key={patient.id} href={`/patients/${patient.id}`} className="block">
            <div className="rounded-xl bg-background p-4 neu-card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
                    {patient.firstName[0]}
                    {patient.lastName[0]}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {patient.firstName} {patient.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{patient.id}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                    <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="neu-card">
                    <DropdownMenuItem asChild>
                      <Link href={`/patients/${patient.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Calendar className="mr-2 h-4 w-4" />
                      Book Appointment
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Patient
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2 text-sm mb-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="truncate">{patient.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{patient.phone}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  {patient.insuranceProvider ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      {patient.insuranceProvider}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">No insurance</span>
                  )}
                </div>
                <div className="text-right">
                  {patient.nextAppointment ? (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {patient.nextAppointment}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">No upcoming</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
