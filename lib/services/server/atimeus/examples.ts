// Example usage of the Atimeus API Client Library
// This file demonstrates how to use the Atimeus API in your Next.js application

import { 
  atimeusServerService,
  atimeusApiClient,
  EmployeeSearchParams,
  AtimeusProjectSearchParams,
  CRARequestDto,
  CRASearchParams,
  ActivitySearchParams
} from './index';

// ========================
// SERVER-SIDE EXAMPLES (for API routes, getServerSideProps, etc.)
// ========================

export async function serverSideExamples() {
  const accessToken = 'your-access-token'; // Get from your auth system
  const customApiKey = 'SA7lDfw3j9g0ncEvEJEszJwVr'; // Optional custom API key

  try {
    // 1. Search employees with default view
    const employeeSearchParams: EmployeeSearchParams = {
      view: 'default',
      page: 0,
      size: 10,
      sortBy: 'firstName',
      sortDirection: 'asc',
      filter: 'isActive==true' // RSQL filter
    };
    
    const employeesResponse = await atimeusServerService.searchEmployees(
      accessToken, 
      employeeSearchParams,
      customApiKey
    );
    console.log('Employees:', employeesResponse);

    // 2. Get specific employee
    const employee = await atimeusServerService.getEmployeeById(
      accessToken, 
      'sample-employee-id',
      customApiKey
    );
    console.log('Employee details:', employee);

    // 3. Get employee views
    const employeeViews = await atimeusServerService.getEmployeeViews(
      accessToken,
      customApiKey
    );
    console.log('Available employee views:', employeeViews);

    // 4. Search projects with filters
    const projectSearchParams: AtimeusProjectSearchParams = {
      view: 'detailed',
      page: 0,
      size: 20,
      sortBy: 'name',
      sortDirection: 'desc',
      filter: 'status==active' // RSQL filter
    };

    const projectsResponse = await atimeusServerService.searchProjects(
      accessToken, 
      projectSearchParams,
      customApiKey
    );
    console.log('Projects:', projectsResponse);

    // 5. Get all projects
    const allProjectsResponse = await atimeusServerService.getAllProjects(
      accessToken,
      { page: 0, size: 50 },
      customApiKey
    );
    console.log('All projects:', allProjectsResponse);

    // 6. Get specific project
    const project = await atimeusServerService.getProjectById(
      accessToken, 
      'sample-project-id',
      customApiKey
    );
    console.log('Project details:', project);

    // 7. Get project indicators/metrics
    const indicators = await atimeusServerService.getProjectIndicators(
      accessToken, 
      'sample-project-id',
      customApiKey
    );
    console.log('Project indicators:', indicators);

    // 8. Get project views
    const projectViews = await atimeusServerService.getProjectViews(
      accessToken,
      customApiKey
    );
    console.log('Available project views:', projectViews);

    // 9. Create new CRA
    const newCRA: CRARequestDto = {
      title: 'New Client Requirement Analysis',
      description: 'Analysis of client requirements for new feature',
      clientId: 'client-123',
      projectId: 'project-456',
      requirements: 'Client needs a new dashboard with real-time analytics',
      status: 'pending',
      priority: 'high',
      estimatedHours: 40,
      startDate: '2025-07-15',
      endDate: '2025-08-15',
      assignedTo: 'employee-789'
    };

    const createdCRA = await atimeusServerService.createCRA(
      accessToken, 
      newCRA,
      customApiKey
    );
    console.log('Created CRA:', createdCRA);

    // 10. Search CRAs
    const craSearchParams: CRASearchParams = {
      filter: 'status==pending',
      page: 0,
      size: 10,
      sortBy: 'createdAt',
      sortDirection: 'desc'
    };

    const crasResponse = await atimeusServerService.searchCRAs(
      accessToken, 
      craSearchParams,
      customApiKey
    );
    console.log('CRAs:', crasResponse);

    // 11. Get specific CRA
    const cra = await atimeusServerService.getCRAById(
      accessToken, 
      'sample-cra-id',
      customApiKey
    );
    console.log('CRA details:', cra);

    // 12. Update CRA
    const updateData: CRARequestDto = {
      title: 'Updated CRA Title',
      status: 'in-progress',
      estimatedHours: 50
    };

    const updatedCRA = await atimeusServerService.updateCRA(
      accessToken, 
      createdCRA.id, 
      updateData,
      customApiKey
    );
    console.log('Updated CRA:', updatedCRA);

    // 13. Search activities
    const activitySearchParams: ActivitySearchParams = {
      view: 'default',
      filter: 'isActive==true',
      page: 0,
      size: 15,
      sortBy: 'startTime',
      sortDirection: 'desc'
    };

    const activitiesResponse = await atimeusServerService.searchActivities(
      accessToken, 
      activitySearchParams,
      customApiKey
    );
    console.log('Activities:', activitiesResponse);

    // 14. Get specific activity
    const activity = await atimeusServerService.getActivityById(
      accessToken, 
      'sample-activity-id',
      customApiKey
    );
    console.log('Activity details:', activity);

    // 15. Get activity views
    const activityViews = await atimeusServerService.getActivityViews(
      accessToken,
      customApiKey
    );
    console.log('Available activity views:', activityViews);

  } catch (error) {
    console.error('Server-side example error:', error);
  }
}

