export interface DictionaryProjects {
    // Page level
    title: string;
    overview: string;
    
    // Authentication and loading
    auth: {
        signInRequired: string;
        signInMessage: string;
    };
    
    loading: {
        projects: string;
        members: string;
        employees: string;
        projectRoles: string;
    };
    
    // Search and navigation
    search: {
        placeholder: string;
    };
    
    // Views
    views: {
        gridView: string;
        listView: string;
        projectsList: string;
    };
    
    // Actions and buttons
    actions: {
        newProject: string;
        refresh: string;
        retry: string;
        edit: string;
        details: string;
        save: string;
        cancel: string;
        create: string;
        update: string;
        delete: string;
        addMember: string;
        removeMember: string;
        connectToOrg: string;
        editProject: string;
        deleteProject: string;
        creating: string;
        updating: string;
        adding: string;
    };
    
    // Form fields and labels
    form: {
        title: string;
        titleRequired: string;
        description: string;
        startDate: string;
        endDate: string;
        budget: string;
        active: string;
        archived: string;
        selectEmployee: string;
        selectProjectRole: string;
        placeholders: {
            title: string;
            description: string;
            employee: string;
            projectRole: string;
            searchEmployees: string;
            searchProjectRoles: string;
        };
        emptyText: {
            noEmployee: string;
            noProjectRole: string;
        };
    };
    
    // Dialog titles
    dialogs: {
        createProject: string;
        editProject: string;
        projectDetails: string;
        addMember: string;
        connectToOrg: string;
    };
    
    // Status labels
    status: {
        active: string;
        inactive: string;
        archived: string;
    };
    
    // Date and info labels
    labels: {
        start: string;
        end: string;
        created: string;
        starts: string;
        ends: string;
        budget: string;
        added: string;
        description: string;
        startDate: string;
        endDate: string;
        budget_label: string;
        created_label: string;
    };
    
    // Empty states
    empty: {
        noProjects: string;
        noProjectsSubtitle: string;
        noMembers: string;
        noMembersSubtitle: string;
        noEmployees: string;
        noProjectRoles: string;
    };
    
    // Success messages
    success: {
        projectCreated: string;
        projectUpdated: string;
        projectDeleted: string;
        memberAdded: string;
        memberRemoved: string;
        urlCopied: string;
        redirectingToOrg: string;
    };
    
    // Error messages
    errors: {
        titleRequired: string;
        selectEmployeeAndRole: string;
        loadProjects: string;
        createProject: string;
        updateProject: string;
        deleteProject: string;
        addMember: string;
        removeMember: string;
        loadEmployees: string;
        loadProjectRoles: string;
        loadMembers: string;
    };
    
    // Confirmation messages
    confirmations: {
        deleteProject: string;
        deleteProjectSuffix: string;
        removeMember: string;
        removeMemberSuffix: string;
        actionCannotBeUndone: string;
    };
    
    // Access control
    accessControl: {
        restrictedTitle: string;
        restrictedMessage: string;
        projectActions: string;
        projectManagement: string;
    };
    
    // SSO Connection
    sso: {
        title: string;
        generating: string;
        generatingMessage: string;
        ready: string;
        readyMessage: string;
        url: string;
        redirecting: string;
        redirectingMessage: string;
        complete: string;
        connect: string;
    };
    
    // Members section
    members: {
        title: string;
        addMember: string;
        memberIdLabel: string;
    };
}