// Enhanced Calendar and Time Tracking Data Types
// Inspired by Atimeüs ERP CRA system

export type ActivityCategory = 
  | "project" 
  | "operational" 
  | "security-project" 
  | "incident-response" 
  | "operational-security" 
  | "training-development" 
  | "administration" 
  | "vendor-management"
  | "compliance"
  | "research"
  | "absence"
  | "meeting"
  | "audit";

export type ActivityStatus = "draft" | "submitted" | "manager-approved" | "finance-approved" | "rejected";

export type TimeEntryType = "billable" | "non-billable" | "internal" | "absence";

export type AbsenceType = "vacation" | "sick" | "rtt" | "formation" | "compensatory" | "unpaid";

// Enhanced Calendar Event with Time Tracking capabilities
export type AppCalendarEvent = {
    id: string | number;
    title: string;
    date: string;
    time: string;
    type: string;
    location: string;
    attendees: string[];
    // Enhanced fields for time tracking
    category?: ActivityCategory;
    duration?: number; // in minutes
    description?: string;
    projectId?: string;
    clientId?: string;
    isRecurring?: boolean;
    recurringPattern?: string;
    priority?: "low" | "medium" | "high" | "critical";
    tags?: string[];
};

// Time Entry for CRA (Compte-Rendu d'Activité)
export type TimeEntry = {
    id: string;
    userId: string;
    date: string;
    startTime: string;
    endTime: string;
    duration: number; // in minutes
    category: ActivityCategory;
    type: TimeEntryType;
    projectId?: string;
    clientId?: string;
    taskDescription: string;
    location?: string;
    status: ActivityStatus;
    submittedAt?: string;
    approvedAt?: string;
    approvedBy?: string;
    rejectedReason?: string;
    billableRate?: number;
    comments?: string;
    isOvertime?: boolean;
    isOnCall?: boolean;
};

// Monthly CRA (Compte-Rendu d'Activité)
export type MonthlyCRA = {
    id: string;
    userId: string;
    month: string; // YYYY-MM format
    timeEntries: TimeEntry[];
    totalHours: number;
    billableHours: number;
    nonBillableHours: number;
    absenceHours: number;
    status: ActivityStatus;
    submittedAt?: string;
    managerApprovedAt?: string;
    financeApprovedAt?: string;
    taceScore?: number; // Taux d'Activité Congés Exclus
    exportedToPpayroll?: boolean;
    pdfGenerated?: boolean;
};

// Absence Request
export type AbsenceRequest = {
    id: string;
    userId: string;
    type: AbsenceType;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason?: string;
    status: "pending" | "approved" | "rejected";
    requestedAt: string;
    approvedBy?: string;
    approvedAt?: string;
    rejectedReason?: string;
    documents?: string[];
};

// Security Project for time tracking
export type SecurityProject = {
    id: string;
    name: string;
    clientId?: string;
    type: "audit" | "assessment" | "compliance" | "incident" | "training" | "internal";
    status: "active" | "completed" | "on-hold" | "cancelled";
    startDate: string;
    endDate?: string;
    estimatedHours: number;
    actualHours: number;
    budget?: number;
    description: string;
    teamMembers: string[];
    isBillable: boolean;
    tags: string[];
};

// Analytics data for reporting
export type TimeAnalytics = {
    period: string; // YYYY-MM or YYYY-WW
    totalHours: number;
    billableHours: number;
    nonBillableHours: number;
    incidentResponseHours: number;
    trainingHours: number;
    taceScore: number;
    projectBreakdown: { [projectId: string]: number };
    categoryBreakdown: { [category in ActivityCategory]: number };
    utilizationRate: number;
    overtimeHours: number;
    absenceDays: number;
};

