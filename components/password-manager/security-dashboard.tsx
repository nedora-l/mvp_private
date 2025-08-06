"use client"

import { Dictionary } from "@/locales/dictionary"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ShieldCheck, ShieldAlert, History, AlertCircle, Key, RefreshCw } from "lucide-react"

interface SecurityDashboardProps {
  dictionary: Dictionary
}

// Mock security data
const securityData = {
  overallScore: 85,
  lastScan: "2025-05-05T10:30:00Z",
  issues: [
    {
      type: "weak",
      count: 2,
      items: ["Social Media Login", "Old Forum Account"],
      severity: "high"
    },
    {
      type: "reused",
      count: 3,
      items: ["Shopping Account", "News Site", "Streaming Service"],
      severity: "medium"
    },
    {
      type: "old",
      count: 5,
      items: ["Email Password", "Cloud Storage", "Project Management", "Music Service", "Food Delivery"],
      severity: "low"
    }
  ]
};

export function SecurityDashboard({ dictionary }: SecurityDashboardProps) {
  const dict = dictionary.passwordManager;
  
  // Helper function to get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "text-destructive";
      case "medium": return "text-yellow-500";
      case "low": return "text-orange-400";
      default: return "text-muted-foreground";
    }
  };

  // Helper function to get issue icon
  const getIssueIcon = (type: string) => {
    switch (type) {
      case "weak": return <ShieldAlert className={`h-5 w-5 ${getSeverityColor("high")}`} />;
      case "reused": return <AlertTriangle className={`h-5 w-5 ${getSeverityColor("medium")}`} />;
      case "old": return <History className={`h-5 w-5 ${getSeverityColor("low")}`} />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overall Security Score Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              {dict.security.overall}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="text-5xl font-bold">{securityData.overallScore}%</div>
              <Progress value={securityData.overallScore} className="w-full" />
              <p className="text-sm text-muted-foreground pt-2">
                {securityData.overallScore > 80 
                  ? "Your password security is good, but there's still room for improvement." 
                  : "Your password security needs attention. Address the issues below to improve."}
              </p>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
              <span>
                {dict.security.lastScan}: {new Date(securityData.lastScan).toLocaleDateString()}
              </span>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <RefreshCw className="h-4 w-4" />
                {dict.security.scanNow}
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Security Issues Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {dict.security.issues}
            </CardTitle>
            <CardDescription>
              {securityData.issues.reduce((acc, issue) => acc + issue.count, 0)} issues found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {securityData.issues.map((issue) => (
                <div key={issue.type} className="flex items-start gap-3">
                  {getIssueIcon(issue.type)}
                  <div className="space-y-1">
                    <div className="font-medium">
                      {issue.count} {dict.security[issue.type as keyof typeof dict.security]}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {issue.items.slice(0, 2).join(", ")}
                      {issue.items.length > 2 ? ` +${issue.items.length - 2} more` : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Password Health Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Password Health Recommendations</CardTitle>
          <CardDescription>
            Address these issues to improve your password security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityData.issues.map((issue) => (
              <div key={`rec-${issue.type}`} className="flex gap-4 items-start pb-4 border-b">
                {getIssueIcon(issue.type)}
                <div className="space-y-1">
                  <h4 className="font-medium">
                    {issue.type === "weak" && "Strengthen weak passwords"}
                    {issue.type === "reused" && "Eliminate password reuse"}
                    {issue.type === "old" && "Update old passwords"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {issue.type === "weak" && "Weak passwords are vulnerable to brute force attacks. Update them with stronger, more complex passwords."}
                    {issue.type === "reused" && "Using the same password on multiple sites puts all your accounts at risk if one is compromised."}
                    {issue.type === "old" && "Passwords should be changed periodically. Some of your passwords haven't been updated in over a year."}
                  </p>
                  <div className="pt-2">
                    <Button variant="outline" size="sm">
                      Fix Issues
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}