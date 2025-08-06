export interface DictionaryHelpCenter {
    title: string;
    subtitle: string;
    header: {
      title: string;
      subtitle: string;
    };
    search: {
      placeholder: string;
      button: string;
    };
    topics: {
      title: string;
      description: string;
      newUserHelp: string;
      beginnersGuide: string;
      gettingStarted: {
        title: string;
        description: string;
      };
      companyPolicies: {
        title: string;
        description: string;
      };
      itAndSecurity: {
        title: string;
        description: string;
      };
      departments: {
        title: string;
        description: string;
      };
      toolsAndSoftware: {
        title: string;
        description: string;
      };
      professionalDevelopment: {
        title: string;
        description: string;
      };
    };
    contact: {
      title: string;
      submitRequest: string;
    };
    admin: {
      refresh: string;
      addTopic: string;
    };
    messages: {
      topicSaved: string;
      topicSavedDescription: string;
      topicAdded: string;
      topicAddedDescription: string;
      saveError: string;
      saveErrorDescription: string;
    };
    categories: {
      "getting-started": string;
      "company-policies": string;
      departments: string;
      "tools-software": string;
      "professional-development": string;
      "cyber-concerns": string;
    };
    searchPlaceholder: string;
    topicsTitle: string;
    featuredArticlesTitle: string;
    supportTitle: string;
    supportMessage: string;
    contactSupportButton: string;
    articles: {
      onboardingGuide: string;
      itSetup: string;
      leavePolicy: string;
      softwareAccess: string;
      bookingMeetingRooms: string;
      performanceReviewProcess: string;
    };
    common: {
      learnMore: string;
      contactInfo: string;
      getStarted: string;
      viewAll: string;
      readMore: string;
      download: string;
      upload: string;
      submit: string;
      save: string;
      cancel: string;
      continue: string;
      back: string;
      next: string;
      previous: string;
      close: string;
      open: string;
      edit: string;
      delete: string;
      share: string;
      print: string;
      export: string;
      import: string;
      search: string;
      filter: string;
      sort: string;
      refresh: string;
      loading: string;
      error: string;
      success: string;
      warning: string;
      info: string;
      required: string;
      optional: string;
      example: string;
      note: string;
      tip: string;
      important: string;
      recommended: string;
      bestPractices: string;
      guidelines: string;
      procedures: string;
      resources: string;
      documentation: string;
      training: string;
      support: string;
      contact: string;
      email: string;
      phone: string;
      address: string;
      website: string;
      hours: string;
      availability: string;
      status: string;
      active: string;
      inactive: string;
      pending: string;
      approved: string;
      rejected: string;
      completed: string;
      inProgress: string;
      notStarted: string;
      overdue: string;
    };
    // Top-level topic sections from JSON
    gettingStarted: {
      title: string;
      description: string;
      welcome: {
        title: string;
        description: string;
        subtitle: string;
      };
      quickStart: {
        title: string;
        description: string;
      };
      firstSteps: {
        title: string;
        description: string;
      };
      basicNavigation: {
        title: string;
        description: string;
      };
      accountSetup: {
        title: string;
        description: string;
      };
      journey: {
        title: string;
        description: string;
        stepByStep: {
          title: string;
          description: string;
        };
        teamSupport: {
          title: string;
          description: string;
        };
        resources: {
          title: string;
          description: string;
        };
      };
      checklist: {
        title: string;
        morning: {
          title: string;
          arriveEarly: {
            title: string;
            description: string;
          };
          hrPaperwork: {
            title: string;
            description: string;
          };
          equipment: {
            title: string;
            description: string;
          };
          officeTour: {
            title: string;
            description: string;
          };
        };
        afternoon: {
          title: string;
          meetManager: {
            title: string;
            description: string;
          };
          meetTeam: {
            title: string;
            description: string;
          };
          systemSetup: {
            title: string;
            description: string;
          };
          companyHandbook: {
            title: string;
            description: string;
          };
        };
      };
      contacts: {
        title: string;
        hr: {
          title: string;
          phone: string;
          email: string;
          description: string;
        };
        it: {
          title: string;
          phone: string;
          email: string;
          description: string;
        };
        emergency: {
          title: string;
          phone: string;
          email: string;
          description: string;
        };
      };
      systemAccess: {
        title: string;
        email: {
          title: string;
          description: string;
          items: string[];
        };
        development: {
          title: string;
          description: string;
          items: string[];
        };
        business: {
          title: string;
          description: string;
          items: string[];
        };
      };
      office: {
        title: string;
        physical: {
          title: string;
          layoutTitle: string;
          items: string[];
        };
        amenities: {
          title: string;
          facilitiesTitle: string;
          items: string[];
        };
      };
      policies: {
        title: string;
        workHours: {
          title: string;
          items: string[];
        };
        communication: {
          title: string;
          items: string[];
        };
        conduct: {
          title: string;
          items: string[];
        };
        technology: {
          title: string;
          items: string[];
        };
      };
      emergency: {
        title: string;
        fire: {
          title: string;
          steps: string[];
        };
        medical: {
          title: string;
          steps: string[];
        };
        security: {
          title: string;
          steps: string[];
        };
      };
    };
    companyPolicies: {
      title: string;
      description: string;
      codeOfConduct: {
        title: string;
        description: string;
      };
      privacyPolicy: {
        title: string;
        description: string;
      };
      termsOfService: {
        title: string;
        description: string;
      };
      hrPolicies: {
        title: string;
        description: string;
      };
      complianceGuidelines: {
        title: string;
        description: string;
      };
    };
    departments: {
      title: string;
      description: string;
      humanResources: {
        title: string;
        description: string;
      };
      finance: {
        title: string;
        description: string;
      };
      it: {
        title: string;
        description: string;
      };
      marketing: {
        title: string;
        description: string;
      };
      operations: {
        title: string;
        description: string;
      };
      legal: {
        title: string;
        description: string;
      };
    };
    toolsSoftware: {
      title: string;
      description: string;
      platformOverview: {
        title: string;
        description: string;
      };
      integrations: {
        title: string;
        description: string;
      };
      mobileApp: {
        title: string;
        description: string;
      };
      apiDocumentation: {
        title: string;
        description: string;
      };
      troubleshooting: {
        title: string;
        description: string;
      };
    };
    professionalDevelopment: {
      title: string;
      description: string;
      trainingPrograms: {
        title: string;
        description: string;
      };
      careerPaths: {
        title: string;
        description: string;
      };
      skillAssessment: {
        title: string;
        description: string;
      };
      certifications: {
        title: string;
        description: string;
      };
      mentorship: {
        title: string;
        description: string;
      };
    };
    cyberConcerns: {
      title: string;
      description: string;
      securityBestPractices: {
        title: string;
        description: string;
      };
      passwordManagement: {
        title: string;
        description: string;
      };
      phishingAwareness: {
        title: string;
        description: string;
      };
      dataProtection: {
        title: string;
        description: string;
      };
      incidentReporting: {
        title: string;
        description: string;
      };
      remoteWorkSecurity: {
        title: string;
        description: string;
      };
    };
    components: {
      gettingStarted: {
        welcome: {
          title: string;
          description: string;
          subtitle: string;
        };
        journey: {
          title: string;
          description: string;
          stepByStep: {
            title: string;
            description: string;
          };
          teamSupport: {
            title: string;
            description: string;
          };
          resources: {
            title: string;
            description: string;
          };
        };
        checklist: {
          title: string;
          morning: {
            title: string;
            arriveEarly: {
              title: string;
              description: string;
            };
            hrPaperwork: {
              title: string;
              description: string;
            };
            equipment: {
              title: string;
              description: string;
            };
            officeTour: {
              title: string;
              description: string;
            };
          };
          afternoon: {
            title: string;
            meetManager: {
              title: string;
              description: string;
            };
            meetTeam: {
              title: string;
              description: string;
            };
            systemSetup: {
              title: string;
              description: string;
            };
            companyHandbook: {
              title: string;
              description: string;
            };
          };
        };
        contacts: {
          title: string;
          hr: {
            title: string;
            phone: string;
            email: string;
            description: string;
          };
          it: {
            title: string;
            phone: string;
            email: string;
            description: string;
          };
          emergency: {
            title: string;
            phone: string;
            email: string;
            description: string;
          };
        };
        systemAccess: {
          title: string;
          email: {
            title: string;
            description: string;
            items: string[];
          };
          development: {
            title: string;
            description: string;
            items: string[];
          };
          business: {
            title: string;
            description: string;
            items: string[];
          };
        };
        office: {
          title: string;
          physical: {
            title: string;
            layoutTitle: string;
            items: string[];
          };
          amenities: {
            title: string;
            facilitiesTitle: string;
            items: string[];
          };
        };
        policies: {
          title: string;
          workHours: {
            title: string;
            items: string[];
          };
          communication: {
            title: string;
            items: string[];
          };
          conduct: {
            title: string;
            items: string[];
          };
          technology: {
            title: string;
            items: string[];
          };
        };
        emergency: {
          title: string;
          fire: {
            title: string;
            steps: string[];
          };
          medical: {
            title: string;
            steps: string[];
          };
          security: {
            title: string;
            steps: string[];
          };
        };
      };
      companyPolicies: {
        welcome: {
          title: string;
          description: string;
          subtitle: string;
        };
        sections: {
          handbook: string;
          leave: string;
          expenses: string;
          conduct: string;
          remoteWork: string;
          performance: string;
          compliance: string;
        };
      };
      departments: {
        welcome: {
          title: string;
          description: string;
          subtitle: string;
        };
        sections: {
          overview: string;
          hr: string;
          development: string;
          sales: string;
          marketing: string;
          finance: string;
          operations: string;
          legal: string;
          support: string;
        };
      };
      toolsSoftware: {
        welcome: {
          title: string;
          description: string;
          subtitle: string;
        };
        sections: {
          overview: string;
          salesforce: string;
          jira: string;
          office365: string;
          communication: string;
          development: string;
          analytics: string;
        };
      };
      professionalDevelopment: {
        welcome: {
          title: string;
          description: string;
          subtitle: string;
        };
        sections: {
          pathways: string;
          training: string;
          certification: string;
          mentorship: string;
          performance: string;
          external: string;
          leadership: string;
        };
      };
      cyberSecurity: {
        navigation: {
          bestPractices: string;
          internet: string;
          email: string;
          equipment: string;
          passwords: string;
        };
        welcome: {
          title: string;
          description: string;
          subtitle: string;
        };
        sections: {
          bestPractices: string;
          internetSafety: string;
          emailSecurity: string;
          equipmentSecurity: string;
          passwordSecurity: string;
        };
        alerts: {
          whenToReact: string;
          contactSupport: string;
          urgentAction: string;
        };
      };
    };
}