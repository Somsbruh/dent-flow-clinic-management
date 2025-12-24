// Shared types and constants for tooth chart components

export type ToothStatus = "healthy" | "recent" | "hasTreatment" | "recommended" | "missing"

export interface ToothData {
    condition?: string
    treatment?: string
    note?: string
    status?: ToothStatus
    history?: ToothHistoryEntry[]
}

export interface ToothHistoryEntry {
    date: string
    condition: string
    treatment: string
    dentist: string
    status: "done" | "pending"
    note: string
    reason?: string
}

// Tooth conditions with codes
export const CONDITIONS = [
    { code: "car", label: "Caries" },
    { code: "pre", label: "Partial erupted" },
    { code: "une", label: "Un-erupted" },
    { code: "imv", label: "Impacted visible" },
    { code: "ano", label: "Anomali" },
    { code: "dia", label: "Diastema" },
    { code: "nvt", label: "Non vital" },
    { code: "fra", label: "Fracture" },
    { code: "abs", label: "Abscess" },
] as const

// Treatments with type indicators
export const TREATMENTS = [
    { type: "single", label: "Teeth Whitening" },
    { type: "single", label: "Teeth Cleaning" },
    { type: "single", label: "Tooth Fillings" },
    { type: "mult", label: "Tooth Extraction" },
    { type: "single", label: "Crowns" },
    { type: "mult", label: "Tooth Scaling" },
    { type: "mult", label: "Filling canal" },
    { type: "single", label: "Replace tooth" },
    { type: "mult", label: "Root canal" },
    { type: "single", label: "Veneer" },
] as const

// Tooth names by FDI number
export const TOOTH_NAMES: Record<number, string> = {
    // Upper right quadrant (1)
    11: "Central Incisor",
    12: "Lateral Incisor",
    13: "Canine",
    14: "1st Premolar",
    15: "2nd Premolar",
    16: "1st Molar",
    17: "2nd Molar",
    18: "3rd Molar",
    // Upper left quadrant (2)
    21: "Central Incisor",
    22: "Lateral Incisor",
    23: "Canine",
    24: "1st Premolar",
    25: "2nd Premolar",
    26: "1st Molar",
    27: "2nd Molar",
    28: "3rd Molar",
    // Lower left quadrant (3)
    31: "Central Incisor",
    32: "Lateral Incisor",
    33: "Canine",
    34: "1st Premolar",
    35: "2nd Premolar",
    36: "1st Molar",
    37: "2nd Molar",
    38: "3rd Molar",
    // Lower right quadrant (4)
    41: "Central Incisor",
    42: "Lateral Incisor",
    43: "Canine",
    44: "1st Premolar",
    45: "2nd Premolar",
    46: "1st Molar",
    47: "2nd Molar",
    48: "3rd Molar",
}

// Quadrant labels
export const QUADRANTS = {
    1: "Upper Right",
    2: "Upper Left",
    3: "Lower Left",
    4: "Lower Right",
} as const

// Get quadrant from tooth number
export function getQuadrant(toothId: number): 1 | 2 | 3 | 4 {
    return Math.floor(toothId / 10) as 1 | 2 | 3 | 4
}

// Get tooth type category
export function getToothType(toothId: number): "incisor" | "canine" | "premolar" | "molar" {
    const position = toothId % 10
    if (position <= 2) return "incisor"
    if (position === 3) return "canine"
    if (position <= 5) return "premolar"
    return "molar"
}

// All tooth IDs in FDI order
export const ALL_TEETH = {
    upper: {
        right: [18, 17, 16, 15, 14, 13, 12, 11],
        left: [21, 22, 23, 24, 25, 26, 27, 28],
    },
    lower: {
        right: [48, 47, 46, 45, 44, 43, 42, 41],
        left: [31, 32, 33, 34, 35, 36, 37, 38],
    },
} as const

// Status colors for tooth highlighting
export const STATUS_COLORS = {
    healthy: "transparent",
    recent: "rgba(239, 68, 68, 0.3)", // red
    hasTreatment: "rgba(59, 130, 246, 0.3)", // blue
    recommended: "rgba(245, 158, 11, 0.3)", // amber
    missing: "rgba(156, 163, 175, 0.5)", // gray
} as const
