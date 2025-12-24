"use client"

import { Users, UserCheck, ShieldCheck, Stethoscope } from "lucide-react"
import { useStore } from "@/lib/store"

export function StaffStats() {
  const { staffList } = useStore()

  const totalEmployees = staffList.length
  const activeEmployees = staffList.filter((s) => s.status === "active").length
  const dentistCount = staffList.filter((s) => s.role === "dentist" && s.status === "active").length
  const accessEnabled = staffList.filter((s) => s.systemAccess).length

  const stats = [
    {
      title: "Total Employees",
      value: totalEmployees.toString(),
      change: `${activeEmployees} active`,
      icon: Users,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      title: "Active Staff",
      value: activeEmployees.toString(),
      change: `${totalEmployees - activeEmployees} inactive`,
      icon: UserCheck,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
    },
    {
      title: "Dentists",
      value: dentistCount.toString(),
      change: "Assignable",
      icon: Stethoscope,
      iconColor: "text-accent",
      iconBg: "bg-accent/10",
    },
    {
      title: "Access Enabled",
      value: accessEnabled.toString(),
      change: `${totalEmployees - accessEnabled} directory only`,
      icon: ShieldCheck,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
  ]

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.title} className="neu-card rounded-xl bg-card p-3 sm:p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{stat.title}</p>
              <p className="mt-1 text-xl sm:text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground truncate">{stat.change}</p>
            </div>
            <div className={`rounded-lg sm:rounded-xl p-2 sm:p-3 shrink-0 ${stat.iconBg}`}>
              <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
