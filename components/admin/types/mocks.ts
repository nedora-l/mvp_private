import { ProcessFullDefinitionDto } from "@/lib/services/server/camunda/camunda.server.service";

// Mock data for workflows management
export const workflowsMockData :ProcessFullDefinitionDto[]  = [
  {
    id: 1,
    name: "Employee Onboarding",
    description: "Automated workflow for new employee setup and integration",
    category: "HR",
    status: "Active",
    trigger: "Manual",
    lastRun: "2 hours ago",
    successRate: 95,
    executions: 47,
    version: 2.1,
    createdBy: "HR Team",
    createdAt: "2024-01-15",
    steps: [
      { id: 1, name: "Send Welcome Email", type: "Email", duration: "2 min", status: "Success" },
      { id: 2, name: "Create User Account", type: "System", duration: "1 min", status: "Success" },
      { id: 3, name: "Assign Equipment", type: "Task", duration: "5 min", status: "Pending" },
      { id: 4, name: "Schedule Orientation", type: "Calendar", duration: "2 min", status: "Not Run" }
    ],
    recentExecutions: [
      {
        id: 1,
        user: "Sarah Johnson",
        timestamp: "2024-06-06T10:30:00Z",
        duration: "8 min",
        status: "Success"
      },
      {
        id: 2,
        user: "Mike Chen",
        timestamp: "2024-06-05T14:22:00Z",
        duration: "10 min",
        status: "Success"
      },
      {
        id: 3,
        user: "Alex Rivera",
        timestamp: "2024-06-05T09:15:00Z",
        duration: "12 min",
        status: "Failed",
        error: "Equipment assignment failed - out of stock"
      }
    ]
  },
  {
    id: 2,
    name: "Invoice Approval",
    description: "Multi-step approval process for vendor invoices",
    category: "Finance",
    status: "Active",
    trigger: "Document Upload",
    lastRun: "15 minutes ago",
    successRate: 89,
    executions: 234,
    version: 1.8,
    createdBy: "Finance Team",
    createdAt: "2023-11-20",
    steps: [
      { id: 1, name: "Validate Invoice", type: "Validation", duration: "30 sec", status: "Success" },
      { id: 2, name: "Manager Review", type: "Approval", duration: "2 days", status: "Success" },
      { id: 3, name: "Finance Approval", type: "Approval", duration: "1 day", status: "Success" },
      { id: 4, name: "Payment Processing", type: "Payment", duration: "3 days", status: "Success" }
    ],
    recentExecutions: [
      {
        id: 1,
        user: "David Wilson",
        timestamp: "2024-06-06T11:45:00Z",
        duration: "5 days",
        status: "Success"
      },
      {
        id: 2,
        user: "Emma Thompson",
        timestamp: "2024-06-04T16:30:00Z",
        duration: "3 days",
        status: "Success"
      }
    ]
  },
  {
    id: 3,
    name: "IT Asset Management",
    description: "Track and manage IT equipment lifecycle",
    category: "IT",
    status: "Paused",
    trigger: "Scheduled",
    lastRun: "1 day ago",
    successRate: 78,
    executions: 156,
    version: 3.2,
    createdBy: "IT Team",
    createdAt: "2023-08-10",
    steps: [
      { id: 1, name: "Scan Network", type: "System", duration: "5 min", status: "Success" },
      { id: 2, name: "Update Inventory", type: "Database", duration: "2 min", status: "Success" },
      { id: 3, name: "Check Warranties", type: "API Call", duration: "3 min", status: "Failed" },
      { id: 4, name: "Generate Report", type: "Report", duration: "1 min", status: "Not Run" }
    ],
    recentExecutions: [
      {
        id: 1,
        user: "System",
        timestamp: "2024-06-05T02:00:00Z",
        duration: "11 min",
        status: "Failed",
        error: "Warranty API connection timeout"
      }
    ]
  },
  {
    id: 4,
    name: "Customer Support Ticket",
    description: "Automated routing and escalation of support tickets",
    category: "Support",
    status: "Active",
    trigger: "Email",
    lastRun: "5 minutes ago",
    successRate: 92,
    executions: 1247,
    version: 4.1,
    createdBy: "Support Team",
    createdAt: "2023-05-15",
    steps: [
      { id: 1, name: "Parse Email", type: "Processing", duration: "10 sec", status: "Success" },
      { id: 2, name: "Classify Priority", type: "AI", duration: "5 sec", status: "Success" },
      { id: 3, name: "Assign Agent", type: "Routing", duration: "30 sec", status: "Success" },
      { id: 4, name: "Send Confirmation", type: "Email", duration: "2 sec", status: "Success" }
    ],
    recentExecutions: [
      {
        id: 1,
        user: "Auto-System",
        timestamp: "2024-06-06T11:55:00Z",
        duration: "47 sec",
        status: "Success"
      },
      {
        id: 2,
        user: "Auto-System",
        timestamp: "2024-06-06T11:52:00Z",
        duration: "41 sec",
        status: "Success"
      },
      {
        id: 3,
        user: "Auto-System",
        timestamp: "2024-06-06T11:48:00Z",
        duration: "52 sec",
        status: "Success"
      }
    ]
  },
  {
    id: 5,
    name: "Backup Verification",
    description: "Daily verification of system backups and integrity checks",
    category: "IT",
    status: "Failed",
    trigger: "Scheduled",
    lastRun: "3 hours ago",
    successRate: 85,
    executions: 89,
    version: 1.5,
    createdBy: "DevOps Team",
    createdAt: "2024-02-01",
    steps: [
      { id: 1, name: "Check Backup Status", type: "System", duration: "1 min", status: "Success" },
      { id: 2, name: "Verify Integrity", type: "Validation", duration: "15 min", status: "Failed" },
      { id: 3, name: "Generate Report", type: "Report", duration: "2 min", status: "Not Run" },
      { id: 4, name: "Send Alerts", type: "Notification", duration: "30 sec", status: "Not Run" }
    ],
    recentExecutions: [
      {
        id: 1,
        user: "System",
        timestamp: "2024-06-06T08:00:00Z",
        duration: "16 min",
        status: "Failed",
        error: "Backup file corruption detected on server-03"
      },
      {
        id: 2,
        user: "System",
        timestamp: "2024-06-05T08:00:00Z",
        duration: "18 min",
        status: "Success"
      }
    ]
  }
];

