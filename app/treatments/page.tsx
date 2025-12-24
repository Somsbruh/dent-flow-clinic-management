"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { treatmentTypes } from "@/lib/data"
import { Search, Plus, Clock, DollarSign, Edit2, Trash2, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function TreatmentsPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTreatments = treatmentTypes.filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="flex min-h-screen bg-[#f8f9fc]">
      <Sidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
      <div className="flex-1 lg:ml-[240px]">
        <Header title="Treatments" onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <main className="p-4 md:p-6">
          {/* Header - responsive */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search treatments..."
                className="pl-10 rounded-lg border-gray-200"
              />
            </div>
            <Button className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90 rounded-lg">
              <Plus className="h-4 w-4 mr-2" />
              Add Treatment
            </Button>
          </div>

          {/* Treatment List - Desktop Table */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Treatment Name</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Duration</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Base Price</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTreatments.map((treatment) => (
                  <tr key={treatment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-primary rounded-full" />
                        <span className="font-medium text-gray-900">{treatment.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{treatment.duration} mins</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span>${treatment.basePrice}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit2 className="h-4 w-4 text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Treatment List - Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredTreatments.map((treatment) => (
              <div key={treatment.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-12 bg-primary rounded-full" />
                    <div>
                      <h3 className="font-medium text-gray-900">{treatment.name}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-3.5 w-3.5" />
                          {treatment.duration} mins
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <DollarSign className="h-3.5 w-3.5" />${treatment.basePrice}
                        </span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <MoreVertical className="h-4 w-4 text-gray-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
