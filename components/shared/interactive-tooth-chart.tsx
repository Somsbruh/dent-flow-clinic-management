"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ToothData, TOOTH_NAMES, STATUS_COLORS, ToothStatus } from "@/lib/tooth-types"
import { ToothPopup } from "./tooth-popup"

interface InteractiveToothChartProps {
    teethData: Record<number, ToothData>
    onToothDataChange: (toothId: number, data: ToothData | null) => void
    selectedTeeth?: number[]
    onSelectionChange?: (teeth: number[]) => void
    selectionMode?: "single" | "multi"
    readonly?: boolean
    size?: "sm" | "md" | "lg"
    showLegend?: boolean
}

// Tooth positions calibrated for transparent tooth chart PNG (656x1024 aspect ratio)
// Visual analysis of chart:
// - Upper arch: molars at 10-25%, premolars 26-35%, canines 36-40%, incisors 42-48%
// - Gap in middle: 50-58%
// - Lower arch: incisors at 58-62%, canines 63-68%, premolars 70-78%, molars 80-94%
const TOOTH_POSITIONS: Record<number, { x: number; y: number; w: number; h: number }> = {
    // === UPPER ARCH ===
    // Upper Right Quadrant (18-11) - viewer's left side
    18: { x: 8, y: 10, w: 9, h: 6 },      // 3rd molar - top corners
    17: { x: 14, y: 14, w: 9, h: 6 },     // 2nd molar
    16: { x: 20, y: 20, w: 9, h: 5 },     // 1st molar
    15: { x: 26, y: 27, w: 7, h: 5 },     // 2nd premolar
    14: { x: 31, y: 33, w: 7, h: 4 },     // 1st premolar
    13: { x: 35, y: 38, w: 6, h: 5 },     // Canine
    12: { x: 40, y: 42, w: 5, h: 4 },     // Lateral incisor
    11: { x: 45, y: 45, w: 5, h: 4 },     // Central incisor - bottom center

    // Upper Left Quadrant (21-28) - viewer's right side
    21: { x: 50, y: 45, w: 5, h: 4 },     // Central incisor
    22: { x: 55, y: 42, w: 5, h: 4 },     // Lateral incisor
    23: { x: 59, y: 38, w: 6, h: 5 },     // Canine
    24: { x: 62, y: 33, w: 7, h: 4 },     // 1st premolar
    25: { x: 67, y: 27, w: 7, h: 5 },     // 2nd premolar
    26: { x: 71, y: 20, w: 9, h: 5 },     // 1st molar
    27: { x: 77, y: 14, w: 9, h: 6 },     // 2nd molar
    28: { x: 83, y: 10, w: 9, h: 6 },     // 3rd molar - top corners

    // === LOWER ARCH ===
    // Lower Left Quadrant (38-31) - viewer's right side  
    38: { x: 83, y: 86, w: 9, h: 6 },     // 3rd molar - bottom corners
    37: { x: 77, y: 80, w: 9, h: 6 },     // 2nd molar
    36: { x: 71, y: 74, w: 9, h: 5 },     // 1st molar
    35: { x: 67, y: 69, w: 7, h: 4 },     // 2nd premolar
    34: { x: 62, y: 65, w: 7, h: 4 },     // 1st premolar
    33: { x: 59, y: 61, w: 6, h: 4 },     // Canine
    32: { x: 55, y: 57, w: 5, h: 4 },     // Lateral incisor
    31: { x: 50, y: 55, w: 5, h: 4 },     // Central incisor - top center

    // Lower Right Quadrant (41-48) - viewer's left side
    41: { x: 45, y: 55, w: 5, h: 4 },     // Central incisor
    42: { x: 40, y: 57, w: 5, h: 4 },     // Lateral incisor
    43: { x: 35, y: 61, w: 6, h: 4 },     // Canine
    44: { x: 31, y: 65, w: 7, h: 4 },     // 1st premolar
    45: { x: 26, y: 69, w: 7, h: 4 },     // 2nd premolar
    46: { x: 20, y: 74, w: 9, h: 5 },     // 1st molar
    47: { x: 14, y: 80, w: 9, h: 6 },     // 2nd molar
    48: { x: 8, y: 86, w: 9, h: 6 },      // 3rd molar - bottom corners
}

