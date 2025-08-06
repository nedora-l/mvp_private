import { DictionaryDocuments } from "./dictionaries/dictionary.documents";
import { DictionaryHelpCenter } from "./dictionaries/dictionary.helpcenter";
import { DictionaryProjects } from "./dictionaries/dictionary.projects";

export interface Dictionary {
  app: {
    title: string;
    description: string;
  };
  nav: {
    home: string;
    chat: string;
    candidates: string;
    employees: string;
    tasks: string;
    teams: string;
    projects: string;
    documents: string;
    calendar: string;
    directory: string;
    hr: string;
    it: string;
    support: string;
    company: string;
    settings: string;
    profile: string;
    help: string;
    learning: string;
    recognition: string;
    passwordManager: string;
    logout: string;
    // New marketing nav items
    marketing: string;
    campaigns: string;
    leads: string;
    segments: string;
    analytics: string;
    // New compta nav items
    compta: string;
    dashboard: string;
    payable: string;
    receivable: string;
    banking: string;
    expenses: string;
    reports: string;
    budgeting: string;
    // New projects nav items
    overview: string;
    boards: string;
    timeline: string;
    files: string;
    // New security nav items
    security: string;
    accessControl: string;
    accessControlBiometric: string;
    accessControlCamera: string;
    threatDetection: string;
    vulnerabilityManagement: string;
    auditLogs: string;
    dataLossPrevention: string;
    compliance: string;
    securityPolicies: string;
    chartOfAccounts: string;
    accountsPayable: string;
    accountsReceivable: string;
    expenseManagement: string;
    financialReports: string;
    leadManagement: string;
    customerSegments: string;
    emailMarketing: string;
    socialMedia: string;
    contentHub: string;
    invoices: string;
    payments: string;
    transactions: string;
    
    helpcenter: {
      title: string;
      description: string;
      help: string;
      gettingStarted: string;
      companyPolicies: string;
      itAndSecurity: string;
      departments: string;
      toolsAndSoftware: string;
      professionalDevelopment: string;
    };
  };
  auth: {
    logout: string;
    login: string;
    signup: string;
    forgotPassword: string;
  };
  actions: {
    share?: string;
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    add: string;
    search: string;
    view: string;
    upload: string;
    download: string;
    create: string;
    update: string;
    remove: string;
    filter: string;
    sort: string;
    close: string;
    open: string;
    refresh: string;
    confirm: string;
    send?: string;
    topup?: string;
  };
  common: {
    loading: string;
    error: string;
    success: string;
    emptyState: string;
    noResults: string;
    showMore: string;
    showLess: string;
    seeAll: string;
    more?: string;
    rights?: string;
    retry?: string;
    cancel?: string;
  };
  errors: {
    notFound: string;
    serverError: string;
    unauthorized: string;
    forbidden: string;
    offline: string;
    validation: string;
  };
  messages: {
    welcome: string;
    farewell: string;
    saveSuccess: string;
    saveError: string;
    deleteConfirm: string;
    deleteSuccess: string;
    deleteError: string;
  };
  dates: {
    today: string;
    yesterday: string;
    tomorrow: string;
    formatFull: string;
    formatShort: string;
    months: {
      january: string;
      february: string;
      march: string;
      april: string;
      may: string;
      june: string;
      july: string;
      august: string;
      september: string;
      october: string;
      november: string;
      december: string;
    };
    weekdays: {
      monday: string;
      tuesday: string;
      wednesday: string;
      thursday: string;
      friday: string;
      saturday: string;
      sunday: string;
    };
  };
  plurals: {
    items: {
      singular: string;
      plural: string;
    };
    members: {
      singular: string;
      plural: string;
    };
    tasks: {
      singular: string;
      plural: string;
    };
    projects: {
      singular: string;
      plural: string;
    };
    documents: {
      singular: string;
      plural: string;
    };
    events: {
      singular: string;
      plural: string;
    };
  };
  // Home page namespace
  home: {
    title: string;
    hello: string;
    subtitle: string;
    description: string;
    loading: string;
    welcome: string;
    quickLinks: {
      title: string;
      viewAll: string;
      add?: string;
    };
    companyAnnouncements: {
      title: string;
      viewAll: string;
      noAnnouncements: string;
    };
    upcomingEvents: {
      title: string;
      viewAll: string;
      noEvents: string;
      today: string;
      tomorrow: string;
      viewCalendar?: string;
    };
    recentDocuments: {
      title: string;
      viewAll: string;
      noDocuments: string;
    };
    teamActivity: {
      title: string;
      viewAll: string;
      noActivity: string;
    };
    birthdaysAndAnniversaries: {
      title: string;
      viewAll: string;
      noBirthdays: string;
      noAnniversaries: string;
      birthdayToday: string;
      anniversary: string;
      anniversaryPlural: string;
    };
    stats: {
      tasksCompleted: string;
      documentsUploaded: string;
      teamMembers: string;
      upcomingDeadlines: string;
    };
  };
  // Teams namespace
  teams: {
    title: string;
    createNew: string;
    memberSingular: string;
    memberPlural: string;
    projectSingular: string;
    projectPlural: string;
    myTeams?: string;
    activeProjects?: string;
    newProject?: string; 
    viewTeam?: string;
    viewProject?: string;
    chat?: string;
    recentActivity?: string;
    viewAllActivity?: string;
    progress?: string;
    due?: string;
    priority?: {
      high?: string;
      medium?: string;
      low?: string;
    };
    details: {
      title: string;
      description: string;
      members: string;
      projects: string;
      activity: string;
    };
    status: {
      active: string;
      archived: string;
      pending: string;
      inProgress?: string;
    };
    list: {
      title: string;
      noTeams: string;
      search: string;
      filterBy: string;
    };
    actions: {
      join: string;
      leave: string;
      edit: string;
      delete: string;
      addMember: string;
      removeMember: string;
      createProject: string;
    };
    roles: {
      admin: string;
      member: string;
      guest: string;
    };
    confirmations: {
      deleteTitle: string;
      deleteDescription: string;
      leaveTitle: string;
      leaveDescription: string;
    };
    activity?: {
      title: string;
    };
  };
  // Additional namespaces as needed
  calendar: {
    title: string;
    target?: string;
    day?: string;
    week?: string;
    month?: string;
    agenda?: string;
    weekView?: string;
    weekViewDevelopment?: string;
    upcomingEvents?: string;
    noEventsDay?: string;
    addEvent?: string;
    join?: string;
    invite?: string;
    eventType?: {
      meeting?: string;
      workshop?: string;
      planning?: string;
      training?: string;
      virtual?: string;
    };
  };
  // Directory namespace
  directory: {
    title: string;
    search: {
      placeholder: string;
    };
    filters: string;
    tabs: {
      all: string;
      byDepartment: string;
      byLocation: string;
      byTeam: string;
      byRole: string;
    };
    showing: string;
    labels: {
      departments: string;
      locations: string;
      allDepartments: string;
      allLocations: string;
      teams: string;
      roles: string;
      allTeams: string;
      allRoles: string;
    };
    locations: {
      casaSidiMarouf: string;
      casaMaarif: string;
      merrakesh: string;
    };
    actions: {
      message: string;
      viewProfile: string;
    };
  };
  // Password Manager namespace
  passwordManager: {
    title: string;
    description: string;
    vault: string;
    shared: string;
    search: string;
    newPassword: string;
    credentials: {
      title: string;
      username: string;
      password: string;
      website: string;
      notes: string;
      created: string;
      updated: string;
      expiresOn: string;
      category: string;
      strength: string;
    };
    actions: {
      reveal: string;
      hide: string;
      copy: string;
      edit: string;
      delete: string;
      share: string;
      generate: string;
      favorite: string;
      unfavorite: string;
    };
    categories: {
      all: string;
      favorites: string;
      social: string;
      finance: string;
      shopping: string;
      work: string;
      personal: string;
      email: string;
      entertainment: string;
      other: string;
    };
    sharing: {
      title: string;
      sharedWith: string;
      addPeople: string;
      permissions: string;
      permissionTypes: {
        view: string;
        edit: string;
        admin: string;
      };
      stopSharing: string;
    };
    generator: {
      title: string;
      length: string;
      includeUppercase: string;
      includeLowercase: string;
      includeNumbers: string;
      includeSymbols: string;
      excludeSimilar: string;
      excludeAmbiguous: string;
      generate: string;
      copy: string;
    };
    security: {
      title: string;
      overall: string;
      issues: string;
      weak: string;
      reused: string;
      old: string;
      compromised: string;
      lastScan: string;
      scanNow: string;
    };
    empty: {
      title: string;
      description: string;
      action: string;
    };
    form: {
      required: string;
      optional: string;
      createTitle: string;
      editTitle: string;
      save: string;
      cancel: string;
    };
  };
  // Login page namespace
  login?: {
    title: string;
    description: string;
    tabs: {
      username: string;
      google: string;
      passkey: string;
    };
    usernamePassword: {
      username: string;
      password: string;
      forgotPassword: string;
      signIn: string;
      rememberMe: string;
    };
    google: {
      signInWithGoogle: string;
      termsNotice?: string;
    };
    passkey: {
      usePasskey: string;
      instruction: string;
      noPasskeys: string;
      createPasskey: string;
    };
  };
  settings: {
    account: {
      title: string;
      description: string;
    };
  };
  chat: {
    seeLess: string;
    seeMore: string;
    bar: {
      openChatLabel: string;
    };
    welcome: {
      title: string;
      description: string;
      startNewChat: string;
      exploreExamples: string;
      recentChatsTitle: string;
      viewAllHistory: string;
    };
    history: {
      title: string;
      noHistory: string;
      archiveAllButton: string;
      refreshButton: string;
    };
    page: {
      mobileTitle: string;
      desktopTitle: string;
      settingsTitle: string;
      closeSettings: {
        label: string;
      };
      modelTitle: string;
      modelLabel: string;
      selectModelPlaceholder: string;
      temperatureLabel: string;
      temperatureDescription: string;
      moreSettingsButton: string;
      contextFilesLabel: string;
      uploadFileButton: string;
      fileSizeLimit: string;
      noFilesUploaded: string;
      input: {
        attachFileLabel: string;
        placeholder: string;
        micLabel: string;
        sendLabel: string;
      };
    };
  };
  pagination: {
    pageSize: string;
    itemsPerPage: string;
    showing: string;
    previous: string;
    next: string;
    total: string;
    pageInfo: string; // Example: "Page {current} of {total}"
  };
  
