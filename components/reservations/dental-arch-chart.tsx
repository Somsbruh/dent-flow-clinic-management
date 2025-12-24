"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ToothData, TOOTH_NAMES, STATUS_COLORS } from "@/lib/tooth-types"
import { TEETH_SVG_DATA } from "@/components/shared/tooth-paths"

interface DentalArchChartProps {
    selectedTooth: number | null
    onToothClick: (toothId: number) => void
    teethData: Record<number, ToothData>
    patientType: "adult" | "child"
}

export function DentalArchChart({
    selectedTooth,
    onToothClick,
    teethData,
    patientType
}: DentalArchChartProps) {

    const getToothFill = (toothId: number) => {
        const data = teethData[toothId]
        if (!data?.status) return "transparent"
        return STATUS_COLORS[data.status] || "transparent"
    }

    // Filter teeth based on patient type
    const isAdultTooth = (id: number) => id < 50
    const isChildTooth = (id: number) => id >= 50

    const visibleTeeth = Object.entries(TEETH_SVG_DATA.teeth).filter(([id]) => {
        const toothId = parseInt(id)
        return patientType === "adult" ? isAdultTooth(toothId) : isChildTooth(toothId)
    })

    return (
        <div className="relative w-full aspect-[290/371] max-w-[400px] mx-auto">
            <svg
                viewBox={TEETH_SVG_DATA.viewBox}
                className="w-full h-full drop-shadow-xl"
                style={{ filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1))" }}
            >
                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Render Teeth */}
                {visibleTeeth.map(([idStr, paths]) => {
                    const id = parseInt(idStr)
                    const isSelected = selectedTooth === id
                    const highlightColor = getToothFill(id)
                    const hasStatus = highlightColor !== "transparent"

                    return (
                        <g
                            key={id}
                            onClick={() => onToothClick(id)}
                            className={cn(
                                "cursor-pointer transition-all duration-300 hover:opacity-80",
                                isSelected && "opacity-100"
                            )}
                            style={{
                                transformOrigin: "center",
                                transform: isSelected ? "scale(1.02)" : "scale(1)",
                            }}
                        >
                            <title>{TOOTH_NAMES[id] || `Tooth ${id}`}</title>

                            {/* Parent/Outline Path */}
                            <path
                                d={paths.parent}
                                fill={isSelected ? "#e0e7ff" : (hasStatus ? highlightColor : "white")}
                                stroke={isSelected ? "#4f46e5" : "#333"}
                                strokeWidth={isSelected ? "1.5" : "1"}
                                className="transition-colors duration-300"
                            />

                            {/* Detail Paths */}
                            {paths.details?.map((d, i) => (
                                <path
                                    key={i}
                                    d={d}
                                    fill="none"
                                    stroke={isSelected ? "#4f46e5" : "#333"}
                                    strokeWidth="0.5"
                                    strokeLinecap="round"
                                />
                            ))}
                        </g>
                    )
                })}
            </svg>

            {/* Legend */}
            <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-4 text-[10px] sm:text-xs">
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS_COLORS.recent }} />
                    <span className="text-gray-600">Recent</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS_COLORS.hasTreatment }} />
                    <span className="text-gray-600">Treatment</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS_COLORS.recommended }} />
                    <span className="text-gray-600">Recommended</span>
                </div>
            </div>
        </div>
    )
}