export const mockData_CalendarEvents: AppCalendarEvent[] = [
    {
      id: 1,
      title: "Security Audit - Client XYZ",
      date: "2025-07-15",
      time: "09:00 AM - 12:00 PM",
      location: "Client Site - Building A",
      attendees: ["John Doe", "Jane Smith", "Alex Rivera"],
      type: "audit",
      category: "security-project",
      duration: 180,
      description: "Quarterly security audit for Client XYZ infrastructure",
      projectId: "PROJ-2025-001",
      clientId: "XYZ-CORP",
      priority: "high",
      tags: ["audit", "infrastructure", "compliance"]
    },
    {
      id: 2,
      title: "Incident Response - Phishing Campaign",
      date: "2025-07-15",
      time: "02:00 PM - 05:30 PM",
      location: "SOC - Main Office",
      attendees: ["Sarah Johnson", "Michael Chen", "David Wilson"],
      type: "incident",
      category: "incident-response",
      duration: 210,
      description: "Investigation and response to detected phishing campaign",
      priority: "critical",
      tags: ["incident", "phishing", "investigation"]
    },
    {
      id: 3,
      title: "ISO 27001 Documentation Review",
      date: "2025-07-16",
      time: "10:00 AM - 12:00 PM",
      location: "Conference Room B",
      attendees: ["Jennifer Smith", "Lisa Brown", "Robert Davis"],
      type: "compliance",
      category: "compliance",
      duration: 120,
      description: "Review and update ISO 27001 compliance documentation",
      projectId: "COMP-ISO27001",
      priority: "medium",
      tags: ["iso27001", "documentation", "compliance"]
    },
    {
      id: 4,
      title: "Security Training - Phishing Awareness",
      date: "2025-07-17",
      time: "02:00 PM - 04:00 PM",
      location: "Training Room 1",
      attendees: ["All Staff"],
      type: "training",
      category: "training-development",
      duration: 120,
      description: "Monthly security awareness training focusing on phishing detection",
      priority: "medium",
      tags: ["training", "awareness", "phishing"]
    },
    {
      id: 5,
      title: "Vendor Security Assessment - CloudProvider Inc",
      date: "2025-07-18",
      time: "11:00 AM - 01:00 PM",
      location: "Virtual Meeting",
      attendees: ["Alex Rivera", "Emily Rodriguez", "Jessica Chen"],
      type: "assessment",
      category: "vendor-management",
      duration: 120,
      description: "Security assessment of new cloud service provider",
      projectId: "VENDOR-2025-003",
      priority: "high",
      tags: ["vendor", "cloud", "assessment"]
    },
    {
      id: 6,
      title: "Daily Security Operations Review",
      date: "2025-07-19",
      time: "09:00 AM - 09:30 AM",
      location: "SOC",
      attendees: ["SOC Team"],
      type: "operational",
      category: "operational-security",
      duration: 30,
      description: "Daily review of security operations and incident status",
      isRecurring: true,
      recurringPattern: "daily",
      priority: "medium",
      tags: ["operations", "daily", "review"]
    },
    {
      id: 7,
      title: "Risk Assessment Planning Meeting",
      date: "2025-07-20",
      time: "03:00 PM - 04:30 PM",
      location: "Strategy Room",
      attendees: ["RSSI Team", "Project Managers"],
      type: "planning",
      category: "administration",
      duration: 90,
      description: "Planning session for upcoming risk assessment projects",
      priority: "medium",
      tags: ["planning", "risk", "strategy"]
    },
    {
      id: 8,
      title: "Vacation - Annual Leave",
      date: "2025-07-21",
      time: "All Day",
      location: "N/A",
      attendees: [],
      type: "absence",
      category: "absence",
      description: "Planned vacation day",
      priority: "low",
      tags: ["vacation", "absence"]
    }
];

// Mock data for time entries
export const mockTimeEntries: TimeEntry[] = [
    {
        id: "TE-001",
        userId: "user-001",
        date: "2025-07-15",
        startTime: "09:00",
        endTime: "12:00",
        duration: 180,
        category: "security-project",
        type: "billable",
        projectId: "PROJ-2025-001",
        clientId: "XYZ-CORP",
        taskDescription: "Conducted security audit for Client XYZ infrastructure",
        location: "Client Site",
        status: "submitted",
        submittedAt: "2025-07-15T18:00:00Z",
        billableRate: 150,
        comments: "Completed infrastructure review, found 3 medium-risk issues"
    },
    {
        id: "TE-002",
        userId: "user-001",
        date: "2025-07-15",
        startTime: "14:00",
        endTime: "17:30",
        duration: 210,
        category: "incident-response",
        type: "non-billable",
        taskDescription: "Investigated and responded to phishing campaign",
        location: "SOC",
        status: "manager-approved",
        submittedAt: "2025-07-15T18:00:00Z",
        approvedAt: "2025-07-16T09:00:00Z",
        approvedBy: "manager-001",
        comments: "Critical incident - blocked 150+ phishing emails"
    }
];

// Mock security projects
export const mockSecurityProjects: SecurityProject[] = [
    {
        id: "PROJ-2025-001",
        name: "Client XYZ Infrastructure Audit",
        clientId: "XYZ-CORP",
        type: "audit",
        status: "active",
        startDate: "2025-07-01",
        endDate: "2025-07-30",
        estimatedHours: 40,
        actualHours: 12,
        budget: 6000,
        description: "Comprehensive security audit of client's IT infrastructure",
        teamMembers: ["user-001", "user-002", "user-003"],
        isBillable: true,
        tags: ["audit", "infrastructure", "client"]
    },
    {
        id: "COMP-ISO27001",
        name: "ISO 27001 Compliance Project",
        type: "compliance",
        status: "active",
        startDate: "2025-06-01",
        endDate: "2025-12-31",
        estimatedHours: 200,
        actualHours: 85,
        description: "Implementation and maintenance of ISO 27001 compliance",
        teamMembers: ["user-001", "user-004", "user-005"],
        isBillable: false,
        tags: ["iso27001", "compliance", "internal"]
    } 
]; 