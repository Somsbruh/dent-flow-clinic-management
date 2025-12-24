"use client"

import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { TEETH_SVG_DATA } from "./tooth-paths"
import { TOOTH_NAMES, ToothStatus, STATUS_COLORS } from "@/lib/tooth-types"

interface DentalChartProps {
    selectedTeeth?: string[]
    onToothSelect: (toothCode: string) => void
    isChild?: boolean
    teethStatus?: Record<string, ToothStatus>
    className?: string
}

/**
 * DentalChart Component
 * Renders an SVG human dental chart based on FDI notation.
 * Supports both adult and child dentition.
 * Each tooth is hoverable and clickable.
 */
export function DentalChart({
    selectedTeeth = [],
    onToothSelect,
    isChild = false,
    teethStatus = {},
    className
}: DentalChartProps) {
    const [hoveredTooth, setHoveredTooth] = useState<string | null>(null)

    // Filter teeth based on dentition type (Permanent 11-48, Deciduous 51-85)
    const visibleTeeth = useMemo(() => {
        return Object.entries(TEETH_SVG_DATA.teeth).filter(([id]) => {
            const toothNum = parseInt(id)
            return isChild ? toothNum >= 51 : toothNum <= 48
        })
    }, [isChild])

    const handleToothClick = (toothId: string) => {
        onToothSelect(toothId)
    }

    return (
        <div className={cn("relative w-full max-w-[500px] mx-auto", className)}>
            <svg
                viewBox={TEETH_SVG_DATA.viewBox}
                className="w-full h-auto drop-shadow-md select-none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <filter id="tooth-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="1" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {visibleTeeth.map(([id, data]) => {
                    const isSelected = selectedTeeth.includes(id)
                    const isHovered = hoveredTooth === id
                    const status = teethStatus[id]
                    const fill = status ? STATUS_COLORS[status] : "white"
                    const toothName = TOOTH_NAMES[parseInt(id)] || `Tooth ${id}`

                    return (
                        <g
                            key={id}
                            className={cn(
                                "tooth-group cursor-pointer transition-all duration-200",
                                `tooth-${id}`,
                                isChild && `child-tooth-${id}`
                            )}
                            onMouseEnter={() => setHoveredTooth(id)}
                            onMouseLeave={() => setHoveredTooth(null)}
                            onClick={() => handleToothClick(id)}
                            tabIndex={0}
                            role="button"
                            aria-pressed={isSelected}
                            aria-label={`${toothName} (${id})${status ? `, Status: ${status}` : ""}`}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault()
                                    handleToothClick(id)
                                }
                            }}
                        >
                            <title>{toothName} - FDI {id}</title>

                            {/* Main tooth path */}
                            <path
                                d={data.parent}
                                fill={isSelected ? "#3b82f6" : fill}
                                stroke={isHovered ? "#2563eb" : "#4b5563"}
                                strokeWidth={isHovered || isSelected ? "1.5" : "0.75"}
                                className="transition-colors duration-200"
                                style={isHovered ? { filter: "url(#tooth-glow)" } : {}}
                            />

                            {/* Internal details if any */}
                            {data.details.map((d, i) => (
                                <path
                                    key={i}
                                    d={d}
                                    fill="none"
                                    stroke={isHovered ? "#2563eb" : "#9ca3af"}
                                    strokeWidth="0.5"
                                    pointerEvents="none"
                                />
                            ))}

                            {/* FDI Code Text (Visible on hover or if selected) */}
                            {(isHovered || isSelected) && (
                                <text
                                    x={parseFloat(data.parent.match(/[mM]\s*([-0-9.]+)/)?.[1] || "0") + 5}
                                    y={parseFloat(data.parent.match(/[mM]\s*[-0-9.]+\s*,\s*([-0-9.]+)/)?.[1] || "0") + 10}
                                    fontSize="6"
                                    fontWeight="bold"
                                    fill={isSelected ? "white" : "#3b82f6"}
                                    pointerEvents="none"
                                    className="animate-in fade-in duration-200"
                                >
                                    {id}
                                </text>
                            )}
                        </g>
                    )
                })}
            </svg>

            {/* Tooltip on hover */}
            {hoveredTooth && (
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded shadow-lg pointer-events-none z-50 whitespace-nowrap"
                >
                    {TOOTH_NAMES[parseInt(hoveredTooth)] || `Tooth ${hoveredTooth}`} ({hoveredTooth})
                </div>
            )}
        </div>
    )
}
