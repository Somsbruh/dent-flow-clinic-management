"use client"

import { invoices } from "@/lib/data"
import { cn } from "@/lib/utils"
import { MoreHorizontal, Eye, Send, Download, Trash2, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface InvoicesListProps {
  searchQuery: string
  statusFilter: string
}

export function InvoicesList({ searchQuery, statusFilter }: InvoicesListProps) {
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusColors: Record<string, string> = {
    paid: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    partial: "bg-blue-100 text-blue-700",
    overdue: "bg-red-100 text-red-700",
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block rounded-2xl bg-background neu-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Invoice</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Patient</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Due Date</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Amount</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Paid</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link href={`/billing/${invoice.id}`}>
                      <p className="font-medium text-primary hover:underline">{invoice.id}</p>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
                        {invoice.patientName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span className="font-medium text-foreground">{invoice.patientName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{invoice.createdAt}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{invoice.dueDate}</td>
                  <td className="px-6 py-4 text-right font-semibold text-foreground">
                    ${invoice.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-green-600">
                    ${invoice.paidAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("rounded-full px-3 py-1 text-xs font-medium", statusColors[invoice.status])}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-xl">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="neu-card">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Send className="mr-2 h-4 w-4" />
                          Send Reminder
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
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
        {filteredInvoices.map((invoice) => (
          <div key={invoice.id} className="rounded-xl bg-background p-4 neu-card">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
                  {invoice.patientName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <Link href={`/billing/${invoice.id}`}>
                    <p className="font-medium text-primary hover:underline text-sm">{invoice.id}</p>
                  </Link>
                  <p className="font-medium text-foreground">{invoice.patientName}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="neu-card">
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Send className="mr-2 h-4 w-4" />
                    Send Reminder
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div>
                <p className="text-muted-foreground text-xs">Date</p>
                <p className="font-medium">{invoice.createdAt}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Due Date</p>
                <p className="font-medium">{invoice.dueDate}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-muted-foreground text-xs">Amount</p>
                  <p className="font-semibold">${invoice.total.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Paid</p>
                  <p className="font-medium text-green-600">${invoice.paidAmount.toLocaleString()}</p>
                </div>
              </div>
              <span className={cn("rounded-full px-3 py-1 text-xs font-medium", statusColors[invoice.status])}>
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
