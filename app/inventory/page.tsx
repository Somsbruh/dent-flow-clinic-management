"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Package, AlertTriangle, Calendar, TrendingDown } from "lucide-react"
import { InventoryTable } from "@/components/inventory/inventory-table"
import { LowStockAlerts } from "@/components/inventory/low-stock-alerts"
import { inventory } from "@/lib/data"
import Link from "next/link"

export default function InventoryPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [activeTab, setActiveTab] = useState<"all" | "alerts" | "expiring">("all")

  const lowStockItems = inventory.filter((item) => item.quantity <= item.minStock)
  const expiringItems = inventory.filter((item) => {
    if (!item.expiryDate) return false
    const expiry = new Date(item.expiryDate)
    const today = new Date()
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays <= 90 && diffDays > 0
  })

  const totalValue = inventory.reduce((sum, item) => sum + item.quantity * item.costPerUnit, 0)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
      <div className="flex-1 lg:ml-[240px]">
        <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <main className="p-4 md:p-6">
          {/* Page Header - responsive */}
          <div className="mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Inventory</h1>
              <p className="mt-1 text-sm md:text-base text-muted-foreground">
                Manage equipment, medicines, and consumables
              </p>
            </div>
            <Link href="/inventory/new">
              <Button className="w-full sm:w-auto rounded-xl neu-button bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </Link>
          </div>

          {/* Stats - responsive grid */}
          <div className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="rounded-2xl bg-background p-4 md:p-6 neu-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Total Items</p>
                  <p className="text-xl md:text-2xl font-bold text-foreground">{inventory.length}</p>
                </div>
                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-primary/10 neu-button">
                  <Package className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-background p-4 md:p-6 neu-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Total Value</p>
                  <p className="text-xl md:text-2xl font-bold text-foreground">${totalValue.toLocaleString()}</p>
                </div>
                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-green-100 neu-button">
                  <TrendingDown className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-background p-4 md:p-6 neu-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Low Stock</p>
                  <p className="text-xl md:text-2xl font-bold text-red-600">{lowStockItems.length}</p>
                </div>
                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-red-100 neu-button">
                  <AlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-background p-4 md:p-6 neu-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Expiring Soon</p>
                  <p className="text-xl md:text-2xl font-bold text-amber-600">{expiringItems.length}</p>
                </div>
                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-amber-100 neu-button">
                  <Calendar className="h-5 w-5 md:h-6 md:w-6 text-amber-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation - scrollable on mobile */}
          <div className="mb-6 flex items-center gap-4 overflow-x-auto pb-2">
            <div className="flex rounded-xl bg-background neu-pressed p-1 flex-shrink-0">
              <button
                onClick={() => setActiveTab("all")}
                className={`rounded-lg px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === "all" ? "bg-primary text-primary-foreground neu-button" : "text-muted-foreground"
                }`}
              >
                All Items
              </button>
              <button
                onClick={() => setActiveTab("alerts")}
                className={`flex items-center gap-2 rounded-lg px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === "alerts" ? "bg-primary text-primary-foreground neu-button" : "text-muted-foreground"
                }`}
              >
                Low Stock
                {lowStockItems.length > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {lowStockItems.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("expiring")}
                className={`flex items-center gap-2 rounded-lg px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === "expiring" ? "bg-primary text-primary-foreground neu-button" : "text-muted-foreground"
                }`}
              >
                Expiring
                {expiringItems.length > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs text-white">
                    {expiringItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {activeTab === "all" && (
            <>
              {/* Filters - responsive */}
              <div className="mb-6 rounded-2xl bg-background p-4 neu-card">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search inventory..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 rounded-xl neu-input border-0"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full sm:w-[180px] rounded-xl neu-button border-0">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="neu-card">
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="medicine">Medicine</SelectItem>
                      <SelectItem value="consumable">Consumable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <InventoryTable searchQuery={searchQuery} categoryFilter={categoryFilter} />
            </>
          )}

          {activeTab === "alerts" && <LowStockAlerts items={lowStockItems} type="low-stock" />}

          {activeTab === "expiring" && <LowStockAlerts items={expiringItems} type="expiring" />}
        </main>
      </div>
    </div>
  )
}
