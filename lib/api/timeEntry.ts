// Mock API for Time Entry CRUD operations
// This simulates real API calls with async operations and proper error handling

import { TimeEntry, ActivityCategory, TimeEntryType, ActivityStatus } from "@/lib/interfaces/app/calendar/calendar_data_types"

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock database - in a real app this would be a proper database
let mockTimeEntriesDB: TimeEntry[] = [
  {
    id: "TE-001",
    userId: "user-001",
    date: "2025-07-03",
    startTime: "09:00",
    endTime: "12:00",
    duration: 180,
    category: "security-project",
    type: "billable",
    projectId: "PROJ-001",
    taskDescription: "Security assessment for client XYZ",
    location: "Client site",
    status: "submitted",
    submittedAt: "2025-07-03T12:05:00Z",
    billableRate: 150,
    comments: "Initial phase of security audit completed",
    isOvertime: false,
    isOnCall: false
  },
  {
    id: "TE-002", 
    userId: "user-001",
    date: "2025-07-03",
    startTime: "13:00",
    endTime: "17:00",
    duration: 240,
    category: "incident-response",
    type: "non-billable",
    taskDescription: "Emergency incident response - database breach",
    location: "Remote",
    status: "manager-approved",
    submittedAt: "2025-07-03T17:10:00Z",
    approvedAt: "2025-07-03T18:00:00Z",
    approvedBy: "manager-001",
    comments: "Critical incident resolved successfully",
    isOvertime: false,
    isOnCall: true
  },
  {
    id: "TE-003",
    userId: "user-001", 
    date: "2025-07-02",
    startTime: "10:00",
    endTime: "16:00",
    duration: 360,
    category: "compliance",
    type: "internal",
    taskDescription: "ISO 27001 compliance documentation review",
    location: "Office",
    status: "finance-approved",
    submittedAt: "2025-07-02T16:15:00Z",
    approvedAt: "2025-07-02T17:00:00Z",
    approvedBy: "manager-001",
    comments: "Documentation updates completed as per audit requirements",
    isOvertime: false,
    isOnCall: false
  }
]

// API Response types
export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export type TimeEntryListResponse = ApiResponse<{
  timeEntries: TimeEntry[]
  total: number
  page: number
  limit: number
}>

export type TimeEntryResponse = ApiResponse<TimeEntry>

// API Functions
export class TimeEntryAPI {
  
  /**
   * Get all time entries with optional filtering
   */
  static async getTimeEntries(params?: {
    userId?: string
    date?: string
    startDate?: string
    endDate?: string
    category?: ActivityCategory | "all"
    status?: ActivityStatus | "all"
    page?: number
    limit?: number
  }): Promise<TimeEntryListResponse> {
    await delay(300) // Simulate network delay

    try {
      let filteredEntries = [...mockTimeEntriesDB]

      // Apply filters
      if (params?.userId) {
        filteredEntries = filteredEntries.filter(entry => entry.userId === params.userId)
      }

      if (params?.date) {
        filteredEntries = filteredEntries.filter(entry => entry.date === params.date)
      }

      if (params?.startDate && params?.endDate) {
        filteredEntries = filteredEntries.filter(entry => 
          entry.date >= params.startDate! && entry.date <= params.endDate!
        )
      }

      if (params?.category && params.category !== "all") {
        filteredEntries = filteredEntries.filter(entry => entry.category === params.category)
      }

      if (params?.status && params.status !== "all") {
        filteredEntries = filteredEntries.filter(entry => entry.status === params.status)
      }

      // Apply pagination
      const page = params?.page || 1
      const limit = params?.limit || 50
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedEntries = filteredEntries.slice(startIndex, endIndex)

      return {
        success: true,
        data: {
          timeEntries: paginatedEntries,
          total: filteredEntries.length,
          page,
          limit
        }
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to fetch time entries",
        message: error instanceof Error ? error.message : "Unknown error"
      }
    }
  }

  /**
   * Get a single time entry by ID
   */
  static async getTimeEntry(id: string): Promise<TimeEntryResponse> {
    await delay(200)

    try {
      const entry = mockTimeEntriesDB.find(entry => entry.id === id)
      
      if (!entry) {
        return {
          success: false,
          error: "Time entry not found",
          message: `No time entry found with ID: ${id}`
        }
      }

      return {
        success: true,
        data: entry
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to fetch time entry",
        message: error instanceof Error ? error.message : "Unknown error"
      }
    }
  }

