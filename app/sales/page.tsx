"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Download, Calendar as CalendarIcon, TrendingUp, TrendingDown, MoreHorizontal, FileText, Printer, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { BillsNestedList } from "@/components/sales/bills-nested-list"

export default function SalesPage() {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<"bill" | "payment">("bill")
    const [searchQuery, setSearchQuery] = useState("")

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <Sidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
            <div className="flex-1 lg:ml-[240px]">
                <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />
                <main className="p-4 md:p-8 max-w-[1600px] mx-auto">
                    {/* Header Section */}
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl font-bold text-[#1E293B]">Sales</h1>
                        <div className="flex items-center gap-4">
                            <div className="relative hidden md:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search for anything here..."
                                    className="pl-10 w-[300px] bg-white border-none rounded-xl shadow-sm"
                                />
                            </div>
                            <button className="h-10 w-10 flex items-center justify-center bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all">
                                <span className="text-xl">+</span>
                            </button>
                        </div>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                                <FileText className="h-6 w-6 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Revenue this month</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-[#1E293B]">$154.00</span>
                                    <div className="flex items-center gap-1 text-[#EF4444] text-xs font-medium">
                                        <TrendingDown className="h-3 w-3" />
                                        <span>-$43.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Profit this month</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-[#1E293B]">$154.00</span>
                                    <div className="flex items-center gap-1 text-[#EF4444] text-xs font-medium">
                                        <TrendingDown className="h-3 w-3" />
                                        <span>-$43.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden">
                        {/* Tabs */}
                        <div className="px-8 pt-6">
                            <div className="flex border-b border-gray-100">
                                <button
                                    onClick={() => setActiveTab("bill")}
                                    className={cn(
                                        "px-6 py-4 text-sm font-medium transition-all relative",
                                        activeTab === "bill" ? "text-primary" : "text-gray-400 hover:text-gray-600"
                                    )}
                                >
                                    Bill
                                    {activeTab === "bill" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab("payment")}
                                    className={cn(
                                        "px-6 py-4 text-sm font-medium transition-all relative",
                                        activeTab === "payment" ? "text-primary" : "text-gray-400 hover:text-gray-600"
                                    )}
                                >
                                    Payment Received
                                    {activeTab === "payment" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search name or reservation ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-11 bg-gray-50/50 border-none rounded-xl"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl shadow-sm text-sm text-gray-600 cursor-pointer">
                                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                                    <span>1 May 2021 - 30 May 2022</span>
                                    <ChevronDown className="h-4 w-4 text-gray-400 ml-2" />
                                </div>
                                <Button className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium flex items-center gap-2 shadow-lg shadow-primary/20">
                                    <Download className="h-4 w-4" />
                                    Export
                                </Button>
                            </div>
                        </div>

                        {/* Table Component */}
                        <div className="px-6 pb-6 mt-2">
                            <BillsNestedList searchQuery={searchQuery} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