export const templatesMockData = [
  {
    id: 1,
    name: "Employee Onboarding Template",
    description: "Complete template for onboarding new employees with all necessary steps",
    category: "HR",
    difficulty: "Easy",
    steps: 6,
    estimatedTime: "2-3 days",
    detailedSteps: [
      {
        id: 1,
        name: "Welcome Email",
        type: "Email",
        description: "Send personalized welcome email with company information and first-day details"
      },
      {
        id: 2,
        name: "Account Creation",
        type: "System",
        description: "Create user accounts in all necessary systems (Active Directory, email, applications)"
      },
      {
        id: 3,
        name: "Equipment Assignment",
        type: "Task",
        description: "Assign laptop, phone, and other necessary equipment to the new employee"
      },
      {
        id: 4,
        name: "Security Setup",
        type: "Security",
        description: "Set up security badges, access cards, and system permissions"
      },
      {
        id: 5,
        name: "Orientation Scheduling",
        type: "Calendar",
        description: "Schedule orientation meetings with HR, IT, and department manager"
      },
      {
        id: 6,
        name: "Documentation",
        type: "Task",
        description: "Complete employee handbook acknowledgment and required paperwork"
      }
    ]
  },
  {
    id: 2,
    name: "Invoice Processing Template",
    description: "Streamlined invoice approval workflow with automated routing",
    category: "Finance",
    difficulty: "Medium",
    steps: 5,
    estimatedTime: "3-7 days",
    detailedSteps: [
      {
        id: 1,
        name: "Invoice Receipt",
        type: "Document",
        description: "Receive and digitize invoice documents through email or upload"
      },
      {
        id: 2,
        name: "Data Extraction",
        type: "AI/OCR",
        description: "Extract key information from invoice using OCR and AI processing"
      },
      {
        id: 3,
        name: "Validation",
        type: "Validation",
        description: "Validate invoice data against purchase orders and contracts"
      },
      {
        id: 4,
        name: "Approval Workflow",
        type: "Approval",
        description: "Route for approvals based on amount and department rules"
      },
      {
        id: 5,
        name: "Payment Processing",
        type: "Payment",
        description: "Process payment through accounting system after final approval"
      }
    ]
  },
  {
    id: 3,
    name: "Support Ticket Template",
    description: "Automated customer support ticket routing and escalation",
    category: "Support",
    difficulty: "Easy",
    steps: 4,
    estimatedTime: "Immediate",
    detailedSteps: [
      {
        id: 1,
        name: "Ticket Creation",
        type: "Processing",
        description: "Parse incoming support requests from email, chat, or web form"
      },
      {
        id: 2,
        name: "Classification",
        type: "AI",
        description: "Automatically classify ticket priority and category using AI"
      },
      {
        id: 3,
        name: "Agent Assignment",
        type: "Routing",
        description: "Assign to appropriate support agent based on skills and workload"
      },
      {
        id: 4,
        name: "Customer Notification",
        type: "Communication",
        description: "Send confirmation email with ticket number and expected response time"
      }
    ]
  },
  {
    id: 4,
    name: "Project Approval Template",
    description: "Multi-stage project approval workflow with stakeholder reviews",
    category: "Operations",
    difficulty: "Hard",
    steps: 8,
    estimatedTime: "2-4 weeks",
    detailedSteps: [
      {
        id: 1,
        name: "Project Proposal",
        type: "Document",
        description: "Submit project proposal with scope, timeline, and budget"
      },
      {
        id: 2,
        name: "Initial Review",
        type: "Review",
        description: "Department manager reviews proposal for feasibility"
      },
      {
        id: 3,
        name: "Budget Analysis",
        type: "Financial",
        description: "Finance team analyzes budget and resource requirements"
      },
      {
        id: 4,
        name: "Stakeholder Input",
        type: "Collaboration",
        description: "Collect input from all relevant stakeholders and departments"
      },
      {
        id: 5,
        name: "Risk Assessment",
        type: "Analysis",
        description: "Conduct risk analysis and mitigation planning"
      },
      {
        id: 6,
        name: "Executive Review",
        type: "Approval",
        description: "Executive leadership reviews and provides final approval"
      },
      {
        id: 7,
        name: "Resource Allocation",
        type: "Resource",
        description: "Allocate team members and resources to approved project"
      },
      {
        id: 8,
        name: "Project Kickoff",
        type: "Communication",
        description: "Send project approval notification and schedule kickoff meeting"
      }
    ]
  },
  {
    id: 5,
    name: "Equipment Maintenance Template",
    description: "Preventive maintenance workflow for IT and office equipment",
    category: "Operations",
    difficulty: "Medium",
    steps: 5,
    estimatedTime: "1-2 days",
    detailedSteps: [
      {
        id: 1,
        name: "Maintenance Schedule",
        type: "Scheduling",
        description: "Automatically schedule maintenance based on equipment type and usage"
      },
      {
        id: 2,
        name: "Technician Assignment",
        type: "Resource",
        description: "Assign qualified technician based on equipment type and availability"
      },
      {
        id: 3,
        name: "Maintenance Execution",
        type: "Task",
        description: "Perform scheduled maintenance and document any issues found"
      },
      {
        id: 4,
        name: "Quality Check",
        type: "Validation",
        description: "Verify maintenance completion and equipment functionality"
      },
      {
        id: 5,
        name: "Documentation",
        type: "Documentation",
        description: "Update maintenance records and schedule next maintenance cycle"
      }
    ]
  },
  {
    id: 6,
    name: "Security Incident Response",
    description: "Comprehensive security incident detection and response workflow",
    category: "Security",
    difficulty: "Hard",
    steps: 7,
    estimatedTime: "Immediate - 24 hours",
    detailedSteps: [
      {
        id: 1,
        name: "Incident Detection",
        type: "Monitoring",
        description: "Automated detection of security incidents through monitoring systems"
      },
      {
        id: 2,
        name: "Initial Assessment",
        type: "Analysis",
        description: "Security team performs initial assessment of incident severity"
      },
      {
        id: 3,
        name: "Containment",
        type: "Security",
        description: "Implement immediate containment measures to prevent spread"
      },
      {
        id: 4,
        name: "Investigation",
        type: "Forensics",
        description: "Conduct detailed investigation to determine scope and impact"
      },
      {
        id: 5,
        name: "Notification",
        type: "Communication",
        description: "Notify relevant stakeholders and authorities as required"
      },
      {
        id: 6,
        name: "Remediation",
        type: "Resolution",
        description: "Implement fixes and security improvements to prevent recurrence"
      },
      {
        id: 7,
        name: "Post-Incident Review",
        type: "Review",
        description: "Conduct lessons learned session and update security procedures"
      }
    ]
  }
];