  /**
   * Create a new time entry
   */
  static async createTimeEntry(timeEntryData: Omit<TimeEntry, 'id'>): Promise<TimeEntryResponse> {
    await delay(500)

    try {
      // Validate required fields
      if (!timeEntryData.date || !timeEntryData.startTime || !timeEntryData.endTime) {
        return {
          success: false,
          error: "Validation failed",
          message: "Date, start time, and end time are required"
        }
      }

      if (!timeEntryData.taskDescription?.trim()) {
        return {
          success: false,
          error: "Validation failed", 
          message: "Task description is required"
        }
      }

      // Check for overlapping time entries
      const overlapping = mockTimeEntriesDB.find(entry => 
        entry.userId === timeEntryData.userId &&
        entry.date === timeEntryData.date &&
        (
          (timeEntryData.startTime >= entry.startTime && timeEntryData.startTime < entry.endTime) ||
          (timeEntryData.endTime > entry.startTime && timeEntryData.endTime <= entry.endTime) ||
          (timeEntryData.startTime <= entry.startTime && timeEntryData.endTime >= entry.endTime)
        )
      )

      if (overlapping) {
        return {
          success: false,
          error: "Time conflict",
          message: "This time entry overlaps with an existing entry"
        }
      }

      // Generate new ID
      const newId = `TE-${Date.now()}`
      
      const newEntry: TimeEntry = {
        ...timeEntryData,
        id: newId,
        submittedAt: timeEntryData.status === 'submitted' ? new Date().toISOString() : undefined
      }

      mockTimeEntriesDB.push(newEntry)

      return {
        success: true,
        data: newEntry,
        message: "Time entry created successfully"
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to create time entry",
        message: error instanceof Error ? error.message : "Unknown error"
      }
    }
  }

  /**
   * Update an existing time entry
   */
  static async updateTimeEntry(id: string, timeEntryData: Partial<TimeEntry>): Promise<TimeEntryResponse> {
    await delay(400)

    try {
      const existingIndex = mockTimeEntriesDB.findIndex(entry => entry.id === id)
      
      if (existingIndex === -1) {
        return {
          success: false,
          error: "Time entry not found",
          message: `No time entry found with ID: ${id}`
        }
      }

      const existingEntry = mockTimeEntriesDB[existingIndex]

      // Check if entry can be modified (not if already approved)
      if (existingEntry.status === 'finance-approved') {
        return {
          success: false,
          error: "Cannot modify approved entry",
          message: "Time entries that have been finance-approved cannot be modified"
        }
      }

      // Validate if updating critical fields
      if (timeEntryData.taskDescription !== undefined && !timeEntryData.taskDescription?.trim()) {
        return {
          success: false,
          error: "Validation failed",
          message: "Task description cannot be empty"
        }
      }

      // Check for overlapping time entries (excluding current entry)
      if (timeEntryData.startTime || timeEntryData.endTime || timeEntryData.date) {
        const startTime = timeEntryData.startTime || existingEntry.startTime
        const endTime = timeEntryData.endTime || existingEntry.endTime
        const date = timeEntryData.date || existingEntry.date

        const overlapping = mockTimeEntriesDB.find(entry => 
          entry.userId === existingEntry.userId &&
          entry.date === date &&
          entry.id !== id &&
          (
            (startTime >= entry.startTime && startTime < entry.endTime) ||
            (endTime > entry.startTime && endTime <= entry.endTime) ||
            (startTime <= entry.startTime && endTime >= entry.endTime)
          )
        )

        if (overlapping) {
          return {
            success: false,
            error: "Time conflict",
            message: "This time entry would overlap with an existing entry"
          }
        }
      }

      const updatedEntry: TimeEntry = {
        ...existingEntry,
        ...timeEntryData,
        id, // Ensure ID doesn't change
        submittedAt: timeEntryData.status === 'submitted' && !existingEntry.submittedAt 
          ? new Date().toISOString() 
          : existingEntry.submittedAt
      }

      mockTimeEntriesDB[existingIndex] = updatedEntry

      return {
        success: true,
        data: updatedEntry,
        message: "Time entry updated successfully"
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to update time entry",
        message: error instanceof Error ? error.message : "Unknown error"
      }
    }
  }

