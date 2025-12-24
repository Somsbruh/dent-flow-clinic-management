"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, DollarSign, TrendingUp, CreditCard, AlertCircle } from "lucide-react"
import { InvoicesList } from "@/components/billing/invoices-list"
import { FinancialSummary } from "@/components/billing/financial-summary"
import { invoices } from "@/lib/data"
import Link from "next/link"

export default function BillingPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState<"invoices" | "reports">("invoices")

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0)
  const pendingAmount = invoices
    .filter((inv) => inv.status === "pending" || inv.status === "partial")
    .reduce((sum, inv) => sum + (inv.total - inv.paidAmount), 0)
  const overdueAmount = invoices
    .filter((inv) => inv.status === "overdue")
    .reduce((sum, inv) => sum + (inv.total - inv.paidAmount), 0)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
      <div className="flex-1 lg:ml-[240px]">
        <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <main className="p-4 md:p-6">
          {/* Page Header - responsive */}
          <div className="mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Billing & Finances</h1>
              <p className="mt-1 text-sm md:text-base text-muted-foreground">
                Manage invoices, payments, and financial reports
              </p>
            </div>
            <Link href="/billing/new">
              <Button className="w-full sm:w-auto rounded-xl neu-button bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                New Invoice
              </Button>
            </Link>
          </div>

          {/* Financial Stats - responsive grid */}
          <div className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="rounded-2xl bg-background p-4 md:p-6 neu-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-lg md:text-2xl font-bold text-foreground">${totalRevenue.toLocaleString()}</p>
                  <p className="text-xs md:text-sm text-green-600">+12% from last month</p>
                </div>
                <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 neu-button">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-background p-4 md:p-6 neu-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Pending</p>
                  <p className="text-lg md:text-2xl font-bold text-foreground">${pendingAmount.toLocaleString()}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {invoices.filter((i) => i.status === "pending").length} invoices
                  </p>
                </div>
                <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 neu-button">
                  <CreditCard className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-background p-4 md:p-6 neu-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Overdue</p>
                  <p className="text-lg md:text-2xl font-bold text-red-600">${overdueAmount.toLocaleString()}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {invoices.filter((i) => i.status === "overdue").length} invoices
                  </p>
                </div>
                <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 neu-button">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-background p-4 md:p-6 neu-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">This Month</p>
                  <p className="text-lg md:text-2xl font-bold text-foreground">$12,450</p>
                  <p className="text-xs md:text-sm text-green-600">+8% from last month</p>
                </div>
                <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 neu-button">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation - responsive */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex rounded-xl bg-background neu-pressed p-1">
              <button
                onClick={() => setActiveTab("invoices")}
                className={`rounded-lg px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-all ${
                  activeTab === "invoices" ? "bg-primary text-primary-foreground neu-button" : "text-muted-foreground"
                }`}
              >
                Invoices
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`rounded-lg px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === "reports" ? "bg-primary text-primary-foreground neu-button" : "text-muted-foreground"
                }`}
              >
                <span className="hidden sm:inline">Financial </span>Reports
              </button>
            </div>
          </div>

          {activeTab === "invoices" ? (
            <>
              {/* Filters - responsive */}
              <div className="mb-6 rounded-2xl bg-background p-4 neu-card">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by patient or invoice..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 rounded-xl neu-input border-0"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px] rounded-xl neu-button border-0">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="neu-card">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <InvoicesList searchQuery={searchQuery} statusFilter={statusFilter} />
            </>
          ) : (
            <FinancialSummary />
          )}
        </main>
      </div>
    </div>
  )
}
