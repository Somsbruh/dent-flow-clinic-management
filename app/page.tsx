"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Star, ChevronDown } from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, BarChart } from "recharts"
import { useState } from "react"

// Mock data for charts
const cashflowData = [
  { month: "JAN", value: 2200 },
  { month: "FEB", value: 1800 },
  { month: "MAR", value: 2800 },
  { month: "APR", value: 2200 },
  { month: "MAY", value: 4500 },
  { month: "JUN", value: 10897 },
  { month: "JUL", value: 7200 },
  { month: "AUG", value: 6800 },
  { month: "SEP", value: 7800 },
  { month: "OCT", value: 8200 },
  { month: "NOV", value: 9000 },
  { month: "DEC", value: 9800 },
  { month: "JA", value: 10200 },
]

const expenseCategories = [
  { name: "Internet", value: 45, color: "#FF6B9D", amount: "$113.64" },
  { name: "Electricity", value: 26, color: "#A78BFA", amount: "$113.64" },
  { name: "Transactions", value: 22, color: "#60A5FA", amount: "$113.64" },
  { name: "Rental Cost", value: 8, color: "#34D399", amount: "$113.64" },
  { name: "Foods", value: 3, color: "#FBBF24", amount: null },
  { name: "Other", value: 2, color: "#F87171", amount: null },
]

const incomeExpenseData = [
  { month: "JAN", income: 4200, expense: 2800 },
  { month: "FEB", income: 4800, expense: 3200 },
  { month: "MAR", income: 8200, expense: 5200 },
  { month: "APR", income: 5500, expense: 4200 },
  { month: "MAY", income: 6200, expense: 5800 },
  { month: "JUN", income: 7200, expense: 6500 },
]

const popularTreatments = [
  { name: "Scaling Teeth", rating: 4.7 },
  { name: "Tooth Extraction", rating: 4.4 },
  { name: "General Checkup", rating: 4.6 },
]

const lowStockItems = [
  { name: "Dental Brush", qty: 3 },
  { name: "Charmflex Regular", qty: 2 },
]

