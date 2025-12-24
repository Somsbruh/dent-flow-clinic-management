// Mock data for the dental clinic management system

export interface Patient {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: "male" | "female" | "other"
  address: string
  emergencyContact: string
  emergencyPhone: string
  allergies: string[]
  medicalConditions: string[]
  insuranceProvider?: string
  insuranceNumber?: string
  createdAt: string
  lastVisit?: string
  nextAppointment?: string
  profileImage?: string // Added profile image field
}

export interface Treatment {
  id: string
  patientId: string
  toothNumber?: number
  treatmentType: string
  description: string
  status: "planned" | "in-progress" | "completed"
  cost: number
  date: string
  dentistId: string
  notes?: string
}

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  dentistId: string
  dentistName: string
  treatmentType: string
  date: string
  startTime: string
  endTime: string
  duration: number
  status: "scheduled" | "confirmed" | "in-progress" | "completed" | "cancelled" | "no-show"
  notes?: string
  roomId?: string // Added room assignment
}

export interface Staff {
  id: string
  firstName: string
  lastName: string
  fullName: string // Combined name for easier display
  email?: string // Now optional
  phone?: string // Optional initially, required if system access ON
  telegramUsername: string // Required - primary identity
  role: "clinic_admin" | "reception" | "dentist" | "assistant" | "other_staff"
  specialization?: string
  salary: number
  startDate: string
  status: "active" | "inactive"
  avatar?: string

  // System Access
  systemAccess: boolean
  password?: string // Only if manual setup
  requirePasswordChange?: boolean

  // Permissions (only if system access ON)
  permissions?: {
    viewPatients: boolean
    editPatients: boolean
    manageAppointments: boolean
    visitNotes: boolean
    treatmentPlans: boolean
    invoices: boolean
    payments: boolean
    reports: boolean
    manageStaff: boolean
    manageProcedures: boolean
    exportData: boolean
  }

  // Dentist specific
  canBeAssignedAppointments?: boolean
  workingDays?: number[] // 0-6, Sunday-Saturday
  workingHoursStart?: string
  workingHoursEnd?: string
  hasSplitShift?: boolean
  splitShiftStart?: string
  splitShiftEnd?: string
  breakTimeEnabled?: boolean
  breakTimeStart?: string
  breakTimeEnd?: string
}

// Default permissions by role
export const defaultPermissionsByRole: Record<string, Staff["permissions"]> = {
  clinic_admin: {
    viewPatients: true,
    editPatients: true,
    manageAppointments: true,
    visitNotes: true,
    treatmentPlans: true,
    invoices: true,
    payments: true,
    reports: true,
    manageStaff: true,
    manageProcedures: true,
    exportData: true,
  },
  reception: {
    viewPatients: true,
    editPatients: true,
    manageAppointments: true,
    visitNotes: false,
    treatmentPlans: false,
    invoices: true,
    payments: true,
    reports: false,
    manageStaff: false,
    manageProcedures: false,
    exportData: false,
  },
  dentist: {
    viewPatients: true,
    editPatients: true,
    manageAppointments: true,
    visitNotes: true,
    treatmentPlans: true,
    invoices: false,
    payments: false,
    reports: true,
    manageStaff: false,
    manageProcedures: true,
    exportData: false,
  },
  assistant: {
    viewPatients: true,
    editPatients: false,
    manageAppointments: true,
    visitNotes: true,
    treatmentPlans: false,
    invoices: false,
    payments: false,
    reports: false,
    manageStaff: false,
    manageProcedures: false,
    exportData: false,
  },
  other_staff: {
    viewPatients: false,
    editPatients: false,
    manageAppointments: false,
    visitNotes: false,
    treatmentPlans: false,
    invoices: false,
    payments: false,
    reports: false,
    manageStaff: false,
    manageProcedures: false,
    exportData: false,
  },
}

export interface InventoryItem {
  id: string
  name: string
  category: "equipment" | "medicine" | "consumable"
  quantity: number
  unit: string
  minStock: number
  costPerUnit: number
  supplier?: string
  lastRestocked?: string
  expiryDate?: string
}

