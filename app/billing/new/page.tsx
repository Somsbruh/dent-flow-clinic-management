"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Plus, Trash2, Search } from "lucide-react"
import Link from "next/link"
import { patients, treatmentTypes } from "@/lib/data"

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export default function NewInvoicePage() {
  const [selectedPatient, setSelectedPatient] = useState("")
  const [patientSearch, setPatientSearch] = useState("")
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [discount, setDiscount] = useState(0)
  const [taxRate] = useState(8)

  const filteredPatients = patients.filter(
    (p) =>
      p.firstName.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.lastName.toLowerCase().includes(patientSearch.toLowerCase()),
  )

  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0 }])
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value }
        }
        return item
      }),
    )
  }

  const selectTreatment = (id: string, treatmentId: string) => {
    const treatment = treatmentTypes.find((t) => t.id === treatmentId)
    if (treatment) {
      updateItem(id, "description", treatment.name)
      updateItem(id, "unitPrice", treatment.basePrice)
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const taxAmount = (subtotal - discount) * (taxRate / 100)
  const total = subtotal - discount + taxAmount

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 pl-64">
        <Header />
        <main className="p-6">
          {/* Back Button */}
          <Link
            href="/billing"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Billing
          </Link>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">New Invoice</h1>
            <p className="mt-1 text-muted-foreground">Create a new invoice for a patient</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Patient Selection */}
              <div className="rounded-2xl bg-background p-6 neu-card">
                <h2 className="text-lg font-semibold text-foreground mb-4">Select Patient</h2>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search patients..."
                      value={patientSearch}
                      onChange={(e) => setPatientSearch(e.target.value)}
                      className="pl-10 rounded-xl neu-input border-0"
                    />
                  </div>
                  <div className="max-h-[200px] overflow-y-auto space-y-2">
                    {filteredPatients.slice(0, 5).map((patient) => (
                      <button
                        key={patient.id}
                        type="button"
                        onClick={() => setSelectedPatient(patient.id)}
                        className={`w-full rounded-xl p-3 text-left transition-all ${
                          selectedPatient === patient.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 hover:bg-muted"
                        }`}
                      >
                        <p className="font-medium">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p
                          className={`text-sm ${selectedPatient === patient.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                        >
                          {patient.phone}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Invoice Items */}
              <div className="rounded-2xl bg-background p-6 neu-card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">Invoice Items</h2>
                  <Button
                    type="button"
                    onClick={addItem}
                    className="rounded-xl neu-button bg-primary text-primary-foreground"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>

                {items.length === 0 ? (
                  <div className="rounded-xl border-2 border-dashed border-border p-8 text-center">
                    <p className="text-muted-foreground">No items added yet. Click &quot;Add Item&quot; to start.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div key={item.id} className="rounded-xl bg-muted/30 p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-1 grid gap-4 md:grid-cols-4">
                            <div className="md:col-span-2 space-y-2">
                              <Label>Treatment / Description</Label>
                              <Select onValueChange={(v) => selectTreatment(item.id, v)}>
                                <SelectTrigger className="rounded-xl neu-button border-0">
                                  <SelectValue placeholder="Select treatment" />
                                </SelectTrigger>
                                <SelectContent className="neu-card">
                                  {treatmentTypes.map((treatment) => (
                                    <SelectItem key={treatment.id} value={treatment.id}>
                                      {treatment.name} (${treatment.basePrice})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Input
                                value={item.description}
                                onChange={(e) => updateItem(item.id, "description", e.target.value)}
                                placeholder="Or enter custom description"
                                className="rounded-xl neu-input border-0"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Quantity</Label>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 1)}
                                className="rounded-xl neu-input border-0"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Unit Price</Label>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.unitPrice}
                                onChange={(e) =>
                                  updateItem(item.id, "unitPrice", Number.parseFloat(e.target.value) || 0)
                                }
                                className="rounded-xl neu-input border-0"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <p className="font-semibold text-foreground">
                              ${(item.quantity * item.unitPrice).toFixed(2)}
                            </p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              className="rounded-lg text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-6">
              <div className="rounded-2xl bg-background p-6 neu-card sticky top-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Invoice Summary</h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input type="date" className="rounded-xl neu-input border-0" />
                  </div>

                  <div className="space-y-2">
                    <Label>Discount ($)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={discount}
                      onChange={(e) => setDiscount(Number.parseFloat(e.target.value) || 0)}
                      className="rounded-xl neu-input border-0"
                    />
                  </div>

                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Discount</span>
                      <span className="font-medium text-red-600">-${discount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax ({taxRate}%)</span>
                      <span className="font-medium text-foreground">${taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <Button className="w-full rounded-xl neu-button bg-primary text-primary-foreground">
                      <Save className="mr-2 h-4 w-4" />
                      Create Invoice
                    </Button>
                    <Link href="/billing">
                      <Button variant="outline" className="w-full rounded-xl neu-button border-0 bg-transparent">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
