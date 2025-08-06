"use client";

import { useState, useEffect } from "react";
import { useI18n } from '@/lib/i18n/use-i18n';
import { AppComponentDictionaryProps } from "@/lib/interfaces/common/dictionary-props-component";
import { OrganizationDto, OrganizationValueDto, OrganizationLeaderDto } from "@/lib/interfaces/apis";
import { ApiResponse, HateoasResponse } from '@/lib/interfaces/apis/common';
import { orgApiClient } from "@/lib/services/client/org/organization.client.service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Building2, Users2, Target, FileText, RefreshCcw, Edit, AlertCircle, PlusIcon } from "lucide-react";
import Image from "next/image";
import { EditOrganizationModal } from "./modals/edit-organization-modal";
import { ValueModal } from "./modals/value-modal";
import { LeaderModal } from "./modals/leader-modal";
import Link from "next/link"
import { executeOqlQueryClientApi } from "@/lib/services/client/data";
import { useSession } from "next-auth/react";

export interface CompanyPolitics {
  id?: string;
  title: string;
  description: string;
  file: string;
}

export default function CompanyTabsClient({ dictionary, locale }: AppComponentDictionaryProps) {
  
  const { data: session, status } = useSession();
  const currentUser = session?.user || null ;
  const isAdmin: boolean = (currentUser && (currentUser?.roles?.includes("ROLE_ADMIN") || currentUser?.roles?.includes("ADMIN"))) === true;
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [organization, setOrganization] = useState<OrganizationDto | null>(null);
  const [organizationValues, setOrganizationValues] = useState<OrganizationValueDto[]>([]);
  const [organizationLeaders, setOrganizationLeaders] = useState<OrganizationLeaderDto[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { t } = useI18n(dictionary);
  const [initialized, setInitialized] = useState(false);

  // custom objects :
  const [companyPolicies, setCompanyPolicies] = useState<CompanyPolitics[]>([]);

  // Modal states
  const [isEditOrgModalOpen, setIsEditOrgModalOpen] = useState(false);
  const [isValueModalOpen, setIsValueModalOpen] = useState(false);
  const [isLeaderModalOpen, setIsLeaderModalOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<OrganizationValueDto | null>(null);
  const [selectedLeader, setSelectedLeader] = useState<OrganizationLeaderDto | null>(null);

  const refreshCompanyPolicies = async () => {
    try {
      const responseOQL = await executeOqlQueryClientApi('SELECT title, file, description FROM Organization_Politics__c');
      console.log("responseOQL.data");
      console.log(responseOQL,responseOQL.data);
      const oqlData  = responseOQL.data;
      if (!oqlData || Object.keys(oqlData).length === 0) {
        console.warn("No data found in OQL response");
        return;
      }
      else {
        console.log("OQL data fetched successfully");
        console.log(oqlData);
        const dbRecords: CompanyPolitics[] = []; 
        for(const key in oqlData) {
          console.log('key',key);
          if (oqlData.hasOwnProperty(key)) {
            const record = oqlData[key];
            console.log('record',record);
            dbRecords.push({
              file: record.data?.file || "",
              title: record.data?.title || "",
              description: record.data?.description || "",
            });
          }
        }
        setCompanyPolicies(dbRecords);
      }
    
    } catch (error) {
        console.error("Error fetching topics:", error);
    }
  };


  const refreshAll = async () => {
    fetchOrg();
    fetchOrgValues();
    fetchOrgLeaders();
    refreshCompanyPolicies();
  };

  const fetchOrg = async () => {
    if (!initialized) setIsLoading(true); // Only set loading on initial fetch
    setError(null);
    console.log("Fetching organization from API...");    
    orgApiClient.getOrg().then((results: ApiResponse<OrganizationDto>) => {
        if(results.status === 200 && results.data) {
          setOrganization(results.data || null);
        }
        else if(results.error) {
          setError(results.error?.message || "Failed to fetch organization data");
        }
      }).catch((err: any) => {
        setError(err.message || "Failed to fetch organization data");
      }).finally(() => {
        setIsLoading(false);
      });
  };

  const fetchOrgValues = async () => {
   if (!initialized) setIsLoading(true); // Only set loading on initial fetch
    setError(null);
    console.log("Fetching organization values from API...");    orgApiClient.getOrgValues({
      query: searchTerm,
      page: 0,
      size: 100
    }).then((results: ApiResponse<HateoasResponse<OrganizationValueDto>>) => {
        if(results.status === 200 && results.data) {
          setOrganizationValues(results.data?._embedded?.organizationValueDtoList || []);
        }
        else if(results.error) {
          setError(results.error?.message || "Failed to fetch organization data");
        }
      }).catch((err: any) => {
        setError(err.message || "Failed to fetch organization data");
      }).finally(() => {
        setIsLoading(false);
      });
  };  
  
  const fetchOrgLeaders = async () => {
    if (!initialized) setIsLoading(true); // Only set loading on initial fetch
    setError(null);
    console.log("Fetching organization leaders from API...");
    if(organization != null && organization.id !== undefined && organization.id !== null) {

    orgApiClient.getOrganizationLeaders(
      organization.id.toString(),
      {
      query: searchTerm,
      page: 0,
      size: 100
    }).then((results: HateoasResponse<OrganizationLeaderDto[]>) => {
        // Try the same pattern as values: check for organizationLeaderDtoList
        setOrganizationLeaders((results as any)?._embedded?.organizationLeaderDtoList || []);
      }).catch((err: any) => {
        setError(err.message || "Failed to fetch organization leaders");
      }).finally(() => {
        setIsLoading(false);
      });
    }
  };
 

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      fetchOrg();
      fetchOrgValues();
      fetchOrgLeaders();
    }
  }, [initialized]);

  
  if(isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
          <p className="text-lg text-muted-foreground">{t('common.loading') || "Loading..."}</p>
        </div>
      </div>
    );
  }

  
  return (
    <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">
            {organization?.name || t("company.title") || "Company"}
          </h1>
          <div className="flex space-x-2">
            <Button variant="ghost" className="flex items-center gap-2" aria-label="Refresh" onClick={refreshAll}>
              <RefreshCcw className="h-4 w-4" />
              {t("company.actions.refresh")}
            </Button>           
            {isAdmin && (
            <Button className="flex items-center gap-2" onClick={() => setIsEditOrgModalOpen(true)}>
              <Edit className="h-4 w-4" />
              {t("company.actions.edit")}
            </Button>)}
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('common.error') || "Error"}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Tabs defaultValue="about" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="about" className="flex items-center">
              <Building2 className="mr-2 h-4 w-4" />
              {t("company.tabs.about")}
            </TabsTrigger>
            <TabsTrigger value="leadership" className="flex items-center">
              <Users2 className="mr-2 h-4 w-4" />
              {t("company.tabs.leadership")}
            </TabsTrigger>
            <TabsTrigger value="mission" className="flex items-center">
              <Target className="mr-2 h-4 w-4" />
              {t("company.tabs.mission")}
            </TabsTrigger>
            <TabsTrigger value="policies" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              {t("company.tabs.policies")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>{t("company.about.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                  <Image
                    src={organization?.thumbnailUrl || "/placeholder.svg?height=400&width=800"}
                    width={800}
                    height={400}
                    alt="Picture of the author"
                    className="w-full h-full object-cover"
                  />
                </div>                
                <h3 className="text-xl font-semibold">{t("company.about.overview")}</h3>
                <p>
                  {organization?.description || t("company.about.description")}
                </p>

                <h3 className="text-xl font-semibold mt-6">{t("company.about.locations")}</h3>
                <p>
                  {organization?.location ||t("company.about.globalPresence")}
                </p>

               
              </CardContent>
            </Card>
          </TabsContent>          
          <TabsContent value="leadership">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t("company.leadership.title")}</CardTitle>
                {isAdmin && (
                <Button 
                  className="flex items-center gap-2" 
                  onClick={() => {
                    setSelectedLeader(null);
                    setIsLeaderModalOpen(true);
                  }}
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Leader
                </Button>)}
              </CardHeader>
              <CardContent>
                {organizationLeaders.length > 0 ? (                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {organizationLeaders
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map((leader) => (
                        <div 
                          key={leader.id} 
                          className="flex flex-col items-center text-center border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => {
                            setSelectedLeader(leader);
                            setIsLeaderModalOpen(true);
                          }}
                        >                          <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-gray-200">
                            {leader.employeeAvatar ? (
                              <Image
                                src={leader.employeeAvatar}
                                alt={leader.employeeName || leader.employeeId}
                                width={128}
                                height={128}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl font-semibold">
                                {leader.employeeName ? leader.employeeName.split(' ').map(n => n.charAt(0)).join('').slice(0, 2) : leader.employeeId.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <h3 className="font-semibold text-lg">
                            {leader.employeeName || leader.employeeId}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">{leader.position}</p>
                          {leader.department && (
                            <p className="text-xs text-muted-foreground mb-2">{leader.department}</p>
                          )}
                          {leader.bio && (
                            <p className="text-sm line-clamp-3">{leader.bio}</p>
                          )}
                          {isAdmin && (
                          <div className="mt-2 flex justify-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLeader(leader);
                                setIsLeaderModalOpen(true);
                              }}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          </div>)}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users2 className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No leaders added</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by adding your first organization leader.</p>
                    {isAdmin && (
                    <div className="mt-6">
                      <Button 
                        onClick={() => {
                          setSelectedLeader(null);
                          setIsLeaderModalOpen(true);
                        }}
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Leader
                      </Button>
                    </div>)}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
            <TabsContent value="mission">
            <Card>
              <CardHeader>
                <CardTitle>{t("company.mission.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">{t("company.mission.missionStatement")}</h3>
                  <p className="text-lg">
                    {organization?.description || t("company.mission.description")}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">{t("company.mission.visionStatement")}</h3>
                  <p className="text-lg">
                    {t("company.mission.culture")}
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">{t("company.mission.coreValues")}</h3>
                    {isAdmin && ( <Button 
                      className="flex items-center gap-2" 
                      onClick={() => {
                        setSelectedValue(null);
                        setIsValueModalOpen(true);
                      }}
                    >
                      <PlusIcon className="h-4 w-4" />
                      Add Value
                    </Button>)}
                   
                  </div>
                  
                  {organizationValues.length > 0 ? (                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {organizationValues
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((value) => (
                          <div 
                            key={value.id} 
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => {
                              setSelectedValue(value);
                              setIsValueModalOpen(true);
                            }}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-lg">{value.title}</h4>
                              {isAdmin && (<Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedValue(value);
                                  setIsValueModalOpen(true);
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>)}
                              
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{value.category}</p>
                            <p>{value.description}</p>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No values added</h3>
                      <p className="mt-1 text-sm text-gray-500">Get started by adding your first organization value.</p>
                      {isAdmin && (<div className="mt-6">
                        <Button 
                          onClick={() => {
                            setSelectedValue(null);
                            setIsValueModalOpen(true);
                          }}
                        >
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Add Value
                        </Button>
                      </div>)}
                      
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="policies">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t("company.policies.title")}</CardTitle>
                <Button 
                  className="flex items-center gap-2" 
                  onClick={() => {
                    refreshCompanyPolicies();
                  }}
                >
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardHeader>
                <CardTitle>{t("company.policies.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  { companyPolicies.map((policy) => (
                      <div key={policy.title} className="flex items-center justify-between border-b pb-4 last:border-0">
                        <div>
                          <h3 className="font-semibold">{policy.title}</h3>
                          <p className="text-sm text-muted-foreground">{policy.description}</p>
                        </div> 
                        <Link href={`/api/v1/files/${policy?.file}/download`} download   target="_blank" className="text-blue-600 hover:underline">
                          {t("company.policies.downloadPdf")}
                        </Link>
                      </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>        
        </Tabs>

        {/* Modals */}
        <EditOrganizationModal
          isOpen={isEditOrgModalOpen}
          onClose={() => setIsEditOrgModalOpen(false)}
          organization={organization}
          onSuccess={refreshAll}
        />

        <ValueModal
          isOpen={isValueModalOpen}
          onClose={() => {
            setIsValueModalOpen(false);
            setSelectedValue(null);
          }}
          value={selectedValue}
          onSuccess={refreshAll}
          existingValues={organizationValues}
        />

        <LeaderModal
          isOpen={isLeaderModalOpen}
          onClose={() => {
            setIsLeaderModalOpen(false);
            setSelectedLeader(null);
          }}
          leader={selectedLeader}
          onSuccess={refreshAll}
          existingLeaders={organizationLeaders}
        />
    </div>
  )
}

