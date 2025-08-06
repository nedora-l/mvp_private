import { getDictionary } from "@/locales/dictionaries"
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component"
import { UsersPermissionsComponent } from "@/components/admin/users-permissions.component";
import { ApiResponse, AppDepartment, AppEmployee, AppTeam, HateoasResponse } from "@/lib/interfaces/apis"
import { auth } from "@/auth";
import { directoryServerService } from "@/lib/services/server/directory/directory.server.service";

export default async function UsersPermissionsPage({ params }: BasePageProps) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  
  // Load translations for admin
  const dictionary = await getDictionary(locale, ['common', 'admin', 'directory']);

  const session = await auth();
  
  console.log('✓ ----> Admin Users session:', session);
  console.log('✓ ----> Admin Users session.user:', session?.user);
  console.log('✓ ----> Admin Users session.user.token:', session?.user?.accessToken);
  

  const accessingToken = session?.user?.accessToken;
  if (!accessingToken) {
    throw new Error("User is not authenticated.");
  }
  
  // Fetch initial data with error handling
  let employees: AppEmployee[] = [];
  let departments: AppDepartment[] = [];
  let teams: AppTeam[] = [];

  try {
    const [employeesResponse, departmentsResponse, teamsResponse] = await Promise.all([
      directoryServerService.getEmployees(accessingToken,{ query: "", page: 0, size: 100 }),
      directoryServerService.getDepartements(accessingToken,{ query: "", page: 0, size: 100 }),
      directoryServerService.getTeams(accessingToken,{ query: "", page: 0, size: 100 })
    ]);

    employees = employeesResponse?._embedded?.userEmployeeDtoList || [];
    departments = departmentsResponse?._embedded?.organizationDepartmentDtoList || [];
    teams = teamsResponse?._embedded?.organizationTeamDtoList || [];
  } catch (error) {
    console.error('Failed to fetch initial data for admin users page:', error);
    // Component will handle empty data and provide refresh functionality
  }

  return (
    <UsersPermissionsComponent 
      dictionary={dictionary} 
      locale={locale}
      initialEmployees={employees}
      initialDepartments={departments}
      initialTeams={teams}
    />
  )
}
