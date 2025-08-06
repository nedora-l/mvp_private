"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Clock, Users, MapPin, Plus, ChevronLeft, ChevronRight, Video, UserPlus } from "lucide-react"
import { AppComponentDictionaryProps } from "@/lib/interfaces/common/dictionary-props-component"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Briefcase,
  MessageSquare,
} from "lucide-react"
import { mockData_projectsData, mockData_teamsData } from "@/lib/interfaces/app/teams/teams_data_types"
import { mockData_activityData } from "@/lib/interfaces/app/activities/activity"
import { ApiResponse, AppTeam, HateoasResponse } from "@/lib/interfaces/apis"
import { directoryApiClient } from "@/lib/services/client/directory/directory.client.service"

export default function TeamsAndProjectsTabsClient({ dictionary, locale }: AppComponentDictionaryProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [teamsList, setTeamsList] = useState<AppTeam[]>([]);
  
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
  }

  
  useEffect(() => {
    if(teamsList.length == 0){
      fetchTeams();
    }
  }, [teamsList]);
  
    
  const teamsData = mockData_teamsData;
  const projectsData = mockData_projectsData;
  const activityData = mockData_activityData ;
  type SupportedLocale = keyof typeof teamsData;
  const localeKey = (locale in teamsData ? locale : 'fr') as SupportedLocale;
  const teams = teamsData[localeKey];
  const projects = projectsData[localeKey];
  const activities = activityData[localeKey];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder={dictionary.teams.list.search || "Search teams or projects..."} 
            className="pl-8" 
          />
        </div>
      </div>

      <Tabs defaultValue="myTeams" className="space-y-4">
        <TabsList>
          <TabsTrigger value="myTeams" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            {dictionary.teams.myTeams || "My Teams"}
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center">
            <Briefcase className="mr-2 h-4 w-4" />
            {dictionary.teams.activeProjects || "Active Projects"}
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            {dictionary.teams.activity?.title || "Recent Activity"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="myTeams">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamsList.map((team) => (
              <Card key={team.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                      {team.name 
                        ? team.name.split(' ')
                          .filter(word => word.length > 0)
                          .slice(0, 2)
                          .map(word => word.charAt(0).toUpperCase())
                          .join('') || team.name.charAt(0).toUpperCase()
                        : 'T'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{team.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{team.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>
                        {team.members} {team.members === 1 
                          ? dictionary.teams.memberSingular 
                          : dictionary.teams.memberPlural}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1" />
                      <span>
                        {team.projects} {team.projects === 1 
                          ? dictionary.teams.projectSingular 
                          : dictionary.teams.projectPlural}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="default" className="flex-1" asChild>
                      <a href={`/teams/${team.id}`}>{dictionary.teams.viewTeam || "View Team"}</a>
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {dictionary.teams.chat || "Chat"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="projects">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{project.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{project.team}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.priority === "High"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : project.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }`}
                    >
                      {project.priority === "High" 
                        ? dictionary.teams.priority?.high || "High"
                        : project.priority === "Medium"
                          ? dictionary.teams.priority?.medium || "Medium" 
                          : dictionary.teams.priority?.low || "Low"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{dictionary.teams.progress || "Progress"}</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${project.progress}%` }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        <span>{dictionary.teams.due || "Due"}: {project.dueDate}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{project.status}</span>
                      </div>
                    </div>
                    <Button variant="default" className="w-full" asChild>
                      <a href={`/teams/projects/${project.id}`}>{dictionary.teams.viewProject || "View Project"}</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>{dictionary.teams.recentActivity || "Recent Team Activity"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                      <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p>
                        <span className="font-medium">{activity.user.name}</span>{" "}
                        <span className="text-muted-foreground">{activity.action}</span>{" "}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Briefcase className="h-3.5 w-3.5 mr-1" />
                        <span>
                          {activity.project} • {activity.team}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>{activity.time}</span>
                      </p>
                    </div>
                    <div className={`p-2 rounded-full bg-muted ${activity.iconColor}`}>
                      <activity.icon className="h-4 w-4" />
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-6">
                {dictionary.teams.viewAllActivity || "View All Activity"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
