"use client"

import { useState } from "react"
import { X, CreditCard, Banknote, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface PaymentModalProps {
  invoiceId: string
  balanceDue: number
  onClose: () => void
}

type PaymentMethod = "cash" | "card" | "insurance"

export function PaymentModal({ invoiceId, balanceDue, onClose }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [amount, setAmount] = useState(balanceDue.toString())

  const methods = [
    { id: "cash" as PaymentMethod, label: "Cash", icon: Banknote },
    { id: "card" as PaymentMethod, label: "Card", icon: CreditCard },
    { id: "insurance" as PaymentMethod, label: "Insurance", icon: Building2 },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-background p-6 neu-card">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Record Payment</h2>
            <p className="text-sm text-muted-foreground">Invoice {invoiceId}</p>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-muted-foreground hover:bg-muted transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Balance Due */}
        <div className="mb-6 rounded-xl bg-primary/5 p-4 text-center">
          <p className="text-sm text-muted-foreground">Balance Due</p>
          <p className="text-3xl font-bold text-primary">${balanceDue.toFixed(2)}</p>
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <Label className="mb-3 block">Payment Method</Label>
          <div className="grid grid-cols-3 gap-3">
            {methods.map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl p-4 transition-all",
                  paymentMethod === method.id
                    ? "bg-primary text-primary-foreground neu-pressed"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted neu-button",
                )}
              >
                <method.icon className="h-6 w-6" />
                <span className="text-sm font-medium">{method.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div className="mb-6 space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="rounded-xl neu-input border-0 text-lg font-semibold"
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg text-xs bg-transparent"
              onClick={() => setAmount(balanceDue.toFixed(2))}
            >
              Full Amount
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg text-xs bg-transparent"
              onClick={() => setAmount((balanceDue / 2).toFixed(2))}
            >
              Half
            </Button>
          </div>
        </div>

        {/* Card Details (if card selected) */}
        {paymentMethod === "card" && (
          <div className="mb-6 space-y-4 rounded-xl bg-muted/30 p-4">
            <div className="space-y-2">
              <Label>Card Number</Label>
              <Input placeholder="1234 5678 9012 3456" className="rounded-xl neu-input border-0" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Expiry</Label>
                <Input placeholder="MM/YY" className="rounded-xl neu-input border-0" />
              </div>
              <div className="space-y-2">
                <Label>CVV</Label>
                <Input placeholder="123" className="rounded-xl neu-input border-0" />
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 rounded-xl neu-button border-0 bg-transparent" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1 rounded-xl neu-button bg-green-600 text-white hover:bg-green-700">
            Record Payment
          </Button>
        </div>
      </div>
    </div>
  )
}
