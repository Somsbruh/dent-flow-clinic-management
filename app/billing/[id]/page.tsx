"use client"

import { use } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Send, Printer, CreditCard } from "lucide-react"
import Link from "next/link"
import { invoices } from "@/lib/data"
import { cn } from "@/lib/utils"
import { PaymentModal } from "@/components/billing/payment-modal"
import { useState } from "react"

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const invoice = invoices.find((inv) => inv.id === id)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  if (!invoice) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Invoice not found</h1>
          <Link href="/billing">
            <Button className="mt-4">Back to Billing</Button>
          </Link>
        </div>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    paid: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    partial: "bg-blue-100 text-blue-700",
    overdue: "bg-red-100 text-red-700",
  }

  const balance = invoice.total - invoice.paidAmount

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

          {/* Invoice Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-foreground">{invoice.id}</h1>
                <span className={cn("rounded-full px-3 py-1 text-sm font-medium", statusColors[invoice.status])}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </div>
              <p className="mt-1 text-muted-foreground">Created on {invoice.createdAt}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="rounded-xl neu-button border-0 bg-transparent">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" className="rounded-xl neu-button border-0 bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" className="rounded-xl neu-button border-0 bg-transparent">
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
              {invoice.status !== "paid" && (
                <Button
                  className="rounded-xl neu-button bg-green-600 text-white hover:bg-green-700"
                  onClick={() => setShowPaymentModal(true)}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Record Payment
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Invoice Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Patient Info */}
              <div className="rounded-2xl bg-background p-6 neu-card">
                <h2 className="text-lg font-semibold text-foreground mb-4">Bill To</h2>
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-lg font-semibold text-primary-foreground neu-button">
                    {invoice.patientName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-lg">{invoice.patientName}</p>
                    <p className="text-muted-foreground">Patient ID: {invoice.patientId}</p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="rounded-2xl bg-background p-6 neu-card">
                <h2 className="text-lg font-semibold text-foreground mb-4">Invoice Items</h2>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-3 text-left text-sm font-semibold text-foreground">Description</th>
                      <th className="pb-3 text-center text-sm font-semibold text-foreground">Qty</th>
                      <th className="pb-3 text-right text-sm font-semibold text-foreground">Unit Price</th>
                      <th className="pb-3 text-right text-sm font-semibold text-foreground">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={index} className="border-b border-border last:border-0">
                        <td className="py-4 text-foreground">{item.description}</td>
                        <td className="py-4 text-center text-muted-foreground">{item.quantity}</td>
                        <td className="py-4 text-right text-muted-foreground">${item.unitPrice.toFixed(2)}</td>
                        <td className="py-4 text-right font-medium text-foreground">${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-6">
              <div className="rounded-2xl bg-background p-6 neu-card">
                <h2 className="text-lg font-semibold text-foreground mb-4">Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-foreground">${invoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium text-foreground">${invoice.tax.toFixed(2)}</span>
                  </div>
                  {invoice.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Discount</span>
                      <span className="font-medium text-red-600">-${invoice.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-border pt-3">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-bold text-lg text-foreground">${invoice.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Paid</span>
                    <span className="font-medium text-green-600">${invoice.paidAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-3">
                    <span className="font-semibold text-foreground">Balance Due</span>
                    <span className={cn("font-bold text-lg", balance > 0 ? "text-red-600" : "text-green-600")}>
                      ${balance.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-background p-6 neu-card">
                <h2 className="text-lg font-semibold text-foreground mb-4">Payment Info</h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Due Date</span>
                    <span className="font-medium text-foreground">{invoice.dueDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payment Terms</span>
                    <span className="font-medium text-foreground">Net 15</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showPaymentModal && (
            <PaymentModal invoiceId={invoice.id} balanceDue={balance} onClose={() => setShowPaymentModal(false)} />
          )}
        </main>
      </div>
    </div>
  )
}