export default function DashboardPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
      <div className="flex-1 lg:ml-[240px]">
        <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <main className="p-3 md:p-4 lg:p-5 h-[calc(100vh-64px)] overflow-hidden">
          <div className="mb-3">
            <h1 className="text-lg md:text-xl font-semibold text-gray-900">{greeting}, John!</h1>
            <p className="text-xs text-gray-500">{currentDate}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 h-[calc(100%-60px)]">
            {/* Row 1: Cashflow + Expenses */}
            {/* Cashflow Chart - spans 8 columns */}
            <Card className="lg:col-span-8 p-3 md:p-4 bg-white border-0 shadow-sm rounded-xl hover:shadow-md transition-shadow duration-300 flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-2">
                <div>
                  <h3 className="text-[10px] font-medium text-blue-500 uppercase tracking-wide">Cashflow</h3>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">TOTAL CASH</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg md:text-xl font-bold text-gray-900">$13,232</span>
                    <span className="flex items-center text-[10px] font-medium text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">
                      <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                      4.51%
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <span className="text-[10px] text-gray-400">January 2022 - December 2022</span>
                  <button className="flex items-center gap-1 text-[10px] text-gray-600 bg-gray-50 rounded-lg px-2 py-1 hover:bg-gray-100 transition-colors">
                    Last 12 month
                    <ChevronDown className="h-2.5 w-2.5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cashflowData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fontSize: 9, fill: "#9CA3AF" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `${value / 1000}K`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1E293B",
                        border: "none",
                        borderRadius: "8px",
                        padding: "6px 10px",
                        fontSize: "11px",
                      }}
                      labelStyle={{ color: "#94A3B8", fontSize: 10 }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, "Total"]}
                      cursor={{ stroke: "#3B82F6", strokeWidth: 1, strokeDasharray: "4 4" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5, fill: "#3B82F6", stroke: "#fff", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Expenses Donut - spans 4 columns */}
            <Card className="lg:col-span-4 p-3 md:p-4 bg-white border-0 shadow-sm rounded-xl hover:shadow-md transition-shadow duration-300 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">Expenses</h3>
                <button className="flex items-center gap-1 text-[10px] text-gray-600 bg-gray-50 rounded-lg px-2 py-1 hover:bg-gray-100 transition-colors">
                  Last 6 months
                  <ChevronDown className="h-2.5 w-2.5" />
                </button>
              </div>

              <div className="flex items-start gap-3 flex-1">
                <div className="relative w-28 h-28 flex-shrink-0">
                  <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" strokeWidth="10" />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#FF6B9D"
                      strokeWidth="10"
                      strokeDasharray="107 239"
                      strokeDashoffset="0"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#A78BFA"
                      strokeWidth="10"
                      strokeDasharray="62 239"
                      strokeDashoffset="-107"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#60A5FA"
                      strokeWidth="10"
                      strokeDasharray="52 239"
                      strokeDashoffset="-169"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#34D399"
                      strokeWidth="10"
                      strokeDasharray="19 239"
                      strokeDashoffset="-221"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-[8px] text-gray-400">Total Expense</p>
                    <p className="text-sm font-bold text-gray-900">$132.34</p>
                  </div>
                </div>

                <div className="flex-1 space-y-0.5 text-[10px]">
                  {expenseCategories.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between hover:bg-gray-50 px-1 py-0.5 rounded transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-gray-600">{item.name}</span>
                      </div>
                      <span className="font-medium text-gray-900">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 mt-2">
                <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">TOP EXPENSE</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { color: "bg-pink-400", name: "Internet", amount: "$113.64" },
                    { color: "bg-blue-400", name: "Transaction", amount: "$113.64" },
                    { color: "bg-purple-400", name: "Electricity", amount: "$113.64" },
                    { color: "bg-emerald-400", name: "Rental Cost", amount: "$113.64" },
                  ].map((item, i) => (
                    <div key={i} className="hover:bg-gray-50 p-1 rounded transition-colors">
                      <div className="flex items-center gap-1 mb-0.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                        <span className="text-[9px] text-gray-500">{item.name}</span>
                      </div>
                      <p className="text-xs font-semibold text-gray-900">{item.amount}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Row 2: Income & Expense + Patients/Popular Treatment + Stock */}
            {/* Income & Expense */}
            <Card className="lg:col-span-4 p-3 md:p-4 bg-white border-0 shadow-sm rounded-xl hover:shadow-md transition-shadow duration-300 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">Income & Expense</h3>
                <button className="flex items-center gap-1 text-[10px] text-gray-600 bg-gray-50 rounded-lg px-2 py-1 hover:bg-gray-100 transition-colors">
                  Last 6 months
                  <ChevronDown className="h-2.5 w-2.5" />
                </button>
              </div>
              <div className="flex gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[9px] text-gray-500 uppercase">TOTAL INCOME</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold text-gray-900">$1,412</span>
                    <span className="text-[9px] font-medium text-emerald-500 flex items-center">
                      <TrendingUp className="h-2 w-2" />
                      4.51%
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="text-[9px] text-gray-500 uppercase">TOTAL EXPENSES</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold text-gray-900">$612.34</span>
                    <span className="text-[9px] font-medium text-red-500 flex items-center">
                      <TrendingDown className="h-2 w-2" />
                      2.41%
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incomeExpenseData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fontSize: 9, fill: "#9CA3AF" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `${value / 1000}K`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1E293B",
                        border: "none",
                        borderRadius: "8px",
                        padding: "6px 10px",
                        fontSize: "10px",
                      }}
                    />
                    <Bar dataKey="income" fill="#34D399" radius={[3, 3, 0, 0]} barSize={12} />
                    <Bar dataKey="expense" fill="#FBBF24" radius={[3, 3, 0, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Patients + Popular Treatment - Combined card */}
            <Card className="lg:col-span-4 p-3 md:p-4 bg-white border-0 shadow-sm rounded-xl hover:shadow-md transition-shadow duration-300 flex flex-col">
              {/* Patients section */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">Patients</h3>
                <button className="flex items-center gap-1 text-[10px] text-gray-600 bg-gray-50 rounded-lg px-2 py-1 hover:bg-gray-100 transition-colors">
                  This month
                  <ChevronDown className="h-2.5 w-2.5" />
                </button>
              </div>
              <div className="flex gap-6 mb-2">
                <div>
                  <p className="text-2xl font-bold text-gray-900">21</p>
                  <p className="text-[10px] text-gray-500">36.52%</p>
                  <p className="text-[9px] text-gray-400">New patients</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">142</p>
                  <p className="text-[10px] text-gray-500">61.41%</p>
                  <p className="text-[9px] text-gray-400">Returning patients</p>
                </div>
              </div>
              <div className="flex gap-0.5 h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div className="bg-blue-500 rounded-full" style={{ width: "36.52%" }} />
                <div className="bg-purple-400 rounded-full" style={{ width: "61.48%" }} />
              </div>

              {/* Popular Treatment section */}
              <div className="border-t border-gray-100 pt-2 flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Popular Treatment</h3>
                <div className="space-y-0.5">
                  {popularTreatments.map((treatment, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-1.5 px-2 border-l-2 border-gray-200 hover:border-blue-400 hover:bg-gray-50 transition-all rounded-r"
                    >
                      <span className="text-xs text-gray-700">{treatment.name}</span>
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-medium text-gray-900">{treatment.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Stock availability */}
            <Card className="lg:col-span-4 p-3 md:p-4 bg-white border-0 shadow-sm rounded-xl hover:shadow-md transition-shadow duration-300 flex flex-col">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Stock availability</h3>
              <div className="flex gap-6 mb-2">
                <div>
                  <p className="text-[9px] text-gray-500 uppercase tracking-wide">TOTAL ASSET</p>
                  <p className="text-lg font-bold text-gray-900">$53,000</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 uppercase tracking-wide">TOTAL PRODUCT</p>
                  <p className="text-lg font-bold text-gray-900">442</p>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex gap-0.5 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400" style={{ width: "60%" }} />
                  <div className="bg-amber-400" style={{ width: "25%" }} />
                  <div className="bg-rose-400" style={{ width: "15%" }} />
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[9px] text-gray-500">Available</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="text-[9px] text-gray-500">Low Stock</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span className="text-[9px] text-gray-500">Out of stock</span>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wide">LOW STOCK</p>
                  <button className="text-[10px] text-blue-500 font-medium hover:text-blue-600 hover:underline transition-colors">
                    View all
                  </button>
                </div>
                <div className="space-y-1.5">
                  {lowStockItems.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-1.5 hover:bg-gray-50 px-2 rounded transition-colors"
                    >
                      <span className="text-xs text-gray-700">{item.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">Qty: {item.qty}</span>
                        <button className="text-[10px] text-blue-500 font-medium hover:text-blue-600 hover:underline transition-colors">
                          Order
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
