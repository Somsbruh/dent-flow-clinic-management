import type { InventoryItem } from "@/lib/data"
import { AlertTriangle, Clock, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LowStockAlertsProps {
  items: InventoryItem[]
  type: "low-stock" | "expiring"
}

export function LowStockAlerts({ items, type }: LowStockAlertsProps) {
  const getDaysUntilExpiry = (expiryDate?: string) => {
    if (!expiryDate) return null
    const expiry = new Date(expiryDate)
    const today = new Date()
    return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl bg-background p-12 text-center neu-card">
        <div className="flex justify-center mb-4">
          {type === "low-stock" ? (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
              <AlertTriangle className="h-8 w-8 text-green-600" />
            </div>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          )}
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          {type === "low-stock" ? "No Low Stock Items" : "No Items Expiring Soon"}
        </h3>
        <p className="mt-2 text-muted-foreground">
          {type === "low-stock"
            ? "All inventory items are well stocked."
            : "No items are expiring within the next 90 days."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {type === "low-stock" && (
        <div className="rounded-2xl bg-red-50 p-4 neu-card border-l-4 border-red-500">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-semibold text-red-700">{items.length} items need restocking</p>
              <p className="text-sm text-red-600">Stock levels are below minimum thresholds</p>
            </div>
          </div>
        </div>
      )}

      {type === "expiring" && (
        <div className="rounded-2xl bg-amber-50 p-4 neu-card border-l-4 border-amber-500">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-700">{items.length} items expiring soon</p>
              <p className="text-sm text-amber-600">Items expiring within 90 days</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate)
          const stockPercentage = (item.quantity / item.minStock) * 100

          return (
            <div key={item.id} className="rounded-2xl bg-background p-6 neu-card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
                </div>
                {type === "low-stock" ? (
                  <span
                    className={cn(
                      "rounded-full px-2 py-1 text-xs font-medium",
                      stockPercentage <= 50 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700",
                    )}
                  >
                    {stockPercentage <= 50 ? "Critical" : "Low"}
                  </span>
                ) : (
                  <span
                    className={cn(
                      "rounded-full px-2 py-1 text-xs font-medium",
                      daysUntilExpiry && daysUntilExpiry <= 30
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700",
                    )}
                  >
                    {daysUntilExpiry} days
                  </span>
                )}
              </div>

              {type === "low-stock" ? (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current</span>
                    <span className="font-semibold text-foreground">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Minimum</span>
                    <span className="text-foreground">
                      {item.minStock} {item.unit}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn("h-full rounded-full", stockPercentage <= 50 ? "bg-red-500" : "bg-amber-500")}
                      style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Expiry Date</span>
                    <span className="font-semibold text-foreground">{item.expiryDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Quantity</span>
                    <span className="text-foreground">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                </div>
              )}

              <Button className="w-full mt-4 rounded-xl neu-button bg-primary text-primary-foreground">
                <ShoppingCart className="mr-2 h-4 w-4" />
                {type === "low-stock" ? "Order Now" : "Review Item"}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
