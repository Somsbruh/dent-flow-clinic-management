"use client"

import { useState } from "react"
import { inventory, type InventoryItem } from "@/lib/data"
import { cn } from "@/lib/utils"
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Package,
  RefreshCw,
  Minus,
  Plus,
  X,
  AlertTriangle,
  MoreVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface InventoryTableProps {
  searchQuery: string
  categoryFilter: string
}

type ModalType = "edit" | "usage" | "restock" | "delete" | null

export function InventoryTable({ searchQuery, categoryFilter }: InventoryTableProps) {
  const [items, setItems] = useState<InventoryItem[]>(inventory)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [modalType, setModalType] = useState<ModalType>(null)

  const [usageAmount, setUsageAmount] = useState(1)
  const [usageReason, setUsageReason] = useState("")
  const [usagePatient, setUsagePatient] = useState("")
  const [restockAmount, setRestockAmount] = useState(1)
  const [editForm, setEditForm] = useState<Partial<InventoryItem>>({})

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categoryColors: Record<string, string> = {
    equipment: "bg-blue-100 text-blue-700",
    medicine: "bg-green-100 text-green-700",
    consumable: "bg-purple-100 text-purple-700",
  }

  const getStockStatus = (quantity: number, minStock: number) => {
    if (quantity <= minStock * 0.5) return { label: "Critical", color: "bg-red-100 text-red-700" }
    if (quantity <= minStock) return { label: "Low", color: "bg-amber-100 text-amber-700" }
    return { label: "In Stock", color: "bg-green-100 text-green-700" }
  }

  const openUsageModal = (item: InventoryItem) => {
    setSelectedItem(item)
    setUsageAmount(1)
    setUsageReason("")
    setUsagePatient("")
    setModalType("usage")
  }

  const openRestockModal = (item: InventoryItem) => {
    setSelectedItem(item)
    setRestockAmount(1)
    setModalType("restock")
  }

  const openEditModal = (item: InventoryItem) => {
    setSelectedItem(item)
    setEditForm({ ...item })
    setModalType("edit")
  }

  const openDeleteModal = (item: InventoryItem) => {
    setSelectedItem(item)
    setModalType("delete")
  }

  const closeModal = () => {
    setSelectedItem(null)
    setModalType(null)
  }

  const handleUsageSubmit = () => {
    if (!selectedItem || usageAmount <= 0) return
    setItems(
      items.map((item) =>
        item.id === selectedItem.id ? { ...item, quantity: Math.max(0, item.quantity - usageAmount) } : item,
      ),
    )
    closeModal()
  }

  const handleRestockSubmit = () => {
    if (!selectedItem || restockAmount <= 0) return
    setItems(
      items.map((item) => (item.id === selectedItem.id ? { ...item, quantity: item.quantity + restockAmount } : item)),
    )
    closeModal()
  }

  const handleEditSubmit = () => {
    if (!selectedItem) return
    setItems(items.map((item) => (item.id === selectedItem.id ? { ...item, ...editForm } : item)))
    closeModal()
  }

  const handleDelete = () => {
    if (!selectedItem) return
    setItems(items.filter((item) => item.id !== selectedItem.id))
    closeModal()
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block rounded-2xl bg-background neu-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Item</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Category</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Quantity</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Min Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Cost/Unit</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Supplier</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Expiry</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Quick Actions</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">More</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const stockStatus = getStockStatus(item.quantity, item.minStock)
                return (
                  <tr
                    key={item.id}
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 neu-button">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-medium capitalize",
                          categoryColors[item.category],
                        )}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-foreground">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">{item.minStock}</td>
                    <td className="px-6 py-4">
                      <span className={cn("rounded-full px-3 py-1 text-xs font-medium", stockStatus.color)}>
                        {stockStatus.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-foreground">${item.costPerUnit.toFixed(2)}</td>
                    <td className="px-6 py-4 text-muted-foreground">{item.supplier || "-"}</td>
                    <td className="px-6 py-4 text-muted-foreground">{item.expiryDate || "-"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openUsageModal(item)}
                          className="rounded-xl neu-button border-0 bg-red-50 text-red-600 hover:bg-red-100"
                        >
                          <Minus className="h-4 w-4 mr-1" />
                          Use
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openRestockModal(item)}
                          className="rounded-xl neu-button border-0 bg-green-50 text-green-600 hover:bg-green-100"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-xl">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="neu-card">
                          <DropdownMenuItem onClick={() => openRestockModal(item)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Restock
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openUsageModal(item)}>
                            <Minus className="mr-2 h-4 w-4" />
                            Record Usage
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditModal(item)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Item
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => openDeleteModal(item)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {filteredItems.map((item) => {
          const stockStatus = getStockStatus(item.quantity, item.minStock)
          return (
            <div key={item.id} className="rounded-xl bg-background p-4 neu-card">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.id}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="neu-card">
                    <DropdownMenuItem onClick={() => openRestockModal(item)}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Restock
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openUsageModal(item)}>
                      <Minus className="mr-2 h-4 w-4" />
                      Record Usage
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openEditModal(item)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Item
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={() => openDeleteModal(item)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                    categoryColors[item.category],
                  )}
                >
                  {item.category}
                </span>
                <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", stockStatus.color)}>
                  {stockStatus.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div>
                  <p className="text-muted-foreground text-xs">Quantity</p>
                  <p className="font-semibold">
                    {item.quantity} {item.unit}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Cost/Unit</p>
                  <p className="font-medium">${item.costPerUnit.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Min Stock</p>
                  <p className="font-medium">{item.minStock}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Supplier</p>
                  <p className="font-medium truncate">{item.supplier || "-"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openUsageModal(item)}
                  className="flex-1 rounded-xl neu-button border-0 bg-red-50 text-red-600 hover:bg-red-100"
                >
                  <Minus className="h-4 w-4 mr-1" />
                  Use
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openRestockModal(item)}
                  className="flex-1 rounded-xl neu-button border-0 bg-green-50 text-green-600 hover:bg-green-100"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Usage Modal - responsive */}
      {modalType === "usage" && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-background p-4 md:p-6 neu-card max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-bold text-foreground">Record Usage</h2>
              <Button variant="ghost" size="icon" onClick={closeModal} className="rounded-xl">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="mb-4 p-3 md:p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Package className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm md:text-base">{selectedItem.name}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Current stock:{" "}
                    <span className="font-medium">
                      {selectedItem.quantity} {selectedItem.unit}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {selectedItem.quantity <= selectedItem.minStock && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-amber-700">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <span className="text-xs md:text-sm">Low stock warning - consider reordering soon</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label className="text-foreground text-sm">Quantity Used</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setUsageAmount(Math.max(1, usageAmount - 1))}
                    className="rounded-xl neu-button border-0 h-10 w-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={usageAmount}
                    onChange={(e) =>
                      setUsageAmount(Math.max(1, Math.min(selectedItem.quantity, Number.parseInt(e.target.value) || 1)))
                    }
                    className="text-center rounded-xl neu-input border-0 flex-1"
                    min={1}
                    max={selectedItem.quantity}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setUsageAmount(Math.min(selectedItem.quantity, usageAmount + 1))}
                    className="rounded-xl neu-button border-0 h-10 w-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <span className="text-muted-foreground text-sm">{selectedItem.unit}</span>
                </div>
              </div>

              <div>
                <Label className="text-foreground text-sm">Patient (Optional)</Label>
                <Input
                  placeholder="Search patient..."
                  value={usagePatient}
                  onChange={(e) => setUsagePatient(e.target.value)}
                  className="mt-2 rounded-xl neu-input border-0"
                />
              </div>

              <div>
                <Label className="text-foreground text-sm">Reason / Notes</Label>
                <Select value={usageReason} onValueChange={setUsageReason}>
                  <SelectTrigger className="mt-2 rounded-xl neu-button border-0">
                    <SelectValue placeholder="Select reason..." />
                  </SelectTrigger>
                  <SelectContent className="neu-card">
                    <SelectItem value="treatment">Treatment Procedure</SelectItem>
                    <SelectItem value="sterilization">Sterilization</SelectItem>
                    <SelectItem value="maintenance">Equipment Maintenance</SelectItem>
                    <SelectItem value="damaged">Damaged/Expired</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-3 md:p-4 rounded-xl bg-red-50">
                <p className="text-xs md:text-sm text-red-700">
                  After this usage, remaining stock will be:{" "}
                  <span className="font-bold">
                    {selectedItem.quantity - usageAmount} {selectedItem.unit}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-6">
              <Button
                variant="outline"
                onClick={closeModal}
                className="flex-1 rounded-xl neu-button border-0 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUsageSubmit}
                className="flex-1 rounded-xl bg-red-600 text-white hover:bg-red-700"
                disabled={usageAmount <= 0 || usageAmount > selectedItem.quantity}
              >
                <Minus className="h-4 w-4 mr-2" />
                Record Usage
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Restock Modal - responsive */}
      {modalType === "restock" && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-background p-4 md:p-6 neu-card max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-bold text-foreground">Restock Item</h2>
              <Button variant="ghost" size="icon" onClick={closeModal} className="rounded-xl">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="mb-4 p-3 md:p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Package className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm md:text-base">{selectedItem.name}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Current stock:{" "}
                    <span className="font-medium">
                      {selectedItem.quantity} {selectedItem.unit}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-foreground text-sm">Quantity to Add</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setRestockAmount(Math.max(1, restockAmount - 1))}
                    className="rounded-xl neu-button border-0 h-10 w-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={restockAmount}
                    onChange={(e) => setRestockAmount(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    className="text-center rounded-xl neu-input border-0 flex-1"
                    min={1}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setRestockAmount(restockAmount + 1)}
                    className="rounded-xl neu-button border-0 h-10 w-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <span className="text-muted-foreground text-sm">{selectedItem.unit}</span>
                </div>
              </div>

              {/* Quick add buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRestockAmount(10)}
                  className="rounded-xl neu-button border-0"
                >
                  +10
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRestockAmount(25)}
                  className="rounded-xl neu-button border-0"
                >
                  +25
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRestockAmount(50)}
                  className="rounded-xl neu-button border-0"
                >
                  +50
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRestockAmount(100)}
                  className="rounded-xl neu-button border-0"
                >
                  +100
                </Button>
              </div>

              <div className="p-3 md:p-4 rounded-xl bg-green-50">
                <p className="text-xs md:text-sm text-green-700">
                  After restocking, total stock will be:{" "}
                  <span className="font-bold">
                    {selectedItem.quantity + restockAmount} {selectedItem.unit}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-6">
              <Button
                variant="outline"
                onClick={closeModal}
                className="flex-1 rounded-xl neu-button border-0 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRestockSubmit}
                className="flex-1 rounded-xl bg-green-600 text-white hover:bg-green-700"
                disabled={restockAmount <= 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Stock
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal - responsive */}
      {modalType === "edit" && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-background p-4 md:p-6 neu-card max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-bold text-foreground">Edit Item</h2>
              <Button variant="ghost" size="icon" onClick={closeModal} className="rounded-xl">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-foreground text-sm">Item Name</Label>
                <Input
                  value={editForm.name || ""}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="mt-2 rounded-xl neu-input border-0"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-foreground text-sm">Category</Label>
                  <Select
                    value={editForm.category}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, category: value as "equipment" | "medicine" | "consumable" })
                    }
                  >
                    <SelectTrigger className="mt-2 rounded-xl neu-button border-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="neu-card">
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="medicine">Medicine</SelectItem>
                      <SelectItem value="consumable">Consumable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-foreground text-sm">Unit</Label>
                  <Input
                    value={editForm.unit || ""}
                    onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                    className="mt-2 rounded-xl neu-input border-0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-foreground text-sm">Minimum Stock Level</Label>
                  <Input
                    type="number"
                    value={editForm.minStock || 0}
                    onChange={(e) => setEditForm({ ...editForm, minStock: Number.parseInt(e.target.value) || 0 })}
                    className="mt-2 rounded-xl neu-input border-0"
                  />
                </div>

                <div>
                  <Label className="text-foreground text-sm">Cost per Unit ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editForm.costPerUnit || 0}
                    onChange={(e) => setEditForm({ ...editForm, costPerUnit: Number.parseFloat(e.target.value) || 0 })}
                    className="mt-2 rounded-xl neu-input border-0"
                  />
                </div>
              </div>

              <div>
                <Label className="text-foreground text-sm">Supplier</Label>
                <Input
                  value={editForm.supplier || ""}
                  onChange={(e) => setEditForm({ ...editForm, supplier: e.target.value })}
                  className="mt-2 rounded-xl neu-input border-0"
                />
              </div>

              <div>
                <Label className="text-foreground text-sm">Expiry Date</Label>
                <Input
                  type="date"
                  value={editForm.expiryDate || ""}
                  onChange={(e) => setEditForm({ ...editForm, expiryDate: e.target.value })}
                  className="mt-2 rounded-xl neu-input border-0"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-6">
              <Button
                variant="outline"
                onClick={closeModal}
                className="flex-1 rounded-xl neu-button border-0 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditSubmit}
                className="flex-1 rounded-xl neu-button bg-primary text-primary-foreground"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal - responsive */}
      {modalType === "delete" && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-background p-4 md:p-6 neu-card">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-bold text-foreground">Delete Item</h2>
              <Button variant="ghost" size="icon" onClick={closeModal} className="rounded-xl">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="mb-4 p-3 md:p-4 rounded-xl bg-red-50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-red-100">
                  <AlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-red-700 text-sm md:text-base">Delete {selectedItem.name}?</p>
                  <p className="text-xs md:text-sm text-red-600">This action cannot be undone.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={closeModal}
                className="flex-1 rounded-xl neu-button border-0 bg-transparent"
              >
                Cancel
              </Button>
              <Button onClick={handleDelete} className="flex-1 rounded-xl bg-red-600 text-white hover:bg-red-700">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Item
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
