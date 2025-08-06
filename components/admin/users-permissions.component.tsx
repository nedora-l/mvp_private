"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dictionary } from "@/locales/dictionary"
import { 
  Search, 
  UserPlus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Shield, 
  Eye,
  Users,
  Crown,
  Settings,
  RefreshCcw,
  AlertCircle,
  Upload,
  Mail,
  Phone,
  MapPin,
  Building
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { directoryApiClient } from "@/lib/services/client/directory/directory.client.service"
import { ApiResponse, AppDepartment, AppEmployee, AppTeam as ApiTeam, HateoasResponse } from "@/lib/interfaces/apis"
import { AppTeam } from "@/lib/interfaces/app/teams/teams_data_types"
import { RegisterModal } from "@/components/auth/register-modal"
import { ImportUsersModal } from "@/components/directory/import-users-modal"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

interface UsersPermissionsProps {
  dictionary: Dictionary
  locale: string
  initialEmployees?: AppEmployee[];
  initialDepartments?: AppDepartment[];
  initialTeams?: ApiTeam[];
}

export function UsersPermissionsComponent({ 
  dictionary, 
  locale,
  initialEmployees = [],
  initialDepartments = [],
  initialTeams = []
}: UsersPermissionsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  
  // State management
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [employeesList, setEmployeesList] = useState<AppEmployee[]>(initialEmployees);
  const [departmentsList, setDepartmentsList] = useState<AppDepartment[]>(initialDepartments);
  const [teamsList, setTeamsList] = useState<ApiTeam[]>(initialTeams);
  
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState("all")
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all")

  // User modal states
  const [viewingUser, setViewingUser] = useState<AppEmployee | null>(null);
  const [editingUser, setEditingUser] = useState<AppEmployee | null>(null);

  // Fetch functions
  const fetchDepartments = async () => {
    setIsLoading(true);
    setError(null);
    console.log("Fetching departments from API...");
    directoryApiClient.getDepartments({
      query: "",
      page: 0,
      size: 100
    }).then((results: ApiResponse<HateoasResponse<AppDepartment>>) => {
        if(results.status === 200 && results.data) {
          setDepartmentsList(results.data._embedded?.organizationDepartmentDtoList || []);
        }
        else if(results.error) {
          setError(results.error?.message || "Failed to fetch department data");
        }
      }).catch((err) => {
        setError(err.message || "Failed to fetch department data");
      }).finally(() => {
        setIsLoading(false);
      });
  };
  
  const fetchTeams = async () => {
    setIsLoading(true);
    setError(null);
    console.log("Fetching teams from API...");
    directoryApiClient.getTeams({
      query: "",
      page: 0,
      size: 100
    }).then((results: ApiResponse<HateoasResponse<ApiTeam>>) => {
        if(results.status === 200 && results.data) {
          setTeamsList(results.data._embedded?.organizationTeamDtoList || []);
        }
        else if(results.error) {
          setError(results.error?.message || "Failed to fetch team data");
        }
      }).catch((err) => {
        setError(err.message || "Failed to fetch team data");
      }).finally(() => {
        setIsLoading(false);
      });
  };
  
  const fetchEmployees = async () => {
    setIsLoading(true);
    setError(null);
    console.log("Fetching employees from API...");
    directoryApiClient.getEmployees({
      query: searchTerm,
      page: 0,
      size: 100
    }).then((results: ApiResponse<HateoasResponse<AppEmployee>>) => {
        if(results.status === 200 && results.data) {
          setEmployeesList(results.data._embedded?.userEmployeeDtoList || []);
        }
        else if(results.error) {
          setError(results.error?.message || "Failed to fetch employee data");
        }
      }).catch((err) => {
        setError(err.message || "Failed to fetch employee data");
      }).finally(() => {
        setIsLoading(false);
      });
  };

  const refreshAll = () => {
    setError(null);
    fetchEmployees();
    fetchDepartments();
    fetchTeams();
  }

  // Handle user update
  const handleSaveUser = async (updatedUser: AppEmployee) => {
    try {
      // TODO: Implement API call to update user
      console.log("Updating user:", updatedUser);
      
      // For now, update the local state
      const updatedEmployees = employeesList.map(emp => 
        emp.id === updatedUser.id ? updatedUser : emp
      );
      setEmployeesList(updatedEmployees);
      
      // In a real implementation, you would call the API:
      // await directoryApiClient.updateEmployee(updatedUser.id, updatedUser);
      // refreshAll();
    } catch (error) {
      console.error("Failed to update user:", error);
      setError("Failed to update user");
    }
  };

  // Handle user delete
  const handleDeleteUser = async (userId: string | number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        // TODO: Implement API call to delete user
        console.log("Deleting user:", userId);
        
        // For now, update the local state
        const updatedEmployees = employeesList.filter(emp => emp.id !== userId);
        setEmployeesList(updatedEmployees);
        
        // In a real implementation, you would call the API:
        // await directoryApiClient.deleteEmployee(userId);
        // refreshAll();
      } catch (error) {
        console.error("Failed to delete user:", error);
        setError("Failed to delete user");
      }
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (initialEmployees.length === 0) {
      refreshAll();
    }
  }, []);

  // Trigger search when searchTerm changes
  useEffect(() => {
    if (searchTerm && searchTerm.length > 2) {
      const debounceTimer = setTimeout(() => {
        fetchEmployees();
      }, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [searchTerm]);

  // Filter employees based on search term and filters
  const filterEmployees = (employees: AppEmployee[], term: string): AppEmployee[] => {
    if (!term && selectedDepartmentFilter === "all" && selectedStatusFilter === "all") return employees;
    
    return employees.filter(employee => {
      const matchesSearch = !term || 
        (employee.name || "").toLowerCase().includes(term.toLowerCase()) ||
        (employee.title || "").toLowerCase().includes(term.toLowerCase()) ||
        (employee.department?.name || "").toLowerCase().includes(term.toLowerCase()) ||
        (employee.email || "").toLowerCase().includes(term.toLowerCase());
      
      const matchesDepartment = selectedDepartmentFilter === "all" || 
        employee.department?.name === selectedDepartmentFilter;
      
      // Note: AppEmployee doesn't have status field, so we'll need to add this or map from user status
      const matchesStatus = selectedStatusFilter === "all"; // || employee.status === selectedStatusFilter;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  };
  
  // Get filtered employees list
  const filteredEmployees = filterEmployees(employeesList, searchTerm);

  // Helper functions
  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case "Administrator":
      case "ADMIN":
        return <Crown className="h-4 w-4" />
      case "Manager":
      case "MANAGER":
        return <Shield className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getRoleBadgeVariant = (roleName: string) => {
    switch (roleName) {
      case "Administrator":
      case "ADMIN":
        return "destructive" as const
      case "Manager":
      case "MANAGER":
        return "default" as const
      default:
        return "secondary" as const
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
      case "En mission":
      case "Disponible":
        return "default" as const
      case "En formation":
        return "secondary" as const
      case "Inactive":
      case "En congé":
        return "outline" as const
      default:
        return "secondary" as const
    }
  }

  const getUserPrimaryRole = (roles: string[] | string | undefined): string => {
    if (!roles) return "USER";
    if (typeof roles === "string") return roles;
    if (Array.isArray(roles) && roles.length > 0) {
      // Return the highest priority role
      if (roles.includes("ADMIN") || roles.includes("Administrator")) return "Administrator";
      if (roles.includes("MANAGER") || roles.includes("Manager")) return "Manager";
      return roles[0];
    }
    return "USER";
  }

  // Skeleton components
  function UsersTableSkeleton() {
    return (
      <Card>
        <CardHeader>
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-32 rounded-lg" />
            <Skeleton className="h-8 w-40 rounded-lg" />
          </div>
        </div>
        <UsersTableSkeleton />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={refreshAll}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            Users & Permissions Management
          </h1>
          <p className="text-gray-600 mt-1">Manage user accounts, roles and access permissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refreshAll} className="flex items-center gap-2">
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
          <ImportUsersModal />
          <RegisterModal onRegistrationSuccess={refreshAll} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Users</p>
                <p className="text-2xl font-bold text-blue-900">{employeesList.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active Users</p>
                <p className="text-2xl font-bold text-green-900">{employeesList.filter(emp => emp.user).length}</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Departments</p>
                <p className="text-2xl font-bold text-orange-900">{departmentsList.length}</p>
              </div>
              <Settings className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Teams</p>
                <p className="text-2xl font-bold text-purple-900">{teamsList.length}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {/* Users Header Actions */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select 
                aria-label="Filter by Department"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedDepartmentFilter}
                onChange={(e) => setSelectedDepartmentFilter(e.target.value)}
              >
                <option value="all">All Departments</option>
                {departmentsList.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
              
              <select 
                aria-label="Filter by Status"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                Showing {filteredEmployees.length} of {employeesList.length} users
              </p>
            </div>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Users ({filteredEmployees.length})</CardTitle>
              <CardDescription>
                Manage user accounts and their access permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={employee.avatar} alt={employee.name || ''} />
                            <AvatarFallback>
                              {(employee.firstname?.[0] || '') + (employee.lastname?.[0] || '')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{employee.name || `${employee.firstname} ${employee.lastname}`}</div>
                            <div className="text-sm text-muted-foreground">{employee.email}</div>
                            {employee.title && (
                              <div className="text-xs text-muted-foreground">{employee.title}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {employee.department ? (
                          <Badge variant="outline">{employee.department.name}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {employee.team ? (
                          <Badge variant="outline">{employee.team.name}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(getUserPrimaryRole(employee.user?.roles))} className="flex items-center gap-1 w-fit">
                          {getRoleIcon(getUserPrimaryRole(employee.user?.roles))}
                          {getUserPrimaryRole(employee.user?.roles)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(employee.user ? "Active" : "Inactive")}>
                          {employee.user ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setViewingUser(employee)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditingUser(employee)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteUser(employee.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <DepartmentsManagementTab 
            departments={departmentsList}
            onRefresh={fetchDepartments}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <TeamsManagementTab 
            teams={teamsList}
            departments={departmentsList}
            onRefresh={fetchTeams}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          {/* Roles Content - keeping the original mock data for now */}
          <RolesPermissionsTab />
        </TabsContent>
      </Tabs>

      {/* User Preview Modal */}
      {viewingUser && (
        <UserPreviewModal 
          user={viewingUser} 
          isOpen={!!viewingUser} 
          onClose={() => setViewingUser(null)} 
        />
      )}

      {/* User Edit Modal */}
      {editingUser && (
        <UserEditModal 
          user={editingUser} 
          isOpen={!!editingUser} 
          onClose={() => setEditingUser(null)} 
          onSave={handleSaveUser}
          departments={departmentsList}
          teams={teamsList}
        />
      )}
    </div>
  )
}

// Separate component for departments tab
function DepartmentsManagementTab({ 
  departments, 
  onRefresh, 
  isLoading 
}: { 
  departments: AppDepartment[], 
  onRefresh: () => void, 
  isLoading: boolean 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<AppDepartment | null>(null);

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateDepartment = async (departmentData: any) => {
    try {
      // TODO: Implement API call to create department
      console.log("Creating department:", departmentData);
      onRefresh();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create department:", error);
    }
  };

  const handleEditDepartment = async (departmentData: any) => {
    try {
      // TODO: Implement API call to update department
      console.log("Updating department:", departmentData);
      onRefresh();
      setEditingDepartment(null);
    } catch (error) {
      console.error("Failed to update department:", error);
    }
  };

  const handleDeleteDepartment = async (departmentId: string | number) => {
    if (confirm("Are you sure you want to delete this department?")) {
      try {
        // TODO: Implement API call to delete department
        console.log("Deleting department:", departmentId);
        onRefresh();
      } catch (error) {
        console.error("Failed to delete department:", error);
      }
    }
  };

  return (
    <>
      {/* Departments Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Departments Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage organizational departments and their structure
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Department
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {filteredDepartments.length} of {departments.length} departments
        </p>
      </div>

      {/* Departments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Departments ({filteredDepartments.length})</CardTitle>
          <CardDescription>
            Manage organizational departments and their hierarchy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Settings className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{department.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">
                      -
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {/* TODO: Calculate actual employee count */}
                      0 employees
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      -
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setEditingDepartment(department)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Department
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteDepartment(department.id!)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Department
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Department Modal */}
      <DepartmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateDepartment}
        title="Create New Department"
      />

      {/* Edit Department Modal */}
      <DepartmentModal
        isOpen={!!editingDepartment}
        onClose={() => setEditingDepartment(null)}
        onSubmit={handleEditDepartment}
        title="Edit Department"
        initialData={editingDepartment}
      />
    </>
  );
}

// Separate component for teams tab
function TeamsManagementTab({ 
  teams, 
  departments, 
  onRefresh, 
  isLoading 
}: { 
  teams: ApiTeam[], 
  departments: AppDepartment[], 
  onRefresh: () => void, 
  isLoading: boolean 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<ApiTeam | null>(null);

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (team.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleCreateTeam = async (teamData: any) => {
    try {
      // TODO: Implement API call to create team
      console.log("Creating team:", teamData);
      onRefresh();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create team:", error);
    }
  };

  const handleEditTeam = async (teamData: any) => {
    try {
      // TODO: Implement API call to update team
      console.log("Updating team:", teamData);
      onRefresh();
      setEditingTeam(null);
    } catch (error) {
      console.error("Failed to update team:", error);
    }
  };

  const handleDeleteTeam = async (teamId: string | number) => {
    if (confirm("Are you sure you want to delete this team?")) {
      try {
        // TODO: Implement API call to delete team
        console.log("Deleting team:", teamId);
        onRefresh();
      } catch (error) {
        console.error("Failed to delete team:", error);
      }
    }
  };

  return (
    <>
      {/* Teams Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Teams Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage teams within departments and their members
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Users className="h-4 w-4 mr-2" />
          Add Team
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {filteredTeams.length} of {teams.length} teams
        </p>
      </div>

      {/* Teams Table */}
      <Card>
        <CardHeader>
          <CardTitle>Teams ({filteredTeams.length})</CardTitle>
          <CardDescription>
            Manage teams and their department assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">{team.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">-</span>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">
                      {team.description || "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {team.members || 0} members
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      -
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setEditingTeam(team)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Team
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteTeam(team.id!)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Team
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Team Modal */}
      <TeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTeam}
        departments={departments}
        title="Create New Team"
      />

      {/* Edit Team Modal */}
      <TeamModal
        isOpen={!!editingTeam}
        onClose={() => setEditingTeam(null)}
        onSubmit={handleEditTeam}
        departments={departments}
        title="Edit Team"
        initialData={editingTeam}
      />
    </>
  );
}
function RolesPermissionsTab() {
  // Mock roles data - can be replaced with real data later
  const roles = [
    {
      id: 1,
      name: "Administrator",
      description: "Full system access and administrative privileges",
      userCount: 3,
      permissions: ["read", "write", "delete", "admin"],
      color: "red"
    },
    {
      id: 2,
      name: "Manager", 
      description: "Team management and reporting access",
      userCount: 12,
      permissions: ["read", "write", "manage_team"],
      color: "blue"
    },
    {
      id: 3,
      name: "User",
      description: "Standard user access to applications",
      userCount: 156,
      permissions: ["read"],
      color: "green"
    },
    {
      id: 4,
      name: "Guest",
      description: "Limited read-only access",
      userCount: 23,
      permissions: ["read_limited"],
      color: "gray"
    }
  ]

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case "Administrator":
        return <Crown className="h-4 w-4" />
      case "Manager":
        return <Shield className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  return (
    <>
      {/* Roles Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Roles & Permissions</h3>
          <p className="text-sm text-muted-foreground">
            Configure roles and their associated permissions
          </p>
        </div>
        <Button>
          <Shield className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </div>

      {/* Roles Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {roles.map((role) => (
          <Card key={role.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {getRoleIcon(role.name)}
                  {role.name}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Role
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="h-4 w-4 mr-2" />
                      Permissions
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Role
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>
                {role.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Users</span>
                  <Badge variant="secondary">{role.userCount}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Permissions:</p>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.map((permission) => (
                      <Badge key={permission} variant="outline" className="text-xs">
                        {permission.replace("_", " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}

// Department Modal Component
const departmentSchema = z.object({
  name: z.string().min(2, "Department name must be at least 2 characters"),
});

function DepartmentModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialData = null
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  title: string;
  initialData?: AppDepartment | null;
}) {
  const form = useForm<z.infer<typeof departmentSchema>>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: initialData?.name || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name || "",
      });
    } else {
      form.reset({
        name: "",
      });
    }
  }, [initialData, form]);

  const handleSubmit = (values: z.infer<typeof departmentSchema>) => {
    onSubmit({
      ...values,
      id: initialData?.id,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {initialData ? "Update department information" : "Create a new department for your organization"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter department name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {initialData ? "Update" : "Create"} Department
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Team Modal Component
const teamSchema = z.object({
  name: z.string().min(2, "Team name must be at least 2 characters"),
  description: z.string().optional(),
});

function TeamModal({
  isOpen,
  onClose,
  onSubmit,
  departments,
  title,
  initialData = null
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  departments: AppDepartment[];
  title: string;
  initialData?: ApiTeam | null;
}) {
  const form = useForm<z.infer<typeof teamSchema>>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name || "",
        description: initialData.description || "",
      });
    } else {
      form.reset({
        name: "",
        description: "",
      });
    }
  }, [initialData, form]);

  const handleSubmit = (values: z.infer<typeof teamSchema>) => {
    onSubmit({
      ...values,
      id: initialData?.id,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {initialData ? "Update team information" : "Create a new team within a department"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter team name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter team description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {initialData ? "Update" : "Create"} Team
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// User Preview Modal Component
function UserPreviewModal({ 
  user, 
  isOpen, 
  onClose 
}: { 
  user: AppEmployee | null; 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            View detailed information about this user
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* User Profile Section */}
          <div className="flex items-start space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} alt={user.name || `${user.firstname} ${user.lastname}`} />
              <AvatarFallback>
                {user.firstname?.[0]}{user.lastname?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{user.name || `${user.firstname} ${user.lastname}`}</h3>
              <p className="text-gray-600">{user.title || "No title specified"}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={user.user ? "default" : "secondary"}>
                  {user.user ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{user.phone || "No phone number"}</span>
                </div>
                {user.location && (
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{user.location}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Organization</h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Building className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{user.department?.name || "No department"}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{user.team?.name || "No team"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {user.team?.description && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Team Information</h4>
              <p className="text-sm text-gray-600">{user.team.description}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// User Edit Modal Component
function UserEditModal({ 
  user, 
  isOpen, 
  onClose, 
  onSave,
  departments,
  teams
}: { 
  user: AppEmployee | null; 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (updatedUser: AppEmployee) => void;
  departments: AppDepartment[];
  teams: ApiTeam[];
}) {
  if (!user) return null;

  const userEditSchema = z.object({
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    title: z.string().optional(),
    departmentId: z.string().optional(),
    teamId: z.string().optional(),
    location: z.string().optional(),
  });

  type UserEditFormData = z.infer<typeof userEditSchema>;

  const form = useForm<UserEditFormData>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      email: user.email,
      phone: user.phone || "",
      title: user.title || "",
      departmentId: user.department?.id?.toString() || "none",
      teamId: user.team?.id?.toString() || "none",
      location: user.location || "",
    },
  });

  const handleSubmit = (data: UserEditFormData) => {
    const selectedDepartment = data.departmentId && data.departmentId !== "none" 
      ? departments.find(d => d.id?.toString() === data.departmentId)
      : null;
    const selectedTeam = data.teamId && data.teamId !== "none"
      ? teams.find(t => t.id?.toString() === data.teamId)
      : null;

    const updatedUser: AppEmployee = {
      ...user,
      firstname: data.firstname,
      lastname: data.lastname,
      name: `${data.firstname} ${data.lastname}`,
      email: data.email,
      phone: data.phone || "",
      title: data.title || "",
      department: selectedDepartment || null,
      team: selectedTeam ? {
        id: selectedTeam.id || 0,
        name: selectedTeam.name,
        description: selectedTeam.description || "",
        members: selectedTeam.members || 0,
        projects: 0, // Default value for projects
        avatar: "" // Default value for avatar
      } : null,
      location: data.location || "",
    };

    onSave(updatedUser);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information, department, and team assignments
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Organization Assignment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No department</SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id?.toString() || "none"}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teamId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No team</SelectItem>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id?.toString() || "none"}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
