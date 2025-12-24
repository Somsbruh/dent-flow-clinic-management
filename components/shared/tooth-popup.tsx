"use client"

import { useState, useEffect } from "react"
import { X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { ToothData, CONDITIONS, TREATMENTS } from "@/lib/tooth-types"

interface ToothPopupProps {
    toothId: number
    toothName: string
    position: { x: number; y: number }
    initialData?: ToothData
    onSave: (data: ToothData) => void
    onDelete: () => void
    onClose: () => void
}

export function ToothPopup({
    toothId,
    toothName,
    position,
    initialData,
    onSave,
    onDelete,
    onClose,
}: ToothPopupProps) {
    const [condition, setCondition] = useState(initialData?.condition || "")
    const [treatment, setTreatment] = useState(initialData?.treatment || "")
    const [note, setNote] = useState(initialData?.note || "")

    // Update form when initialData changes
    useEffect(() => {
        setCondition(initialData?.condition || "")
        setTreatment(initialData?.treatment || "")
        setNote(initialData?.note || "")
    }, [initialData, toothId])

    const handleSave = () => {
        if (!condition) return

        onSave({
            condition,
            treatment,
            note,
            status: initialData?.status || "recent",
            history: initialData?.history,
        })
    }

    const handleDelete = () => {
        onDelete()
    }

    // Calculate popup position to stay within bounds
    const getPopupStyle = () => {
        const popupWidth = 220
        const popupHeight = 280

        let left = position.x + 30
        let top = position.y - popupHeight / 2

        // Ensure popup stays within container
        if (left + popupWidth > 360) {
            left = position.x - popupWidth - 30
        }
        if (top < 0) {
            top = 10
        }

        return {
            left: `${left}px`,
            top: `${top}px`,
        }
    }

    return (
        <div
            className="tooth-popup absolute z-50 w-[220px] bg-white rounded-xl shadow-lg border border-gray-200 p-3 animate-in fade-in-0 zoom-in-95 duration-200"
            style={getPopupStyle()}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{toothName}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600">
                        <svg
                            className="w-3 h-3"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <circle cx="12" cy="12" r="10" />
                        </svg>
                        {toothId}
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Form */}
            <div className="space-y-3">
                {/* Condition Select */}
                <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Select condition</Label>
                    <Select value={condition} onValueChange={setCondition}>
                        <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                            {CONDITIONS.map((c) => (
                                <SelectItem key={c.code} value={c.code}>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded font-mono">
                                            {c.code}
                                        </span>
                                        <span>{c.label}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Treatment Select */}
                <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Select treatment</Label>
                    <Select value={treatment} onValueChange={setTreatment}>
                        <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Select treatment" />
                        </SelectTrigger>
                        <SelectContent>
                            {TREATMENTS.map((t, i) => (
                                <SelectItem key={`${t.label}-${i}`} value={t.label}>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={cn(
                                                "text-[10px] px-1.5 py-0.5 rounded font-medium",
                                                t.type === "mult"
                                                    ? "bg-purple-100 text-purple-700"
                                                    : "bg-emerald-100 text-emerald-700"
                                            )}
                                        >
                                            {t.type}
                                        </span>
                                        <span>{t.label}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Note Input */}
                <div>
                    <Input
                        placeholder="Note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="h-9 text-sm"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={handleDelete}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                        className="flex-1 h-9"
                        onClick={handleSave}
                        disabled={!condition}
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    )
}
