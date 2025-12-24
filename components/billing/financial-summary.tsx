"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const revenueData = [
  { month: "Jan", revenue: 28000, expenses: 12000 },
  { month: "Feb", revenue: 32000, expenses: 13500 },
  { month: "Mar", revenue: 29000, expenses: 11000 },
  { month: "Apr", revenue: 35000, expenses: 14000 },
  { month: "May", revenue: 38000, expenses: 15000 },
  { month: "Jun", revenue: 42000, expenses: 16000 },
  { month: "Jul", revenue: 45000, expenses: 17000 },
  { month: "Aug", revenue: 41000, expenses: 15500 },
  { month: "Sep", revenue: 48000, expenses: 18000 },
  { month: "Oct", revenue: 52000, expenses: 19000 },
  { month: "Nov", revenue: 55000, expenses: 20000 },
  { month: "Dec", revenue: 58000, expenses: 21000 },
]

const treatmentRevenueData = [
  { name: "Root Canal", revenue: 15200 },
  { name: "Cleaning", revenue: 8400 },
  { name: "Crowns", revenue: 12800 },
  { name: "Fillings", revenue: 6200 },
  { name: "Extractions", revenue: 4800 },
  { name: "Whitening", revenue: 3600 },
]

const paymentMethodData = [
  { name: "Cash", value: 35, color: "#3b82f6" },
  { name: "Card", value: 45, color: "#10b981" },
  { name: "Insurance", value: 15, color: "#f59e0b" },
  { name: "Installment", value: 5, color: "#8b5cf6" },
]

export function FinancialSummary() {
  return (
    <div className="space-y-6">
      {/* Revenue Chart */}
      <div className="rounded-2xl bg-background p-6 neu-card">
        <h2 className="text-lg font-semibold text-foreground mb-6">Revenue vs Expenses</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stackId="2"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.3}
                name="Expenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Treatment Revenue */}
        <div className="rounded-2xl bg-background p-6 neu-card">
          <h2 className="text-lg font-semibold text-foreground mb-6">Revenue by Treatment</h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={treatmentRevenueData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  type="number"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickFormatter={(v) => `$${v / 1000}k`}
                />
                <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" fontSize={12} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="rounded-2xl bg-background p-6 neu-card">
          <h2 className="text-lg font-semibold text-foreground mb-6">Payment Methods</h2>
          <div className="flex items-center gap-8">
            <div className="h-[200px] w-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                    }}
                    formatter={(value: number) => [`${value}%`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {paymentMethodData.map((method) => (
                <div key={method.name} className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: method.color }} />
                  <span className="text-sm text-muted-foreground">{method.name}</span>
                  <span className="font-medium text-foreground">{method.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-background p-4 neu-card">
          <p className="text-sm text-muted-foreground">Daily Average</p>
          <p className="text-xl font-bold text-foreground">$1,850</p>
        </div>
        <div className="rounded-2xl bg-background p-4 neu-card">
          <p className="text-sm text-muted-foreground">Highest Day</p>
          <p className="text-xl font-bold text-foreground">$4,200</p>
        </div>
        <div className="rounded-2xl bg-background p-4 neu-card">
          <p className="text-sm text-muted-foreground">Collection Rate</p>
          <p className="text-xl font-bold text-green-600">94.5%</p>
        </div>
        <div className="rounded-2xl bg-background p-4 neu-card">
          <p className="text-sm text-muted-foreground">Avg. Invoice</p>
          <p className="text-xl font-bold text-foreground">$385</p>
        </div>
      </div>
    </div>
  )
}