export interface Invoice {
  id: string
  patientId: string
  patientName: string
  items: {
    description: string
    quantity: number
    unitPrice: number
    total: number
  }[]
  subtotal: number
  tax: number
  discount: number
  total: number
  status: "pending" | "partial" | "paid" | "overdue"
  dueDate: string
  createdAt: string
  paidAmount: number
}

export interface DentalRoom {
  id: string
  name: string
  chairNumber: number
  floor: number
  equipment: string[]
  status: "available" | "occupied" | "maintenance"
}

export interface ClinicalNote {
  id: string
  patientId: string
  visitDate: string
  dentistId: string
  dentistName: string
  chiefComplaint: string
  examination: string
  diagnosis: string
  treatmentProvided: string
  recommendations: string
  followUpDate?: string
  createdAt: string
}

export interface DentalImage {
  id: string
  patientId: string
  type: "intraoral" | "extraoral" | "xray" | "panoramic" | "cbct" | "other"
  description: string
  toothNumber?: number
  imageUrl: string
  uploadedAt: string
  uploadedBy: string
  notes?: string
}

export interface ToothRecord {
  toothNumber: number
  status: "healthy" | "treated" | "filling" | "cavity" | "crown" | "missing" | "extraction" | "implant" | "bridge"
  surfaces?: string[]
  treatments: {
    id: string
    date: string
    treatment: string
    dentist: string
    notes?: string
  }[]
  notes?: string
}

export interface Holiday {
  id: string
  name: string
  date: string
  isRecurring: boolean
}

export interface StaffDayOff {
  id: string
  staffId: string
  staffName: string
  date: string
  reason: "vacation" | "sick" | "personal" | "training" | "other"
  isApproved: boolean
  notes?: string
}

export interface WorkSchedule {
  dayOfWeek: number // 0-6, Sunday-Saturday
  startTime: string
  endTime: string
  breakStart?: string
  breakEnd?: string
  isWorkingDay: boolean
}

export const dentalRooms: DentalRoom[] = [
  {
    id: "R001",
    name: "Room A",
    chairNumber: 1,
    floor: 1,
    equipment: ["X-Ray Machine", "Dental Chair", "Sterilization Unit"],
    status: "available",
  },
  {
    id: "R002",
    name: "Room B",
    chairNumber: 2,
    floor: 1,
    equipment: ["Dental Chair", "Ultrasonic Scaler", "Curing Light"],
    status: "occupied",
  },
  {
    id: "R003",
    name: "Room C",
    chairNumber: 3,
    floor: 1,
    equipment: ["Dental Chair", "Intraoral Camera", "Apex Locator"],
    status: "available",
  },
  {
    id: "R004",
    name: "Room D",
    chairNumber: 4,
    floor: 2,
    equipment: ["Dental Chair", "Panoramic X-Ray", "CAD/CAM System"],
    status: "available",
  },
  {
    id: "R005",
    name: "Surgery Room",
    chairNumber: 5,
    floor: 2,
    equipment: ["Surgical Dental Chair", "Implant Motor", "Bone Grafting Kit"],
    status: "maintenance",
  },
]

