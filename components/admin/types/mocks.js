// Mock workflows data with enhanced structure
export const workflowsMockData = [
{
    id: 1,
    name: "User Onboarding",
    description: "Automated user registration and welcome process",
    status: "Active",
    lastRun: "2 hours ago",
    trigger: "User Registration",
    executions: 47,
    successRate: 98,
    category: "HR",
    createdBy: "Admin",
    createdAt: "2024-01-15",
    version: "1.2",
    steps: [
    { id: 1, name: "Send Welcome Email", type: "Email", status: "Success", duration: "0.5s" },
    { id: 2, name: "Create User Profile", type: "Database", status: "Success", duration: "1.2s" },
    { id: 3, name: "Assign Default Role", type: "Permission", status: "Success", duration: "0.3s" },
    { id: 4, name: "Send Slack Notification", type: "Integration", status: "Success", duration: "0.8s" }
    ],
    recentExecutions: [
    { id: 1, timestamp: "2024-12-05T10:30:00", status: "Success", duration: "2.8s", user: "john.doe@example.com" },
    { id: 2, timestamp: "2024-12-05T09:15:00", status: "Success", duration: "3.1s", user: "jane.smith@example.com" },
    { id: 3, timestamp: "2024-12-05T08:45:00", status: "Failed", duration: "1.5s", user: "bob.wilson@example.com", error: "Email service timeout" }
    ]
},
{
    id: 2,
    name: "Monthly Report Generation",
    description: "Generate and distribute monthly performance reports",
    status: "Active", 
    lastRun: "1 day ago",
    trigger: "Schedule",
    executions: 12,
    successRate: 100,
    category: "Reporting",
    createdBy: "Manager",
    createdAt: "2024-02-01",
    version: "2.0",
    steps: [
    { id: 1, name: "Gather Data", type: "Database", status: "Success", duration: "15.2s" },
    { id: 2, name: "Generate Charts", type: "Processing", status: "Success", duration: "8.7s" },
    { id: 3, name: "Create PDF Report", type: "Document", status: "Success", duration: "5.1s" },
    { id: 4, name: "Email Distribution", type: "Email", status: "Success", duration: "2.3s" }
    ],
    recentExecutions: [
    { id: 1, timestamp: "2024-12-01T00:00:00", status: "Success", duration: "31.3s", user: "system" },
    { id: 2, timestamp: "2024-11-01T00:00:00", status: "Success", duration: "29.8s", user: "system" }
    ]
},    {
    id: 3,
    name: "Invoice Processing",
    description: "Automated invoice approval and processing workflow",
    status: "Paused",
    lastRun: "3 days ago",
    trigger: "Document Upload",
    executions: 156,
    successRate: 94,
    category: "Finance",
    createdBy: "Finance Team",
    createdAt: "2023-12-10",
    version: "1.5",
    steps: [
    { id: 1, name: "Document Validation", type: "Validation", status: "Success", duration: "2.1s" },
    { id: 2, name: "Extract Invoice Data", type: "OCR", status: "Success", duration: "4.5s" },
    { id: 3, name: "Manager Approval", type: "Approval", status: "Pending", duration: "-" },
    { id: 4, name: "Payment Processing", type: "Integration", status: "Waiting", duration: "-" }
    ],
    recentExecutions: [
    { id: 1, timestamp: "2024-12-02T14:20:00", status: "Pending", duration: "6.6s", user: "accounts@company.com" },
    { id: 2, timestamp: "2024-12-02T11:30:00", status: "Success", duration: "12.3s", user: "vendor@supplier.com" }
    ]
},
{
    id: 4,
    name: "Support Ticket Routing",
    description: "Automatically route support tickets to appropriate teams",
    status: "Active",
    lastRun: "5 minutes ago", 
    trigger: "Ticket Creation",
    executions: 234,
    successRate: 96,
    category: "Support",
    createdBy: "IT Support",
    createdAt: "2024-03-20",
    version: "1.8",
    steps: [
    { id: 1, name: "Classify Ticket", type: "AI", status: "Success", duration: "1.2s" },
    { id: 2, name: "Assign Priority", type: "Logic", status: "Success", duration: "0.3s" },
    { id: 3, name: "Route to Team", type: "Assignment", status: "Success", duration: "0.5s" },
    { id: 4, name: "Send Notifications", type: "Communication", status: "Success", duration: "0.8s" }
    ],
    recentExecutions: [
    { id: 1, timestamp: "2024-12-05T11:25:00", status: "Success", duration: "2.8s", user: "customer@email.com" },
    { id: 2, timestamp: "2024-12-05T11:20:00", status: "Success", duration: "2.3s", user: "user@domain.com" },
    { id: 3, timestamp: "2024-12-05T11:15:00", status: "Failed", duration: "1.0s", user: "support@request.com", error: "Team assignment failed" }
    ]
},
{
    id: 5,
    name: "Backup & Archive",
    description: "Daily backup and archival of important data",
    status: "Failed",
    lastRun: "12 hours ago",
    trigger: "Schedule",
    executions: 365,
    successRate: 89,
    category: "System",
    createdBy: "System Admin",
    createdAt: "2023-08-15",
    version: "3.1",
    steps: [
    { id: 1, name: "Database Backup", type: "Backup", status: "Success", duration: "45.2s" },
    { id: 2, name: "File System Backup", type: "Backup", status: "Failed", duration: "12.1s" },
    { id: 3, name: "Archive Old Data", type: "Archive", status: "Not Run", duration: "-" },
    { id: 4, name: "Send Report", type: "Notification", status: "Not Run", duration: "-" }
    ],
    recentExecutions: [
    { id: 1, timestamp: "2024-12-04T23:00:00", status: "Failed", duration: "57.3s", user: "system", error: "Disk space insufficient" },
    { id: 2, timestamp: "2024-12-03T23:00:00", status: "Success", duration: "67.8s", user: "system" }
    ]
}
]
  // Enhanced workflow templates with detailed steps
