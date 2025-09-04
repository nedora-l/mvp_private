"use client"
import {  useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Filter, AlertCircle, Users2, UserPlus, Clock, Zap, RefreshCcw, BarChart, GraduationCap, ArrowUp, ArrowDown, Star, Eye, Edit, MoreHorizontal } from "lucide-react"
import { AppComponentDictionaryProps } from "@/lib/interfaces/common/dictionary-props-component"
import {
  Search
} from "lucide-react"


import { directoryApiClient } from "@/lib/services/client/directory/directory.client.service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import DirectoryEmployeeCard from "./employee-card"
import { teamStats } from "@/lib/mock-data/common"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ApiResponse, AppDepartment, AppEmployee, AppTeam, HateoasResponse } from "@/lib/interfaces/apis"
import { RegisterModal } from "@/components/auth/register-modal"
import { ImportUsersModal } from "./import-users-modal"

interface DirectoriesTabsClientProps extends AppComponentDictionaryProps {
  initialEmployees: AppEmployee[];
  initialDepartments: AppDepartment[];
  initialTeams: AppTeam[];
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case "En mission":
      return "bg-green-100 text-green-800"
    case "Disponible":
      return "bg-blue-100 text-blue-800"
    case "En formation":
      return "bg-yellow-100 text-yellow-800"
    case "En congé":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
      return <ArrowUp className="h-3 w-3 text-green-500" />
    case "down":
      return <ArrowDown className="h-3 w-3 text-red-500" />
    default:
      return <div className="h-3 w-3 bg-gray-400 rounded-full" />
  }
}


