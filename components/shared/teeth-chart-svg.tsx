"use client"

import { cn } from "@/lib/utils"
import { ToothData, TOOTH_NAMES } from "@/lib/tooth-types"
import { useState } from "react"

interface TeethChartSVGProps {
    teethData: Record<number, ToothData>
    onToothClick: (toothId: number, e: React.MouseEvent) => void
    dentitionType: "adult" | "child"
    className?: string
}

export function TeethChartSVG({
    teethData,
    onToothClick,
    dentitionType,
    className,
}: TeethChartSVGProps) {
    const [hoveredTooth, setHoveredTooth] = useState<number | null>(null)

    const getToothColor = (toothId: number) => {
        const data = teethData[toothId]
        if (!data?.status) return "transparent"
        switch (data.status) {
            case "recent":
                return "rgba(239, 68, 68, 0.4)" // red
            case "hasTreatment":
                return "rgba(59, 130, 246, 0.4)" // blue
            case "recommended":
                return "rgba(245, 158, 11, 0.4)" // amber
            case "missing":
                return "rgba(156, 163, 175, 0.4)" // gray
            default:
                return "transparent"
        }
    }

    const handleToothClick = (toothId: number, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onToothClick(toothId, e)
    }

    return (
        <div className={cn("relative w-full h-full flex justify-center", className)}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                viewBox="0 0 289.61084 370.54398"
                className="max-h-full w-auto"
            >
                <defs>
                    <style>
                        {`
              .tooth-group { cursor: pointer; transition: all 0.2s; }
              .tooth-outline { stroke: #333; stroke-width: 1; transition: all 0.2s; }
              .tooth-detail { stroke: #333; stroke-width: 0.5; fill: none; pointer-events: none; }
              .tooth-group:hover .tooth-outline { stroke-width: 2; filter: drop-shadow(0 0 4px rgba(59, 130, 246, 0.4)); }
              .tooth-text { font-size: 10px; fill: #333; font-family: sans-serif; pointer-events: none; opacity: 0; transition: opacity 0.2s; }
              .tooth-group:hover .tooth-text { opacity: 1; }
            `}
                    </style>
                </defs>

                {dentitionType === "adult" && (
                    <g id="adult-dentition">
                        {/* UPPER_ADULT_PLACEHOLDER */}
                        {/* LOWER_ADULT_PLACEHOLDER */}
                    </g>
                )}

                {dentitionType === "child" && (
                    <g id="child-dentition">
                        {/* CHILD_DENTITION_PLACEHOLDER */}
                    </g>
                )}
            </svg>

            {hoveredTooth && (
                <div
                    className="absolute pointer-events-none bg-black/80 text-white text-xs px-2 py-1 rounded z-50 whitespace-nowrap"
                    style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
                >
                    {TOOTH_NAMES[hoveredTooth] || `Tooth ${hoveredTooth}`} ({hoveredTooth})
                </div>
            )}
        </div>
    )
}