// Mock Patients Data
export const patients: Patient[] = [
  {
    id: "P001",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "(555) 123-4567",
    dateOfBirth: "1985-03-15",
    gender: "male",
    address: "123 Main St, Los Angeles, CA 90001",
    emergencyContact: "Jane Doe",
    emergencyPhone: "(555) 987-6543",
    allergies: ["Penicillin"],
    medicalConditions: ["Hypertension"],
    insuranceProvider: "Blue Cross",
    insuranceNumber: "BC123456789",
    createdAt: "2023-01-15",
    lastVisit: "2024-12-05",
    nextAppointment: "2024-12-20",
  },
  {
    id: "P002",
    firstName: "Sarah",
    lastName: "Smith",
    email: "sarah.smith@email.com",
    phone: "(555) 234-5678",
    dateOfBirth: "1990-07-22",
    gender: "female",
    address: "456 Oak Ave, Los Angeles, CA 90002",
    emergencyContact: "Mike Smith",
    emergencyPhone: "(555) 876-5432",
    allergies: [],
    medicalConditions: [],
    insuranceProvider: "Aetna",
    insuranceNumber: "AE987654321",
    createdAt: "2023-03-20",
    lastVisit: "2024-12-08",
  },
  {
    id: "P003",
    firstName: "Michael",
    lastName: "Johnson",
    email: "m.johnson@email.com",
    phone: "(555) 345-6789",
    dateOfBirth: "1978-11-30",
    gender: "male",
    address: "789 Pine Rd, Los Angeles, CA 90003",
    emergencyContact: "Lisa Johnson",
    emergencyPhone: "(555) 765-4321",
    allergies: ["Latex", "Codeine"],
    medicalConditions: ["Diabetes Type 2"],
    insuranceProvider: "United Healthcare",
    insuranceNumber: "UH456789123",
    createdAt: "2022-08-10",
    lastVisit: "2024-11-28",
    nextAppointment: "2024-12-15",
  },
  {
    id: "P004",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.d@email.com",
    phone: "(555) 456-7890",
    dateOfBirth: "1995-04-18",
    gender: "female",
    address: "321 Elm St, Los Angeles, CA 90004",
    emergencyContact: "Robert Davis",
    emergencyPhone: "(555) 654-3210",
    allergies: [],
    medicalConditions: [],
    createdAt: "2024-01-05",
    lastVisit: "2024-12-01",
  },
  {
    id: "P005",
    firstName: "Robert",
    lastName: "Wilson",
    email: "r.wilson@email.com",
    phone: "(555) 567-8901",
    dateOfBirth: "1982-09-08",
    gender: "male",
    address: "654 Maple Dr, Los Angeles, CA 90005",
    emergencyContact: "Susan Wilson",
    emergencyPhone: "(555) 543-2109",
    allergies: ["Aspirin"],
    medicalConditions: ["Asthma"],
    insuranceProvider: "Cigna",
    insuranceNumber: "CG789123456",
    createdAt: "2023-06-12",
    lastVisit: "2024-12-03",
    nextAppointment: "2024-12-18",
  },
]

// Mock Appointments Data
export const appointments: Appointment[] = [
  {
    id: "A001",
    patientId: "P001",
    patientName: "John Doe",
    dentistId: "S001",
    dentistName: "Dr. Sarah Chen",
    treatmentType: "Root Canal Treatment",
    date: "2024-12-10",
    startTime: "09:00",
    endTime: "10:00",
    duration: 60,
    status: "completed",
    roomId: "R001",
  },
  {
    id: "A002",
    patientId: "P002",
    patientName: "Sarah Smith",
    dentistId: "S001",
    dentistName: "Dr. Sarah Chen",
    treatmentType: "Dental Cleaning",
    date: "2024-12-10",
    startTime: "10:30",
    endTime: "11:00",
    duration: 30,
    status: "in-progress",
    roomId: "R002",
  },
  {
    id: "A003",
    patientId: "P003",
    patientName: "Michael Johnson",
    dentistId: "S001",
    dentistName: "Dr. Sarah Chen",
    treatmentType: "Crown Fitting",
    date: "2024-12-10",
    startTime: "11:30",
    endTime: "12:15",
    duration: 45,
    status: "scheduled",
    roomId: "R003",
  },
  {
    id: "A004",
    patientId: "P004",
    patientName: "Emily Davis",
    dentistId: "S002",
    dentistName: "Dr. James Lee",
    treatmentType: "Orthodontic Checkup",
    date: "2024-12-10",
    startTime: "14:00",
    endTime: "14:30",
    duration: 30,
    status: "scheduled",
    roomId: "R004",
  },
  {
    id: "A005",
    patientId: "P005",
    patientName: "Robert Wilson",
    dentistId: "S001",
    dentistName: "Dr. Sarah Chen",
    treatmentType: "Tooth Extraction",
    date: "2024-12-10",
    startTime: "15:00",
    endTime: "16:00",
    duration: 60,
    status: "scheduled",
    roomId: "R001",
  },
]

