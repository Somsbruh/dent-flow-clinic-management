"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  UserCog,
  CreditCard,
  BarChart3,
  ShoppingCart,
  Wallet,
  Package,
  Cable,
  FileText,
  Headphones,
  Building2,
  ChevronLeft,
  ChevronDown,
  X,
} from "lucide-react"
import { useState, useEffect } from "react"

const branches = [
  { id: "B001", name: "Avicena Clinic", address: "845 Euclid Avenue, CA" },
  { id: "B002", name: "Downtown Dental", address: "123 Main Street, LA" },
  { id: "B003", name: "Westside Clinic", address: "456 Ocean Blvd, SM" },
]

const navigation = [
  {
    section: null,
    items: [{ name: "Dashboard", href: "/", icon: LayoutDashboard }],
  },
  {
    section: "CLINIC",
    items: [
      { name: "Reservations", href: "/reservations", icon: Calendar },
      { name: "Patients", href: "/patients", icon: Users },
      { name: "Treatments", href: "/treatments", icon: Stethoscope },
      { name: "Staff List", href: "/staff", icon: UserCog },
    ],
  },
  {
    section: "FINANCE",
    items: [
      { name: "Accounts", href: "/billing", icon: CreditCard },
      { name: "Sales", href: "/billing", icon: BarChart3 },
      { name: "Purchases", href: "/billing", icon: ShoppingCart },
      { name: "Payment Method", href: "/billing", icon: Wallet },
    ],
  },
  {
    section: "PHYSICAL ASSET",
    items: [
      { name: "Stocks", href: "/inventory", icon: Package },
      { name: "Peripherals", href: "/inventory", icon: Cable },
    ],
  },
]

const bottomNavigation = [
  { name: "Report", href: "/billing", icon: FileText },
  { name: "Customer Support", href: "/settings", icon: Headphones },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState(branches[0])
  const [showBranchDropdown, setShowBranchDropdown] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen && onClose && isMounted) {
      onClose()
    }
  }, [pathname])

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden animate-in fade-in-0"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-[280px] bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out",
          "lg:z-40 lg:w-[240px]",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C9.5 2 7 3.5 6 6c-1.5 3.5-1 7 0 10 .5 1.5 1.5 4 3 4s2-2 3-2 1.5 2 3 2 2.5-2.5 3-4c1-3 1.5-6.5 0-10-1-2.5-3.5-4-6-4z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900">DentFlow</span>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200 lg:hover:bg-gray-100"
          >
            <X className="h-4 w-4 lg:hidden" />
            <ChevronLeft className="h-4 w-4 hidden lg:block" />
          </button>
        </div>

        <div className="px-5 py-4 border-b border-gray-100 relative">
          <button
            onClick={() => setShowBranchDropdown(!showBranchDropdown)}
            className="w-full flex items-center justify-between gap-2.5 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100">
                <Building2 className="h-4 w-4 text-gray-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{selectedBranch.name}</p>
                <p className="text-xs text-gray-400">{selectedBranch.address}</p>
              </div>
            </div>
            <ChevronDown
              className={cn("h-4 w-4 text-gray-400 transition-transform", showBranchDropdown && "rotate-180")}
            />
          </button>

          {/* Branch dropdown menu */}
          {showBranchDropdown && (
            <div className="absolute left-5 right-5 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
              {branches.map((branch) => (
                <button
                  key={branch.id}
                  onClick={() => {
                    setSelectedBranch(branch)
                    setShowBranchDropdown(false)
                  }}
                  className={cn(
                    "w-full flex items-start gap-2.5 p-3 hover:bg-gray-50 transition-colors text-left",
                    selectedBranch.id === branch.id && "bg-blue-50",
                  )}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100">
                    <Building2 className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <p
                      className={cn(
                        "text-sm font-medium",
                        selectedBranch.id === branch.id ? "text-blue-600" : "text-gray-900",
                      )}
                    >
                      {branch.name}
                    </p>
                    <p className="text-xs text-gray-400">{branch.address}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navigation.map((group, groupIndex) => (
            <div key={groupIndex} className={cn(group.section ? "mb-5" : "mb-2")}>
              {group.section && (
                <p className="px-3 mb-2 text-[10px] font-semibold text-gray-400 tracking-wider uppercase">
                  {group.section}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isDashboardActive = item.name === "Dashboard" && pathname === "/"
                  const isActive =
                    isDashboardActive ||
                    (pathname === item.href && item.name !== "Dashboard") ||
                    (pathname.startsWith(item.href) && item.href !== "/" && item.name !== "Dashboard")

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 shrink-0 transition-colors duration-200",
                          isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600",
                        )}
                      />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}

          <div className="mt-4 pt-4 border-t border-gray-100 space-y-0.5">
            {bottomNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
              >
                <item.icon className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>
      </aside>
    </>
  )
}