// ========================
// CLIENT-SIDE EXAMPLES (for React components)
// ========================

export function useAtimeusExamples() {
  // These would typically be used in React components
  const customApiKey = 'SA7lDfw3j9g0ncEvEJEszJwVr'; // Optional

  const handleSearchEmployees = async () => {
    try {
      const params: EmployeeSearchParams = {
        view: 'default',
        page: 0,
        size: 20,
        filter: 'department==IT'
      };
      
      const employees = await atimeusApiClient.searchEmployees(params, customApiKey);
      console.log('Employees found:', employees);
      return employees;
    } catch (error) {
      console.error('Failed to search employees:', error);
      throw error;
    }
  };

  const handleGetEmployee = async (employeeId: string) => {
    try {
      const employee = await atimeusApiClient.getEmployeeById(employeeId, customApiKey);
      console.log('Employee details:', employee);
      return employee;
    } catch (error) {
      console.error('Failed to get employee:', error);
      throw error;
    }
  };

  const handleSearchProjects = async () => {
    try {
      const params: AtimeusProjectSearchParams = {
        view: 'detailed',
        page: 0,
        size: 10,
        sortBy: 'startDate',
        sortDirection: 'desc'
      };
      
      const projects = await atimeusApiClient.searchProjects(params, customApiKey);
      console.log('Projects found:', projects);
      return projects;
    } catch (error) {
      console.error('Failed to search projects:', error);
      throw error;
    }
  };

  const handleCreateCRA = async (formData: CRARequestDto) => {
    try {
      const newCRA = await atimeusApiClient.createCRA(formData, customApiKey);
      console.log('CRA created:', newCRA);
      return newCRA;
    } catch (error) {
      console.error('Failed to create CRA:', error);
      throw error;
    }
  };

  const handleUpdateCRA = async (craId: string, updateData: CRARequestDto) => {
    try {
      const updatedCRA = await atimeusApiClient.updateCRA(craId, updateData, customApiKey);
      console.log('CRA updated:', updatedCRA);
      return updatedCRA;
    } catch (error) {
      console.error('Failed to update CRA:', error);
      throw error;
    }
  };

  const handleDeleteCRA = async (craId: string) => {
    try {
      await atimeusApiClient.deleteCRA(craId, customApiKey);
      console.log('CRA deleted successfully');
    } catch (error) {
      console.error('Failed to delete CRA:', error);
      throw error;
    }
  };

  const handleSearchActivities = async () => {
    try {
      const params: ActivitySearchParams = {
        view: 'default',
        page: 0,
        size: 15,
        filter: 'type==development'
      };
      
      const activities = await atimeusApiClient.searchActivities(params, customApiKey);
      console.log('Activities found:', activities);
      return activities;
    } catch (error) {
      console.error('Failed to search activities:', error);
      throw error;
    }
  };

  const handleGetProjectIndicators = async (projectId: string) => {
    try {
      const indicators = await atimeusApiClient.getProjectIndicators(projectId, customApiKey);
      console.log('Project indicators:', indicators);
      return indicators;
    } catch (error) {
      console.error('Failed to get project indicators:', error);
      throw error;
    }
  };

  return {
    handleSearchEmployees,
    handleGetEmployee,
    handleSearchProjects,
    handleCreateCRA,
    handleUpdateCRA,
    handleDeleteCRA,
    handleSearchActivities,
    handleGetProjectIndicators
  };
}

// ========================
// REACT COMPONENT EXAMPLE
// ========================