export const staff: Staff[] = [
  {
    id: "S001",
    firstName: "Sarah",
    lastName: "Chen",
    fullName: "Sarah Chen",
    email: "sarah.chen@dentflow.com",
    phone: "(555) 111-2222",
    telegramUsername: "@sarahchen_dds",
    role: "dentist",
    specialization: "Endodontics",
    salary: 15000,
    startDate: "2020-01-15",
    status: "active",
    systemAccess: true,
    permissions: defaultPermissionsByRole.dentist,
    canBeAssignedAppointments: true,
    workingDays: [1, 2, 3, 4, 5],
    workingHoursStart: "09:00",
    workingHoursEnd: "17:00",
    breakTimeEnabled: true,
    breakTimeStart: "12:00",
    breakTimeEnd: "13:00",
  },
  {
    id: "S002",
    firstName: "James",
    lastName: "Lee",
    fullName: "James Lee",
    email: "james.lee@dentflow.com",
    phone: "(555) 222-3333",
    telegramUsername: "@jameslee_ortho",
    role: "dentist",
    specialization: "Orthodontics",
    salary: 14000,
    startDate: "2021-03-01",
    status: "active",
    systemAccess: true,
    permissions: defaultPermissionsByRole.dentist,
    canBeAssignedAppointments: true,
    workingDays: [1, 2, 3, 4, 5, 6],
    workingHoursStart: "08:00",
    workingHoursEnd: "16:00",
    breakTimeEnabled: true,
    breakTimeStart: "12:00",
    breakTimeEnd: "13:00",
  },
  {
    id: "S003",
    firstName: "Maria",
    lastName: "Garcia",
    fullName: "Maria Garcia",
    email: "maria.g@dentflow.com",
    phone: "(555) 333-4444",
    telegramUsername: "@mariagarcia_dental",
    role: "assistant",
    salary: 6500,
    startDate: "2022-06-15",
    status: "active",
    systemAccess: true,
    permissions: defaultPermissionsByRole.assistant,
  },
  {
    id: "S004",
    firstName: "David",
    lastName: "Kim",
    fullName: "David Kim",
    email: "david.k@dentflow.com",
    phone: "(555) 444-5555",
    telegramUsername: "@davidkim_dental",
    role: "assistant",
    salary: 4500,
    startDate: "2023-01-10",
    status: "active",
    systemAccess: true,
    permissions: defaultPermissionsByRole.assistant,
  },
  {
    id: "S005",
    firstName: "Jennifer",
    lastName: "Brown",
    fullName: "Jennifer Brown",
    email: "jennifer.b@dentflow.com",
    phone: "(555) 555-6666",
    telegramUsername: "@jenniferbrown_df",
    role: "reception",
    salary: 4000,
    startDate: "2022-09-01",
    status: "active",
    systemAccess: true,
    permissions: defaultPermissionsByRole.reception,
  },
]

export const inventory: InventoryItem[] = [
  {
    id: "I001",
    name: "Dental Mirror",
    category: "equipment",
    quantity: 50,
    unit: "pieces",
    minStock: 20,
    costPerUnit: 15,
    supplier: "DentalPro Supplies",
  },
  {
    id: "I002",
    name: "Lidocaine 2%",
    category: "medicine",
    quantity: 100,
    unit: "vials",
    minStock: 30,
    costPerUnit: 8,
    supplier: "MedSupply Co",
    expiryDate: "2025-06-30",
  },
  {
    id: "I003",
    name: "Disposable Gloves",
    category: "consumable",
    quantity: 500,
    unit: "pairs",
    minStock: 200,
    costPerUnit: 0.5,
    supplier: "SafeHands Inc",
  },
  {
    id: "I004",
    name: "Dental Composite Resin",
    category: "consumable",
    quantity: 25,
    unit: "syringes",
    minStock: 15,
    costPerUnit: 45,
    supplier: "DentalPro Supplies",
    expiryDate: "2025-03-15",
  },
  {
    id: "I005",
    name: "Antibiotics (Amoxicillin)",
    category: "medicine",
    quantity: 8,
    unit: "boxes",
    minStock: 20,
    costPerUnit: 25,
    supplier: "MedSupply Co",
    expiryDate: "2025-01-20",
  },
]

