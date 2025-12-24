"use client"

import { Search, HelpCircle, TrendingUp, Settings, Flag, Plus, ChevronDown, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white px-4 md:px-6 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 transition-all duration-200 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg md:text-xl font-semibold text-gray-900">Dashboard</h1>
      </div>

      <div className="relative w-[240px] md:w-[320px] mx-4 hidden sm:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search for anything here..."
          className="pl-10 bg-gray-50 border-0 rounded-full h-10 text-sm placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-blue-500 hover:bg-gray-100 transition-colors duration-200"
        />
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        {/* Add Button */}
        <button className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 transition-all duration-200 shadow-sm">
          <Plus className="h-4 w-4 md:h-5 md:w-5" />
        </button>

        <button className="hidden md:flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200">
          <HelpCircle className="h-5 w-5" />
        </button>

        <button className="hidden md:flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200">
          <TrendingUp className="h-5 w-5" />
        </button>

        <button className="hidden md:flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200">
          <Settings className="h-5 w-5" />
        </button>

        {/* Flag/Notifications */}
        <button className="hidden sm:flex items-center gap-1.5 px-3 h-9 md:h-10 rounded-full text-gray-500 hover:bg-gray-100 transition-all duration-200">
          <div className="relative">
            <Flag className="h-4 w-4" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
          </div>
          <span className="text-sm font-medium text-gray-600">1/4</span>
        </button>

        <div className="hidden md:block h-8 w-px bg-gray-200 mx-2" />

        <button className="flex items-center gap-2 md:gap-3 px-1 md:px-2 py-1.5 rounded-full hover:bg-gray-50 transition-all duration-200">
          <img
            src="/placeholder.svg?height=36&width=36"
            alt="Sarah Mitchell"
            className="h-8 w-8 md:h-9 md:w-9 rounded-full object-cover ring-2 ring-gray-100"
          />
          <div className="text-left hidden md:block">
            <p className="text-sm font-medium text-gray-900 leading-tight">Sarah Mitchell</p>
            <p className="text-xs text-gray-400 leading-tight">Clinic Admin</p>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400 hidden md:block" />
        </button>
      </div>
    </header>
  )
}