  /**
   * Delete a time entry
   */
  static async deleteTimeEntry(id: string): Promise<ApiResponse<null>> {
    await delay(300)

    try {
      const existingIndex = mockTimeEntriesDB.findIndex(entry => entry.id === id)
      
      if (existingIndex === -1) {
        return {
          success: false,
          error: "Time entry not found",
          message: `No time entry found with ID: ${id}`
        }
      }

      const existingEntry = mockTimeEntriesDB[existingIndex]

      // Check if entry can be deleted
      if (existingEntry.status === 'finance-approved') {
        return {
          success: false,
          error: "Cannot delete approved entry",
          message: "Time entries that have been finance-approved cannot be deleted"
        }
      }

      mockTimeEntriesDB.splice(existingIndex, 1)

      return {
        success: true,
        data: null,
        message: "Time entry deleted successfully"
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to delete time entry",
        message: error instanceof Error ? error.message : "Unknown error"
      }
    }
  }

  /**
   * Bulk update time entry status (for approval workflows)
   */
  static async updateTimeEntryStatus(
    id: string, 
    status: ActivityStatus, 
    approvedBy?: string,
    rejectedReason?: string
  ): Promise<TimeEntryResponse> {
    await delay(400)

    try {
      const existingIndex = mockTimeEntriesDB.findIndex(entry => entry.id === id)
      
      if (existingIndex === -1) {
        return {
          success: false,
          error: "Time entry not found",
          message: `No time entry found with ID: ${id}`
        }
      }

      const existingEntry = mockTimeEntriesDB[existingIndex]
      const now = new Date().toISOString()

      const updatedEntry: TimeEntry = {
        ...existingEntry,
        status,
        approvedAt: (status === 'manager-approved' || status === 'finance-approved') ? now : existingEntry.approvedAt,
        approvedBy: (status === 'manager-approved' || status === 'finance-approved') ? approvedBy : existingEntry.approvedBy,
        rejectedReason: status === 'rejected' ? rejectedReason : undefined
      }

      mockTimeEntriesDB[existingIndex] = updatedEntry

      return {
        success: true,
        data: updatedEntry,
        message: `Time entry ${status.replace('-', ' ')} successfully`
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to update time entry status",
        message: error instanceof Error ? error.message : "Unknown error"
      }
    }
  }

  /**
   * Get time entry statistics for a period
   */
  static async getTimeEntryStats(params: {
    userId: string
    startDate: string
    endDate: string
  }): Promise<ApiResponse<{
    totalHours: number
    billableHours: number
    nonBillableHours: number
    entriesCount: number
    categoriesBreakdown: Record<ActivityCategory, number>
    statusBreakdown: Record<ActivityStatus, number>
  }>> {
    await delay(250)

    try {
      const entries = mockTimeEntriesDB.filter(entry => 
        entry.userId === params.userId &&
        entry.date >= params.startDate &&
        entry.date <= params.endDate
      )

      const totalMinutes = entries.reduce((sum, entry) => sum + entry.duration, 0)
      const billableMinutes = entries
        .filter(entry => entry.type === 'billable')
        .reduce((sum, entry) => sum + entry.duration, 0)

      const categoriesBreakdown = entries.reduce((acc, entry) => {
        acc[entry.category] = (acc[entry.category] || 0) + entry.duration
        return acc
      }, {} as Record<ActivityCategory, number>)

      const statusBreakdown = entries.reduce((acc, entry) => {
        acc[entry.status] = (acc[entry.status] || 0) + 1
        return acc
      }, {} as Record<ActivityStatus, number>)

      return {
        success: true,
        data: {
          totalHours: totalMinutes,
          billableHours: billableMinutes,
          nonBillableHours: totalMinutes - billableMinutes,
          entriesCount: entries.length,
          categoriesBreakdown,
          statusBreakdown
        }
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to get time entry statistics",
        message: error instanceof Error ? error.message : "Unknown error"
      }
    }
  }
}

// Utility function to reset mock data (useful for testing)
export const resetMockTimeEntries = () => {
  mockTimeEntriesDB = []
}

// Utility function to add mock data
export const addMockTimeEntries = (entries: TimeEntry[]) => {
  mockTimeEntriesDB.push(...entries)
}
