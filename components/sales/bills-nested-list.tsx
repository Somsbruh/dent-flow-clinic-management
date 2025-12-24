"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { MoreVertical, Download, Printer, ChevronDown, ChevronRight, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock Data for the Sales Page
const SALES_DATA = [
    {
        id: "#RSV008",
        isNew: true,
        patient: {
            name: "Albert Flores",
            avatar: "https://i.pravatar.cc/150?u=albert",
        },
        billCount: "0/2",
        date: "24/05/2022",
        amount: "2.311",
        status: "PARTIALLY PAID",
        bills: []
    },
    {
        id: "#RSV007",
        isNew: false,
        patient: {
            name: "Esther Howard",
            avatar: "https://i.pravatar.cc/150?u=esther",
        },
        billCount: "0/2",
        date: "23/05/2022",
        amount: "535",
        status: "PARTIALLY PAID",
        bills: [
            {
                id: "#1244",
                type: "Booking Fee",
                amount: "100",
                status: "UNPAID"
            },
            {
                id: "#1243",
                type: "2 Treatment(s)",
                amount: "435",
                status: "SET_PAYMENT" // Custom status for the button
            }
        ]
    },
    {
        id: "#RSV006",
        isNew: false,
        patient: {
            name: "Kathryn Murphy",
            avatar: "https://i.pravatar.cc/150?u=kathryn",
        },
        billCount: "2/2",
        date: "19/05/2022",
        amount: "645",
        status: "FULLY PAID",
        bills: []
    },
    {
        id: "#RSV005",
        isNew: false,
        patient: {
            name: "Brooklyn Simmons",
            avatar: "https://i.pravatar.cc/150?u=brooklyn",
        },
        billCount: "2/2",
        date: "19/05/2022",
        amount: "667",
        status: "FULLY PAID",
        bills: []
    },
    {
        id: "#RSV004",
        isNew: false,
        patient: {
            name: "Bessie Cooper",
            avatar: "https://i.pravatar.cc/150?u=bessie",
        },
        billCount: "1/2",
        date: "18/05/2022",
        amount: "343",
        status: "FULLY PAID",
        bills: []
    }
]

interface BillsNestedListProps {
    searchQuery: string
}

export function BillsNestedList({ searchQuery }: BillsNestedListProps) {
    const [expandedRows, setExpandedRows] = useState<string[]>(["#RSV007"]) // Default expanded for demo

    const toggleRow = (id: string) => {
        setExpandedRows(prev =>
            prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
        )
    }

    const filteredData = SALES_DATA.filter(item =>
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.patient.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "FULLY PAID":
                return "bg-[#ECFDF5] text-[#10B981]"
            case "PARTIALLY PAID":
                return "bg-[#EEF2FF] text-[#6366F1]"
            case "UNPAID":
                return "bg-[#FFF1F2] text-[#F43F5E]"
            default:
                return "bg-gray-100 text-gray-600"
        }
    }

    return (
        <div className="w-full">
            <table className="w-full border-separate border-spacing-0">
                <thead>
                    <tr className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-wider">
                        <th className="px-4 py-4 text-left font-bold">Reservation ID</th>
                        <th className="px-4 py-4 text-left font-bold">Patient Name</th>
                        <th className="px-4 py-4 text-left font-bold text-center">Number of Bill</th>
                        <th className="px-4 py-4 text-left font-bold">Reservation Date</th>
                        <th className="px-4 py-4 text-left font-bold text-right">Total Amount</th>
                        <th className="px-4 py-4 text-left font-bold text-center">Payment</th>
                        <th className="px-4 py-4 text-right"></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item) => {
                        const isExpanded = expandedRows.includes(item.id)
                        const hasBills = item.bills && item.bills.length > 0

                        return (
                            <>
                                {/* Main Row */}
                                <tr
                                    key={item.id}
                                    className={cn(
                                        "group transition-all",
                                        isExpanded ? "bg-white" : "hover:bg-gray-50/50"
                                    )}
                                >
                                    <td className="px-4 py-5 border-t border-gray-50">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-[#1E293B] text-sm">{item.id}</span>
                                            {item.isNew && (
                                                <span className="px-2 py-0.5 bg-[#DBEAFE] text-[#2563EB] text-[10px] font-bold rounded">NEW</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-5 border-t border-gray-50">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm">
                                                <AvatarImage src={item.patient.avatar} />
                                                <AvatarFallback>{item.patient.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium text-[#475569] text-sm">{item.patient.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-5 border-t border-gray-50 text-center">
                                        <span className="text-sm font-medium text-[#475569]">{item.billCount}</span>
                                    </td>
                                    <td className="px-4 py-5 border-t border-gray-50">
                                        <span className="text-sm text-[#475569]">{item.date}</span>
                                    </td>
                                    <td className="px-4 py-5 border-t border-gray-50 text-right">
                                        <span className="font-bold text-[#1E293B] text-sm">${item.amount}</span>
                                    </td>
                                    <td className="px-4 py-5 border-t border-gray-50 text-center">
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-[10px] font-bold",
                                            getStatusStyles(item.status)
                                        )}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-5 border-t border-gray-50 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuItem className="gap-2">
                                                        <Share2 className="h-4 w-4" /> Share
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2">
                                                        <Download className="h-4 w-4" /> Download
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2">
                                                        <Printer className="h-4 w-4" /> Print
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <button
                                                onClick={() => toggleRow(item.id)}
                                                className={cn(
                                                    "h-8 w-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-transform",
                                                    isExpanded && "rotate-180"
                                                )}
                                            >
                                                <ChevronDown className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                {/* Nested Bill Rows */}
                                {isExpanded && hasBills && item.bills.map((bill, index) => (
                                    <tr key={bill.id} className="bg-[#F8FAFC]/50">
                                        <td className="px-4 py-4 border-t border-gray-50"></td>
                                        <td className="px-4 py-4 border-t border-gray-100" colSpan={2}>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-gray-400">Bill ID</span>
                                                <span className="text-sm font-bold text-[#475569]">{bill.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 border-t border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-gray-400">For</span>
                                                <span className="text-sm font-bold text-[#475569]">{bill.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 border-t border-gray-100 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <span className="text-xs text-gray-400">Amount</span>
                                                <span className="text-sm font-bold text-[#475569]">${bill.amount}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 border-t border-gray-100 text-center">
                                            {bill.status === "SET_PAYMENT" ? (
                                                <Button className="h-8 px-4 py-0 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[10px] font-bold rounded-lg shadow-sm">
                                                    Set Payment
                                                </Button>
                                            ) : (
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-[10px] font-bold",
                                                    getStatusStyles(bill.status)
                                                )}>
                                                    {bill.status}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 border-t border-gray-100 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="h-8 w-8 flex items-center justify-center text-gray-300 hover:text-gray-500">
                                                    <Download className="h-4 w-4" />
                                                </button>
                                                <button className="h-8 w-8 flex items-center justify-center text-gray-300 hover:text-gray-500">
                                                    <Printer className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