export const invoices: Invoice[] = [
  {
    id: "INV001",
    patientId: "P001",
    patientName: "John Doe",
    items: [
      { description: "Root Canal Treatment", quantity: 1, unitPrice: 800, total: 800 },
      { description: "X-Ray", quantity: 2, unitPrice: 50, total: 100 },
    ],
    subtotal: 900,
    tax: 72,
    discount: 0,
    total: 972,
    status: "paid",
    dueDate: "2024-12-15",
    createdAt: "2024-12-05",
    paidAmount: 972,
  },
  {
    id: "INV002",
    patientId: "P002",
    patientName: "Sarah Smith",
    items: [
      { description: "Dental Cleaning", quantity: 1, unitPrice: 150, total: 150 },
      { description: "Fluoride Treatment", quantity: 1, unitPrice: 50, total: 50 },
    ],
    subtotal: 200,
    tax: 16,
    discount: 20,
    total: 196,
    status: "pending",
    dueDate: "2024-12-20",
    createdAt: "2024-12-08",
    paidAmount: 0,
  },
  {
    id: "INV003",
    patientId: "P003",
    patientName: "Michael Johnson",
    items: [
      { description: "Crown (Porcelain)", quantity: 1, unitPrice: 1200, total: 1200 },
      { description: "Temporary Crown", quantity: 1, unitPrice: 100, total: 100 },
    ],
    subtotal: 1300,
    tax: 104,
    discount: 0,
    total: 1404,
    status: "partial",
    dueDate: "2024-12-25",
    createdAt: "2024-11-28",
    paidAmount: 700,
  },
]

export const treatmentTypes = [
  { id: "T001", name: "Dental Cleaning", duration: 30, basePrice: 150 },
  { id: "T002", name: "Root Canal Treatment", duration: 60, basePrice: 800 },
  { id: "T003", name: "Tooth Extraction", duration: 45, basePrice: 200 },
  { id: "T004", name: "Crown Fitting", duration: 45, basePrice: 1200 },
  { id: "T005", name: "Dental Filling", duration: 30, basePrice: 150 },
  { id: "T006", name: "Orthodontic Checkup", duration: 30, basePrice: 100 },
  { id: "T007", name: "Teeth Whitening", duration: 60, basePrice: 400 },
  { id: "T008", name: "Dental Implant", duration: 120, basePrice: 3000 },
  { id: "T009", name: "Wisdom Tooth Extraction", duration: 90, basePrice: 400 },
  { id: "T010", name: "Dental X-Ray", duration: 15, basePrice: 50 },
  { id: "T011", name: "Tooth Scaling", duration: 60, basePrice: 750 },
  { id: "T012", name: "Tooth Braces (Metal)", duration: 120, basePrice: 3000 },
  { id: "T013", name: "Bleaching", duration: 60, basePrice: 500 },
]

export const clinicalNotes: ClinicalNote[] = [
  {
    id: "CN001",
    patientId: "P001",
    visitDate: "2024-12-05",
    dentistId: "S001",
    dentistName: "Dr. Sarah Chen",
    chiefComplaint: "Pain in upper right molar when chewing",
    examination: "Percussion positive on tooth #14. Cold test negative. Periapical radiolucency observed on X-ray.",
    diagnosis: "Irreversible pulpitis with periapical abscess on tooth #14",
    treatmentProvided:
      "Root canal treatment initiated. Pulp extirpated, canals irrigated and medicated. Temporary restoration placed.",
    recommendations: "Continue antibiotics for 5 days. Avoid chewing on right side. Return in 1 week for completion.",
    followUpDate: "2024-12-12",
    createdAt: "2024-12-05T10:30:00Z",
  },
  {
    id: "CN002",
    patientId: "P001",
    visitDate: "2024-11-20",
    dentistId: "S003",
    dentistName: "Maria Garcia",
    chiefComplaint: "Routine checkup and cleaning",
    examination:
      "Moderate calculus buildup in lower anterior region. Mild gingivitis observed. No new caries detected.",
    diagnosis: "Gingivitis, calculus buildup",
    treatmentProvided: "Full mouth scaling and polishing. Fluoride treatment applied.",
    recommendations: "Improve brushing technique in lower anterior region. Use interdental brushes daily.",
    createdAt: "2024-11-20T14:00:00Z",
  },
  {
    id: "CN003",
    patientId: "P001",
    visitDate: "2024-10-15",
    dentistId: "S002",
    dentistName: "Dr. James Lee",
    chiefComplaint: "Sensitivity to cold on lower left side",
    examination:
      "Visual examination revealed small cavity on mesial surface of tooth #26. Bitewing X-ray confirmed enamel caries.",
    diagnosis: "Dental caries on tooth #26 (Class II)",
    treatmentProvided: "Composite restoration placed on tooth #26. Bite adjusted.",
    recommendations: "Reduce sugar intake. Consider prescription fluoride toothpaste.",
    createdAt: "2024-10-15T09:15:00Z",
  },
]

