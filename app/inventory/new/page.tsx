"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function NewInventoryItemPage() {
  const [category, setCategory] = useState("")

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 pl-64">
        <Header />
        <main className="p-6">
          {/* Back Button */}
          <Link
            href="/inventory"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Inventory
          </Link>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Add New Item</h1>
            <p className="mt-1 text-muted-foreground">Add a new item to inventory</p>
          </div>

          <form className="space-y-8 max-w-3xl">
            {/* Basic Information */}
            <div className="rounded-2xl bg-background p-6 neu-card">
              <h2 className="text-lg font-semibold text-foreground mb-6">Item Information</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name</Label>
                  <Input id="name" placeholder="Enter item name" className="rounded-xl neu-input border-0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="rounded-xl neu-button border-0">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="neu-card">
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="medicine">Medicine</SelectItem>
                      <SelectItem value="consumable">Consumable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Initial Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    placeholder="Enter quantity"
                    className="rounded-xl neu-input border-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select>
                    <SelectTrigger className="rounded-xl neu-button border-0">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent className="neu-card">
                      <SelectItem value="pieces">Pieces</SelectItem>
                      <SelectItem value="boxes">Boxes</SelectItem>
                      <SelectItem value="vials">Vials</SelectItem>
                      <SelectItem value="pairs">Pairs</SelectItem>
                      <SelectItem value="syringes">Syringes</SelectItem>
                      <SelectItem value="packets">Packets</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Minimum Stock Level</Label>
                  <Input
                    id="minStock"
                    type="number"
                    min="0"
                    placeholder="Alert threshold"
                    className="rounded-xl neu-input border-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costPerUnit">Cost per Unit ($)</Label>
                  <Input
                    id="costPerUnit"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="rounded-xl neu-input border-0"
                  />
                </div>
              </div>
            </div>

            {/* Supplier & Expiry */}
            <div className="rounded-2xl bg-background p-6 neu-card">
              <h2 className="text-lg font-semibold text-foreground mb-6">Supplier & Expiry</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input id="supplier" placeholder="Enter supplier name" className="rounded-xl neu-input border-0" />
                </div>
                {(category === "medicine" || category === "consumable") && (
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input id="expiryDate" type="date" className="rounded-xl neu-input border-0" />
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Link href="/inventory">
                <Button variant="outline" className="rounded-xl neu-button border-0 bg-transparent">
                  Cancel
                </Button>
              </Link>
              <Button className="rounded-xl neu-button bg-primary text-primary-foreground">
                <Save className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