export default function DirectoriesTabsClient({ 
  dictionary, 
  locale, 
  initialEmployees,
  initialDepartments,
  initialTeams 
}: DirectoriesTabsClientProps) {


  // State management

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [employeesList, setEmployeesList] = useState<AppEmployee[]>(initialEmployees);
  const [departmentsList, setDepartmentsList] = useState<AppDepartment[]>(initialDepartments);
  const [teamsList, setTeamsList] = useState<AppTeam[]>(initialTeams);

  const [filesViewMode, setFilesViewMode] = useState<'grid' | 'table'>('table');
  
  const [activeDepartment, setActiveDepartment] = useState("ceo")
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState("all")
  const [selectedTeamFilter, setSelectedTeamFilter] = useState("all")
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all")

  
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
    }).then((results: ApiResponse<HateoasResponse<AppTeam>>) => {
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

  // Filter employees based on search term
  const filterEmployees = (employees: AppEmployee[], term: string): AppEmployee[] => {
    if (!term) return employees;
    return employees.filter(employee =>
      (employee.name || "").toLowerCase().includes(term.toLowerCase()) ||
      (employee.title || "").toLowerCase().includes(term.toLowerCase()) ||
      (employee.department?.name || "").toLowerCase().includes(term.toLowerCase())
    );
  };
  
  // Get filtered employees list
  const filteredEmployees = searchTerm 
    ? filterEmployees(employeesList, searchTerm)
    : employeesList;
  
  // Define dictionary locations for use in the location buttons
  const locationDictionary = {
    "all": dictionary.directory.labels.allLocations,
  };

  const locations = [
    "all",
    "Casa : Sidi Maarouf",
    "Casa : Maarif",
    "Casa : Test2",
    "Merrakesh",
    "Place A",
    "Place B",
    "Place C",
    "Place D"
  ];
 
  const refreshAll = () => {
    setError(null);
    fetchEmployees();
    fetchDepartments();
    fetchTeams();
  }


  const countUsersPerDeparment = (departmentId: number | undefined): number => {
    return employeesList.filter(emp => emp.department?.id === departmentId).length;
  }

  const countUsersPerTeam = (teamId: number | undefined): number => {
    return employeesList.filter(emp => emp.team?.id === teamId).length;
  }

  // Extract unique locations from employee data
  const uniqueLocations = employeesList.length > 0
    ? [...new Set(employeesList.map(emp => emp.location).filter(Boolean))]
    : locations;
  
  // Skeleton for stats cards
  function StatsCardSkeleton() {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Skeleton for filter/search bar
  function FilterBarSkeleton() {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <Skeleton className="h-10 w-full lg:w-1/2 rounded-lg" />
            <div className="flex gap-2 w-full lg:w-auto">
              <Skeleton className="h-10 w-36 rounded-lg" />
              <Skeleton className="h-10 w-36 rounded-lg" />
              <Skeleton className="h-10 w-36 rounded-lg" />
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Skeleton for employee cards grid
  function EmployeeGridSkeleton({ count = 6 }) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Additional skeletons to fill the grid */}
        {count < 6 && (
          <>
            {Array.from({ length: 6 - count }).map((_, i) => (
              <div key={i} className="hidden lg:block" />
            ))}
          </>
        )}
      </div>
    );
  }

  if (isLoading) {
    // Enhanced loading: show skeletons for stats, filters, and employee cards
    return (
      <div className="space-y-6 p-6">
        {/* Header skeleton */}
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
        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => <StatsCardSkeleton key={i} />)}
        </div>
        {/* Filter/search bar skeleton */}
        <FilterBarSkeleton />
        {/* Employee cards grid skeleton */}
        <EmployeeGridSkeleton count={6} />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold tracking-tight">{dictionary.directory.title}</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{dictionary.common?.error || "Error"}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchEmployees}>
          {dictionary.common?.retry || "Retry"}
        </Button>
      </div>
    );
  }
  

  
  const addNewUser = () => {
    // Logic to add a new user
    console.log("Add new user clicked");
    // This could open a modal or redirect to a form page
  }


  return (
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users2 className="h-8 w-8 text-blue-600" />
              Gestion des Collaborateurs
            </h1>
            <p className="text-gray-600 mt-1">Gérez et suivez vos équipes, compétences et performances</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={refreshAll} className="flex items-center gap-2">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
            <ImportUsersModal />
            <RegisterModal onRegistrationSuccess={refreshAll} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4 ">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Collaborateurs</p>
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
                  <p className="text-sm font-medium text-green-600">En Mission</p>
                  <p className="text-2xl font-bold text-green-900">{employeesList.length}</p>
                </div>
                <Zap className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Disponibles</p>
                  <p className="text-2xl font-bold text-orange-900">{0}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
 
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 mt-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder={dictionary.directory.search.placeholder}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select aria-label="Filter by Department"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedDepartmentFilter}
              onChange={(e) => setSelectedDepartmentFilter(e.target.value)}
            >
              <option value="all">Tous les départements</option>
              {departmentsList.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
            
            <select aria-label="Filter by Status"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="En mission">En mission</option>
              <option value="Disponible">Disponible</option>
              <option value="En formation">En formation</option>
              <option value="En congé">En congé</option>
            </select>
            
            <Button
              variant={filesViewMode === 'grid' ? 'default' : 'ghost'}
              className="flex items-center gap-2"
              onClick={() => setFilesViewMode('grid')}
              aria-label="Grid View"
            >
              <div className="grid grid-cols-2 gap-0.5 w-3 h-3">
                <div className="bg-current w-1 h-1 rounded-[1px]"></div>
                <div className="bg-current w-1 h-1 rounded-[1px]"></div>
                <div className="bg-current w-1 h-1 rounded-[1px]"></div>
                <div className="bg-current w-1 h-1 rounded-[1px]"></div>
              </div>
            </Button>
            <Button
              variant={filesViewMode === 'table' ? 'default' : 'ghost'}
              className="flex items-center gap-2"
              onClick={() => setFilesViewMode('table')}
              aria-label="Table View"
            >
              <div className="flex flex-col gap-0.5 w-3 h-3">
                <div className="bg-current w-full h-0.5 rounded-[1px]"></div>
                <div className="bg-current w-full h-0.5 rounded-[1px]"></div>
                <div className="bg-current w-full h-0.5 rounded-[1px]"></div>
              </div>
            </Button>

            {/**
             * 

            <select aria-label="Filter by Team"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedTeamFilter}
              onChange={(e) => setSelectedTeamFilter(e.target.value)}
            >
              <option value="all">Tous les équipes</option>
              {teamsList.map((team) => (
                <option key={team.id} value={team.name}>
                  {team.name}
                </option>
              ))}
            </select>
            <Button variant="outline" >
              <Filter className="h-4 w-4" />
              {dictionary.directory.filters}
            </Button>
             */}

          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>

          </div>
          <div className="text-sm text-muted-foreground">
            {dictionary.directory.showing.replace('{{count}}', (employeesList?.length || 0 ).toString())}
          </div>
        </div>

        {/* directory views */}
        { filesViewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employeesList && employeesList.map((employee) => (
              <DirectoryEmployeeCard key={employee.id} employee={employee} dictionary={dictionary} />
            ))}
          </div>
        )}
        
        { filesViewMode === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-900">Collaborateur</th>
                  <th className="text-left p-4 font-medium text-gray-900">Rôle & Département</th>
                  <th className="text-left p-4 font-medium text-gray-900">Statut</th>
                  <th className="text-left p-4 font-medium text-gray-900">Projet Actuel</th>
                  <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>{filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name || ""} />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {employee.name ? employee.name.charAt(0).toUpperCase() : "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{employee.name}</p>
                          <p className="text-sm text-gray-500">{employee.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900">{employee.title}</p>
                        <p className="text-sm text-gray-500">department</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor("")}>status</Badge>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-900">{ "Aucun projet"}</p>
                    </td>
                    
                    
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Department Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Répartition par Département
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentsList.map((dept) => (
                  <div key={dept.id} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(countUsersPerDeparment(dept.id) / teamStats.totalEmployees) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{countUsersPerDeparment(dept.id)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Répartition par Equipe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamsList.map((team) => (
                  <div key={team.id} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{team.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(countUsersPerTeam(team.id) / teamStats.totalEmployees) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{countUsersPerTeam(team.id)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
      </div>
    )
}