export const templatesMockData = [
    {
      id: 1,
      name: "Employee Offboarding",
      description: "Comprehensive offboarding process for departing employees",
      category: "HR",
      steps: 8,
      estimatedTime: "30 minutes",
      difficulty: "Medium",
      detailedSteps: [
        { id: 1, name: "Revoke System Access", description: "Remove all system permissions and access rights", type: "Security" },
        { id: 2, name: "Collect Equipment", description: "Schedule and track return of company equipment", type: "Asset Management" },
        { id: 3, name: "Knowledge Transfer", description: "Facilitate handover of responsibilities", type: "Documentation" },
        { id: 4, name: "Exit Interview", description: "Schedule and conduct exit interview", type: "HR Process" },
        { id: 5, name: "Final Payroll", description: "Process final salary and benefits", type: "Payroll" },
        { id: 6, name: "Remove from Systems", description: "Remove from directory, email, and other systems", type: "IT" },
        { id: 7, name: "Update Org Chart", description: "Update organizational structure", type: "Documentation" },
        { id: 8, name: "Archive Records", description: "Properly archive employee records", type: "Records Management" }
      ]
    },
    {
      id: 2,
      name: "Document Approval",
      description: "Multi-stage document review and approval process",
      category: "Approval",
      steps: 5,
      estimatedTime: "15 minutes",
      difficulty: "Easy",
      detailedSteps: [
        { id: 1, name: "Document Upload", description: "Upload document for review", type: "Input" },
        { id: 2, name: "Initial Review", description: "First-level review by team lead", type: "Review" },
        { id: 3, name: "Manager Approval", description: "Manager approval for significant documents", type: "Approval" },
        { id: 4, name: "Final Approval", description: "Final sign-off by authorized personnel", type: "Authorization" },
        { id: 5, name: "Distribution", description: "Distribute approved document to stakeholders", type: "Communication" }
      ]
    },
    {
      id: 3,
      name: "Data Migration",
      description: "Automated data migration between systems",
      category: "System",
      steps: 12,
      estimatedTime: "45 minutes",
      difficulty: "Hard",
      detailedSteps: [
        { id: 1, name: "Pre-Migration Validation", description: "Validate source data integrity", type: "Validation" },
        { id: 2, name: "Backup Creation", description: "Create backup of source system", type: "Backup" },
        { id: 3, name: "Schema Mapping", description: "Map source to target schema", type: "Mapping" },
        { id: 4, name: "Data Transformation", description: "Transform data to target format", type: "Transformation" },
        { id: 5, name: "Data Loading", description: "Load transformed data to target", type: "Loading" },
        { id: 6, name: "Integrity Check", description: "Verify data integrity post-migration", type: "Validation" }
      ]
    },
    {
      id: 4,
      name: "Customer Feedback Loop",
      description: "Collect and process customer feedback automatically",
      category: "Customer Service",
      steps: 6,
      estimatedTime: "20 minutes",
      difficulty: "Medium",
      detailedSteps: [
        { id: 1, name: "Send Survey", description: "Automatically send feedback survey", type: "Communication" },
        { id: 2, name: "Collect Responses", description: "Aggregate survey responses", type: "Data Collection" },
        { id: 3, name: "Analyze Sentiment", description: "AI-powered sentiment analysis", type: "Analysis" },
        { id: 4, name: "Generate Insights", description: "Create actionable insights", type: "Processing" },
        { id: 5, name: "Route Issues", description: "Route critical issues to support", type: "Routing" },
        { id: 6, name: "Report Generation", description: "Generate feedback summary report", type: "Reporting" }
      ]
    },
    {
      id: 5,
      name: "Invoice Processing from PDF/Image",
      description: "Automatically extract and process invoice data from PDF documents or images",
      category: "Finance",
      steps: 10,
      estimatedTime: "25 minutes",
      difficulty: "Medium",
      detailedSteps: [
        { id: 1, name: "Document Upload", description: "Upload PDF or image file containing invoice", type: "Input" },
        { id: 2, name: "File Format Detection", description: "Detect and validate file format (PDF/JPG/PNG)", type: "Validation" },
        { id: 3, name: "OCR Processing", description: "Extract text content from document using OCR", type: "OCR" },
        { id: 4, name: "Invoice Data Extraction", description: "Identify and extract key invoice fields (vendor, amount, date, etc.)", type: "AI/ML" },
        { id: 5, name: "Data Validation", description: "Validate extracted data against business rules", type: "Validation" },
        { id: 6, name: "Vendor Verification", description: "Cross-check vendor information against database", type: "Database" },
        { id: 7, name: "Amount Verification", description: "Verify invoice amounts and calculations", type: "Calculation" },
        { id: 8, name: "Approval Routing", description: "Route invoice to appropriate approver based on amount/vendor", type: "Workflow" },
        { id: 9, name: "System Integration", description: "Create entries in accounting system", type: "Integration" },
        { id: 10, name: "Notification & Archive", description: "Send notifications and archive processed invoice", type: "Communication" }
      ]
    },
    {
      id: 6,
      name: "Website Availability Monitor",
      description: "Automated monitoring of website availability and performance",
      category: "Monitoring",
      steps: 8,
      estimatedTime: "10 minutes",
      difficulty: "Easy",
      detailedSteps: [
        { id: 1, name: "URL Configuration", description: "Configure list of websites to monitor", type: "Configuration" },
        { id: 2, name: "Health Check Request", description: "Send HTTP requests to target websites", type: "Network" },
        { id: 3, name: "Response Analysis", description: "Analyze HTTP response codes and response times", type: "Analysis" },
        { id: 4, name: "Performance Metrics", description: "Collect performance metrics (load time, size, etc.)", type: "Metrics" },
        { id: 5, name: "Status Determination", description: "Determine overall website health status", type: "Logic" },
        { id: 6, name: "Issue Detection", description: "Detect outages, slow responses, or errors", type: "Detection" },
        { id: 7, name: "Alert Generation", description: "Generate alerts for critical issues", type: "Alerting" },
        { id: 8, name: "Status Reporting", description: "Update monitoring dashboard and send reports", type: "Reporting" }
      ]
    },
    {
      id: 7,
      name: "Security Scan & Assessment",
      description: "Comprehensive security scanning and vulnerability assessment workflow",
      category: "Security",
      steps: 12,
      estimatedTime: "60 minutes",
      difficulty: "Hard",
      detailedSteps: [
        { id: 1, name: "Scan Initialization", description: "Initialize security scan parameters and targets", type: "Configuration" },
        { id: 2, name: "Network Discovery", description: "Discover network topology and active services", type: "Discovery" },
        { id: 3, name: "Port Scanning", description: "Scan for open ports and running services", type: "Network Scan" },
        { id: 4, name: "Vulnerability Detection", description: "Identify known vulnerabilities using CVE database", type: "Vulnerability Scan" },
        { id: 5, name: "Web Application Scan", description: "Scan web applications for OWASP Top 10 vulnerabilities", type: "Web Scan" },
        { id: 6, name: "SSL/TLS Assessment", description: "Evaluate SSL/TLS configuration and certificates", type: "SSL Scan" },
        { id: 7, name: "Authentication Testing", description: "Test authentication mechanisms and password policies", type: "Auth Test" },
        { id: 8, name: "Configuration Review", description: "Review system and application configurations", type: "Config Review" },
        { id: 9, name: "Risk Assessment", description: "Analyze and prioritize identified vulnerabilities", type: "Risk Analysis" },
        { id: 10, name: "Compliance Check", description: "Check compliance against security standards (PCI, SOX, etc.)", type: "Compliance" },
        { id: 11, name: "Report Generation", description: "Generate detailed security assessment report", type: "Reporting" },
        { id: 12, name: "Remediation Planning", description: "Create remediation plan and recommendations", type: "Planning" }
      ]
    }
]