  documents:  DictionaryDocuments ;  
  
  company: {
    title: string;
    description: string;
    noEmployees: string;
    employees: string;
    departments: string;
    teams: string;
    policiesTitle: string;
    
    // Tab labels
    tabs: {
      about: string;
      leadership: string;
      mission: string;
      policies: string;
    };
    
    // About Us section
    about: {
      title: string;
      description: string;
      overview: string;
      history: string;
      founded: string;
      headquarters: string;
      employeeCount: string;
      industry: string;
      website: string;
      phone: string;
      email: string;
      address: string;
      companySize: string;
      yearEstablished: string;
      companyType: string;
      specialties: string;
      locations: string;
      globalPresence: string;
      keyFacts: string;
      achievements: string;
      awards: string;
      certifications: string;
      partnerships: string;
    };
    
    // Leadership section
    leadership: {
      title: string;
      description: string;
      executiveTeam: string;
      boardOfDirectors: string;
      managementTeam: string;
      departmentHeads: string;
      ceo: string;
      cto: string;
      cfo: string;
      coo: string;
      vp: string;
      director: string;
      manager: string;
      position: string;
      experience: string;
      education: string;
      expertise: string;
      bio: string;
      contact: string;
      linkedIn: string;
      email: string;
      phone: string;
    };
    
    // Mission & Values section
    mission: {
      title: string;
      description: string;
      missionStatement: string;
      visionStatement: string;
      values: string;
      coreValues: string;
      principles: string;
      culture: string;
      workEnvironment: string;
      diversity: string;
      inclusion: string;
      sustainability: string;
      socialResponsibility: string;
      communityInvolvement: string;
      ethics: string;
      integrity: string;
      innovation: string;
      excellence: string;
      teamwork: string;
      respect: string;
      accountability: string;
      transparency: string;
      customerFocus: string;
      qualityCommitment: string;
    };
    
    // Policies section
    policies: {
      title: string;
      description: string;
      allPolicies: string;
      employeeHandbook: string;
      codeOfConduct: string;
      privacyPolicy: string;
      securityPolicy: string;
      itPolicy: string;
      hrPolicies: string;
      timeOffPolicy: string;
      remoteWorkPolicy: string;
      expensePolicy: string;
      travelPolicy: string;
      trainingPolicy: string;
      performancePolicy: string;
      disciplinaryPolicy: string;
      grievancePolicy: string;
      healthSafetyPolicy: string;
      emergencyProcedures: string;
      dataProtection: string;
      intellectualProperty: string;
      nonDisclosure: string;
      antiHarassment: string;
      equalOpportunity: string;
      whistleblower: string;
      compliance: string;
      regulatory: string;
      lastUpdated: string;
      effectiveDate: string;
      version: string;
      downloadPdf: string;
      viewOnline: string;
      category: string;
      department: string;
      audience: string;
      mandatory: string;
      optional: string;
      acknowledged: string;
      pending: string;
    };
    
    // General company actions and states
    actions: {
      edit: string;
      save: string;
      cancel: string;
      refresh: string;
      share: string;
      print: string;
      download: string;
      upload: string;
      update: string;
      view: string;
      contact: string;
      joinTeam: string;
      viewProfile: string;
      sendEmail: string;
      schedule: string;
      call: string;
    };
    
    // Status and states
    status: {
      active: string;
      inactive: string;
      pending: string;
      approved: string;
      draft: string;
      published: string;
      archived: string;
      underReview: string;
      updated: string;
      new: string;
    };
    
    // Common labels
    labels: {
      name: string;
      role: string;
      department: string;
      location: string;
      startDate: string;
      endDate: string;
      duration: string;
      responsibility: string;
      qualification: string;
      skill: string;
      language: string;
      project: string;
      achievement: string;
      goal: string;
      objective: string;
      strategy: string;
      initiative: string;
      program: string;
      budget: string;
      revenue: string;
      growth: string;
      market: string;
      customer: string;
      product: string;
      service: string;
      solution: string;
      technology: string;
      platform: string;
      system: string;
      process: string;
      procedure: string;
      guideline: string;
      standard: string;
      requirement: string;
      specification: string;
      documentation: string;
      report: string;
      analysis: string;
      research: string;
      study: string;
      survey: string;
      feedback: string;
      review: string;
      evaluation: string;
      assessment: string;
      audit: string;
      inspection: string;
      compliance: string;
      regulation: string;
      law: string;
      legal: string;
      contract: string;
      agreement: string;
      partnership: string;
      collaboration: string;
      alliance: string;
      merger: string;
      acquisition: string;
      investment: string;
      funding: string;
      grant: string;
      scholarship: string;
      award: string;
      recognition: string;
      certificate: string;
      license: string;
      permit: string;
      approval: string;
      authorization: string;
      permission: string;
      access: string;
      security: string;
      safety: string;
      health: string;
      wellness: string;
      benefit: string;
      compensation: string;
      salary: string;
      bonus: string;
      incentive: string;
      reward: string;
      promotion: string;
      advancement: string;
      career: string;
      development: string;
      training: string;
      education: string;
      learning: string;
      competency: string;
      expertise: string;
      knowledge: string;
      experience: string;
      background: string;
      history: string;
      timeline: string;
      milestone: string;
      event: string;
      news: string;
      announcement: string;
      update: string;
      change: string;
      improvement: string;
      enhancement: string;
      optimization: string;
      innovation: string;
      transformation: string;
      modernization: string;
      digitization: string;
      automation: string;
      efficiency: string;
      productivity: string;
      performance: string;
      quality: string;
      excellence: string;
      success: string;
      accomplishment: string;
      result: string;
      outcome: string;
      impact: string;
      influence: string;
      contribution: string;
      value: string;
      worth: string;
      importance: string;
      significance: string;
      relevance: string;
      priority: string;
      urgency: string;
      deadline: string;
      schedule: string;
      calendar: string;
      date: string;
      time: string;
      period: string;
      phase: string;
      stage: string;
      step: string;
      task: string;
      activity: string;
      action: string;
      operation: string;
      function: string;
      feature: string;
      capability: string;
      capacity: string;
      resource: string;
      asset: string;
      tool: string;
      equipment: string;
      facility: string;
      infrastructure: string;
      network: string;
      connection: string;
      relationship: string;
      association: string;
      affiliation: string;
      membership: string;
      participation: string;
      involvement: string;
      engagement: string;
      interaction: string;
      communication: string;
      cooperation: string;
      coordination: string;
      integration: string;
      alignment: string;
      synchronization: string;
      harmony: string;
      balance: string;
      stability: string;
      consistency: string;
      reliability: string;
      dependability: string;
      region: string;
    };
    // Empty states and placeholders
    empty: {
      noData: string;
      noResults: string;
      noEmployees: string;
      noLeadership: string;
      noPolicies: string;
      noDocuments: string;
      noAnnouncements: string;
      noUpdates: string;
      noHistory: string;
      noActivity: string;
      noProjects: string;
      noTeams: string;
      noDepartments: string;
      noLocations: string;
      noContacts: string;
      noEvents: string;
      noNews: string;
      noReports: string;
      noStatistics: string;
      noMetrics: string;
      noInformation: string;
      dataUnavailable: string;
      comingSoon: string;
      underConstruction: string;
      temporarilyUnavailable: string;
    };
  };

  sidebar : {
    dashboard: string;
    analytics: string;
    directory: string;
    company: string;
    teams: string;
    hr: string;
    compta: string;
    security: string;
    settings: string;
    calendar: string;
    files: string;
    live: string;
    messages: string;
    notifications: string;
    helpcenter: {
      title: string;
      description: string;
      help: string;
      gettingStarted: string;
      companyPolicies: string;
      itAndSecurity: string;
      departments: string;
      toolsAndSoftware: string;
      professionalDevelopment: string;
    };
    gettingStarted: string;
    companyPolicies: string;
    itAndSecurity: string;
    departments: string;
    toolsAndSoftware: string;
    professionalDevelopment: string;
  },
  // Help Center namespace
  helpCenter: DictionaryHelpCenter;
  projects: DictionaryProjects,
  accessDenied: {
    title: string;
    description: string;
    attemptedPath: string;
    requiredRoles: string;
    yourRoles: string;
    noRoles: string;
    goBack: string;
    goHome: string;
    contactSupport: string;
  };
}