export function InteractiveToothChart({
    teethData,
    onToothDataChange,
    selectedTeeth = [],
    onSelectionChange,
    selectionMode = "single",
    readonly = false,
    size = "md",
    showLegend = true,
}: InteractiveToothChartProps) {
    const [hoveredTooth, setHoveredTooth] = useState<number | null>(null)
    const [activeTooth, setActiveTooth] = useState<number | null>(null)
    const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Responsive size classes - larger on desktop, smaller on mobile
    const sizeClasses = {
        sm: "w-full max-w-[180px] sm:max-w-[200px] md:max-w-[220px]",
        md: "w-full max-w-[220px] sm:max-w-[280px] md:max-w-[340px]",
        lg: "w-full max-w-[280px] sm:max-w-[360px] md:max-w-[420px]",
    }

    const handleToothClick = (toothId: number, event: React.MouseEvent | React.TouchEvent) => {
        if (readonly) return
        event.preventDefault()

        const container = containerRef.current
        if (!container) return

        const pos = TOOTH_POSITIONS[toothId]
        const rect = container.getBoundingClientRect()

        setActiveTooth(toothId)
        setPopupPosition({
            x: (pos.x + pos.w / 2) * rect.width / 100,
            y: (pos.y + pos.h / 2) * rect.height / 100,
        })

        if (onSelectionChange) {
            if (selectionMode === "multi") {
                if (selectedTeeth.includes(toothId)) {
                    onSelectionChange(selectedTeeth.filter((t) => t !== toothId))
                } else {
                    onSelectionChange([...selectedTeeth, toothId])
                }
            } else {
                onSelectionChange([toothId])
            }
        }
    }

    const handlePopupClose = () => {
        setActiveTooth(null)
        setPopupPosition(null)
    }

    const handlePopupSave = (data: ToothData) => {
        if (activeTooth) {
            onToothDataChange(activeTooth, data)
        }
        handlePopupClose()
    }

    const handlePopupDelete = () => {
        if (activeTooth) {
            onToothDataChange(activeTooth, null)
        }
        handlePopupClose()
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            const target = event.target as HTMLElement
            if (activeTooth && !target.closest(".tooth-popup") && !target.closest(".tooth-overlay")) {
                handlePopupClose()
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("touchstart", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("touchstart", handleClickOutside)
        }
    }, [activeTooth])

    return (
        <div className={cn("relative mx-auto", sizeClasses[size])}>
            <div
                ref={containerRef}
                className="relative w-full rounded-lg overflow-hidden touch-manipulation"
                style={{ aspectRatio: "656 / 1024" }}
            >
                {/* Dental arch image - transparent PNG */}
                <img
                    src="/images/tooth-chart-transparent.png"
                    alt="Dental Arch Chart"
                    className="w-full h-full object-contain pointer-events-none select-none"
                    draggable={false}
                />

                {/* Clickable overlay areas for each tooth */}
                <div className="absolute inset-0">
                    {Object.entries(TOOTH_POSITIONS).map(([toothId, pos]) => {
                        const id = parseInt(toothId)
                        const data = teethData[id]
                        const isHovered = hoveredTooth === id
                        const isActive = activeTooth === id
                        const hasData = data && (data.condition || data.treatment)

                        return (
                            <button
                                key={id}
                                onClick={(e) => handleToothClick(id, e)}
                                onTouchEnd={(e) => handleToothClick(id, e)}
                                onMouseEnter={() => setHoveredTooth(id)}
                                onMouseLeave={() => setHoveredTooth(null)}
                                className={cn(
                                    "tooth-overlay absolute rounded-[40%] transition-all duration-150",
                                    "hover:bg-blue-500/30 active:bg-blue-500/40",
                                    "hover:shadow-[0_0_8px_2px_rgba(59,130,246,0.4)]",
                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                                    // Touch-friendly sizing
                                    "min-w-[20px] min-h-[20px]",
                                    isActive && "bg-blue-500/40 shadow-[0_0_10px_3px_rgba(59,130,246,0.5)] ring-2 ring-blue-400",
                                    !isActive && !isHovered && hasData && "ring-1",
                                    hasData && data.status === "recent" && "ring-red-400 bg-red-400/25",
                                    hasData && data.status === "hasTreatment" && "ring-blue-400 bg-blue-400/25",
                                    hasData && data.status === "recommended" && "ring-amber-400 bg-amber-400/25"
                                )}
                                style={{
                                    left: `${pos.x}%`,
                                    top: `${pos.y}%`,
                                    width: `${pos.w}%`,
                                    height: `${pos.h}%`,
                                }}
                                title={`${TOOTH_NAMES[id] || "Tooth"} (${id})`}
                                aria-label={`${TOOTH_NAMES[id] || "Tooth"} ${id}`}
                            >
                                {/* Tooth number on hover/active */}
                                <span
                                    className={cn(
                                        "absolute inset-0 flex items-center justify-center text-[8px] sm:text-[9px] md:text-[10px] font-bold transition-opacity pointer-events-none",
                                        isHovered || isActive ? "opacity-100" : "opacity-0",
                                        isActive ? "text-blue-700" : "text-blue-600"
                                    )}
                                >
                                    {id}
                                </span>

                                {/* Status indicator dot */}
                                {hasData && (
                                    <span
                                        className={cn(
                                            "absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-white shadow-sm",
                                            data.status === "recent" ? "bg-red-500" :
                                                data.status === "hasTreatment" ? "bg-blue-500" : "bg-amber-500"
                                        )}
                                    />
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Legend - responsive layout */}
            {showLegend && (
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-2 sm:mt-3 text-[9px] sm:text-[10px] md:text-xs">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-gray-600">Recent</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-gray-600">Treatment</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-gray-600">Recommended</span>
                    </div>
                </div>
            )}

            {/* Tooth Popup */}
            {activeTooth && popupPosition && (
                <ToothPopup
                    toothId={activeTooth}
                    toothName={TOOTH_NAMES[activeTooth] || "Tooth"}
                    position={popupPosition}
                    initialData={teethData[activeTooth]}
                    onSave={handlePopupSave}
                    onDelete={handlePopupDelete}
                    onClose={handlePopupClose}
                />
            )}
        </div>
    )
}
