import DirectoriesTabsClient from "@/components/directory/directory-tabs";
import { directoryApiClient } from "@/lib/services/client/directory/directory.client.service";
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component"
import { getDictionary } from "@/locales/dictionaries"
import { ApiResponse, AppDepartment, AppEmployee, AppTeam, HateoasResponse } from "@/lib/interfaces/apis"
import { auth } from "@/auth";
import { directoryServerService } from "@/lib/services/server/directory/directory.server.service";

export default async function DirectoryPage({ params }: BasePageProps ) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const curLocale = resolvedParams.locale;
  // Load translations from multiple namespaces
  const dictionary = await getDictionary(curLocale, ['common', 'home', 'directory']);


  const session = await auth();
  
  console.log('✓ ----> session:', session);
  console.log('✓ ----> session.user:', session?.user);
  console.log('✓ ----> session.user.token:', session?.user?.accessToken);
  

  const accessingToken = session?.user?.accessToken;
  if (!accessingToken) {
    throw new Error("User is not authenticated.");
  }
  
  const [employeesResponse, departmentsResponse, teamsResponse] = await Promise.all([
    directoryServerService.getEmployees(accessingToken,{ query: "", page: 0, size: 100 }),
    directoryServerService.getDepartements(accessingToken,{ query: "", page: 0, size: 100 }),
    directoryServerService.getTeams(accessingToken,{ query: "", page: 0, size: 100 })
  ]);

  const employees = employeesResponse?._embedded?.userEmployeeDtoList || [];
  const departments = departmentsResponse?._embedded?.organizationDepartmentDtoList || [];
  const teams = teamsResponse?._embedded?.organizationTeamDtoList || [];



  return (
     <DirectoriesTabsClient
        dictionary={dictionary}
        locale={curLocale}
        initialEmployees={employees}
        initialDepartments={departments}
        initialTeams={teams}
      />
  )
}