/*
// Example React component using the Atimeus API

import React, { useState, useEffect } from 'react';
import { 
  atimeusApiClient, 
  EmployeeDto, 
  AtimeusProjectDto, 
  CRADto, 
  EmployeeSearchParams,
  AtimeusProjectSearchParams 
} from '@/lib/atimeus';

export const AtimeusComponent: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [projects, setProjects] = useState<AtimeusProjectDto[]>([]);
  const [cras, setCras] = useState<CRADto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const customApiKey = 'SA7lDfw3j9g0ncEvEJEszJwVr'; // Your custom API key

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load employees
      const employeeParams: EmployeeSearchParams = {
        view: 'default',
        page: 0,
        size: 10,
        filter: 'isActive==true'
      };
      const employeesResponse = await atimeusApiClient.searchEmployees(employeeParams, customApiKey);
      setEmployees(employeesResponse.content || []);

      // Load projects
      const projectParams: AtimeusProjectSearchParams = {
        view: 'default',
        page: 0,
        size: 10,
        filter: 'status==active'
      };
      const projectsResponse = await atimeusApiClient.searchProjects(projectParams, customApiKey);
      setProjects(projectsResponse.content || []);

      // Load CRAs
      const crasResponse = await atimeusApiClient.searchCRAs({
        page: 0,
        size: 10
      }, customApiKey);
      setCras(crasResponse.content || []);

    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading Atimeus data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Atimeus Dashboard</h1>
      
      <section>
        <h2>Employees</h2>
        {employees.map(employee => (
          <div key={employee.id}>
            <h4>{employee.firstName} {employee.lastName}</h4>
            <p>Email: {employee.email}</p>
            <p>Department: {employee.department}</p>
            <p>Position: {employee.position}</p>
          </div>
        ))}
      </section>

      <section>
        <h2>Projects</h2>
        {projects.map(project => (
          <div key={project.id}>
            <h4>{project.name}</h4>
            <p>Code: {project.code}</p>
            <p>Client: {project.clientName}</p>
            <p>Status: {project.status}</p>
            <p>Budget: ${project.budget}</p>
          </div>
        ))}
      </section>

      <section>
        <h2>CRAs (Client Requirement Analysis)</h2>
        {cras.map(cra => (
          <div key={cra.id}>
            <h4>{cra.title}</h4>
            <p>Description: {cra.description}</p>
            <p>Status: {cra.status}</p>
            <p>Priority: {cra.priority}</p>
            <p>Estimated Hours: {cra.estimatedHours}</p>
          </div>
        ))}
      </section>
    </div>
  );
};
*/

// ========================
// API ROUTE EXAMPLE (Next.js)
// ========================

/*
// pages/api/atimeus/employees.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { atimeusServerService } from '@/lib/atimeus';
import { getAccessToken } from '@/lib/auth'; // Your auth utility

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const accessToken = await getAccessToken(req); // Get token from request
    const customApiKey = req.headers['x-atimeus-api-key'] as string; // Optional custom API key
    
    switch (req.method) {
      case 'GET':
        const searchParams = {
          view: req.query.view as string || 'default',
          filter: req.query.filter as string,
          page: parseInt(req.query.page as string) || 0,
          size: parseInt(req.query.size as string) || 10,
          sortBy: req.query.sortBy as string,
          sortDirection: (req.query.sortDirection as string) || 'asc'
        };
        
        const employees = await atimeusServerService.searchEmployees(
          accessToken, 
          searchParams,
          customApiKey
        );
        res.status(200).json(employees);
        break;

      default:
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
*/

// ========================
// RSQL FILTER EXAMPLES
// ========================

export const rsqlFilterExamples = {
  // Employee filters
  employees: {
    activeEmployees: 'isActive==true',
    itDepartment: 'department==IT',
    seniorDevelopers: 'position==*Developer* and isActive==true',
    recentHires: 'createdAt>=2025-01-01',
    emailDomain: 'email==*@company.com',
    combined: 'department==IT and isActive==true and position==*Senior*'
  },

  // Project filters
  projects: {
    activeProjects: 'status==active',
    highBudget: 'budget>=100000',
    currentYear: 'startDate>=2025-01-01',
    specificClient: 'clientName==*ACME*',
    endingSoon: 'endDate<=2025-12-31 and status==active',
    combined: 'status==active and budget>=50000 and startDate>=2025-01-01'
  },

  // CRA filters
  cras: {
    pendingCras: 'status==pending',
    highPriority: 'priority==high',
    estimatedRange: 'estimatedHours>=20 and estimatedHours<=80',
    assignedToMe: 'assignedTo==current-user-id',
    thisMonth: 'createdAt>=2025-07-01',
    combined: 'status==pending and priority==high and estimatedHours>=40'
  },

  // Activity filters
  activities: {
    activeActivities: 'isActive==true',
    developmentType: 'type==development',
    longActivities: 'duration>=480', // 8 hours in minutes
    todayActivities: 'startTime>=2025-07-10',
    projectSpecific: 'projectId==specific-project-id',
    combined: 'isActive==true and type==development and duration>=240'
  }
};