export const dentalImages: DentalImage[] = [
  {
    id: "DI001",
    patientId: "P001",
    type: "xray",
    description: "Periapical X-ray - Upper right quadrant",
    toothNumber: 14,
    imageUrl: "/dental-xray-tooth-periapical.jpg",
    uploadedAt: "2024-12-05T09:00:00Z",
    uploadedBy: "Dr. Sarah Chen",
    notes: "Shows periapical radiolucency around tooth #14",
  },
  {
    id: "DI002",
    patientId: "P001",
    type: "panoramic",
    description: "Full mouth panoramic X-ray",
    imageUrl: "/dental-panoramic-xray-full-mouth.jpg",
    uploadedAt: "2024-11-20T13:30:00Z",
    uploadedBy: "Maria Garcia",
    notes: "Annual panoramic for comprehensive evaluation",
  },
  {
    id: "DI003",
    patientId: "P001",
    type: "intraoral",
    description: "Intraoral photo - Before treatment",
    toothNumber: 14,
    imageUrl: "/intraoral-dental-photograph-tooth.jpg",
    uploadedAt: "2024-12-05T08:45:00Z",
    uploadedBy: "Dr. Sarah Chen",
    notes: "Documentation before root canal treatment",
  },
  {
    id: "DI004",
    patientId: "P001",
    type: "extraoral",
    description: "Frontal smile photo",
    imageUrl: "/dental-smile-photograph-frontal.jpg",
    uploadedAt: "2024-01-15T10:00:00Z",
    uploadedBy: "Jennifer Brown",
    notes: "Initial consultation photo",
  },
]

export const holidays: Holiday[] = [
  { id: "H001", name: "New Year's Day", date: "2025-01-01", isRecurring: true },
  { id: "H002", name: "Independence Day", date: "2024-07-04", isRecurring: true },
  { id: "H003", name: "Christmas Day", date: "2024-12-25", isRecurring: true },
  { id: "H004", name: "Thanksgiving", date: "2024-11-28", isRecurring: false },
  { id: "H005", name: "Labor Day", date: "2024-09-02", isRecurring: false },
]

export const staffDayOffs: StaffDayOff[] = [
  {
    id: "DO001",
    staffId: "S001",
    staffName: "Dr. Sarah Chen",
    date: "2024-12-20",
    reason: "vacation",
    isApproved: true,
    notes: "Family trip",
  },
  {
    id: "DO002",
    staffId: "S002",
    staffName: "Dr. James Lee",
    date: "2024-12-18",
    reason: "training",
    isApproved: true,
    notes: "Orthodontics conference",
  },
  { id: "DO003", staffId: "S003", staffName: "Maria Garcia", date: "2024-12-22", reason: "personal", isApproved: true },
  {
    id: "DO004",
    staffId: "S001",
    staffName: "Dr. Sarah Chen",
    date: "2024-12-27",
    reason: "vacation",
    isApproved: true,
  },
]

export const defaultWorkSchedule: WorkSchedule[] = [
  { dayOfWeek: 0, startTime: "00:00", endTime: "00:00", isWorkingDay: false },
  { dayOfWeek: 1, startTime: "09:00", endTime: "17:00", breakStart: "12:00", breakEnd: "13:00", isWorkingDay: true },
  { dayOfWeek: 2, startTime: "09:00", endTime: "17:00", breakStart: "12:00", breakEnd: "13:00", isWorkingDay: true },
  { dayOfWeek: 3, startTime: "09:00", endTime: "17:00", breakStart: "12:00", breakEnd: "13:00", isWorkingDay: true },
  { dayOfWeek: 4, startTime: "09:00", endTime: "17:00", breakStart: "12:00", breakEnd: "13:00", isWorkingDay: true },
  { dayOfWeek: 5, startTime: "09:00", endTime: "17:00", breakStart: "12:00", breakEnd: "13:00", isWorkingDay: true },
  { dayOfWeek: 6, startTime: "09:00", endTime: "14:00", isWorkingDay: true },
]
