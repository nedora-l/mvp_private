import { Dictionary } from './dictionary'

// Default fallback locale
const DEFAULT_LOCALE = 'fr';

const supportedLocales = ['en', 'fr', 'ar'] as const;
const supportedDictionaries = ['common','documents','teams','calendar','directory','company','footer','home','login','helpcenter','sidebar','projects'] as const;

const dictionaries = {
  en: (namespace: string = 'common') => import(`./en/${namespace}.json`).then(module => module.default),
  fr: (namespace: string = 'common') => import(`./fr/${namespace}.json`).then(module => module.default),
  ar: (namespace: string = 'common') => import(`./ar/${namespace}.json`).then(module => module.default),
}

/**
 * Loads translation dictionary for specified locale and namespaces with fallback support
 * @param locale The locale to load (e.g., 'en', 'fr', 'ar')
 * @param namespaces The translation namespaces to load (default: ['common'])
 * @returns Merged dictionary object with all requested namespaces
 */
export const getDictionary = async (
  locale: string, 
  namespaces: string[] = ['common']
): Promise<Dictionary> => {
  // Validate locale is supported or fallback to default
  const validatedLocale = locale in dictionaries ? locale : DEFAULT_LOCALE;
  
  try {
    // Initialize result object that will contain all merged translations
    const result: Record<string, any> = {};
    
    // Get fallback translations if locale is not the default
    let fallbackTranslations: Record<string, any> = {};
    if (validatedLocale !== DEFAULT_LOCALE) {
      try {
        for (const ns of namespaces) {
          try {
            const fallbackDict = await import(`./${DEFAULT_LOCALE}/${ns}.json`)
              .then(module => module.default);
            
            // Nest the fallback namespace under its own key
            fallbackTranslations[ns] = fallbackDict;
            // Deep merge with fallback translations
            fallbackTranslations = deepMerge(fallbackTranslations, fallbackDict);
          } catch (error) {
            console.warn(`Failed to load fallback for namespace ${ns}:`, error);
          }
        }
      } catch (error) {
        console.warn('Failed to load fallback translations:', error);
      }
    }
    
    // Load each requested namespace for the validated locale
    for (const ns of namespaces) {
      try {
        const dictionary = await import(`./${validatedLocale}/${ns}.json`)
          .then(module => module.default);
        
        // Nest the namespace under its own key to maintain separation
        result[ns] = dictionary;
        // Merge with result
        Object.assign(result, dictionary);
      } catch (nsError) {
        console.warn(`Error loading namespace ${ns} for locale ${validatedLocale}:`, nsError);
        // Continue with other namespaces if one fails
      }
    }
    
    // Check if we have data - if not enough keys are present, 
    // merge with fallback translations to fill the gaps
    if (isEmptyOrMissingKeys(result)) {
      return deepMerge(fallbackTranslations, result) as Dictionary;
    }
    
    return result as Dictionary;
  } catch (error) {
    console.error(`Error loading dictionaries for locale ${validatedLocale}:`, error);
    
    // Last resort fallback - load common namespace from default locale
    try {
      return dictionaries[DEFAULT_LOCALE as keyof typeof dictionaries]()
        .then(dict => dict as unknown as Dictionary);
    } catch (fallbackError) {
      console.error('Critical error: Failed to load default locale fallback:', fallbackError);
      
      // Return an empty dictionary with base structure to prevent app crashes
      return createEmptyDictionary();
    }
  }
}

/**
 * Deep merges source object into target object
 * Ensures nested objects are properly merged
 */
function deepMerge(target: Record<string, any>, source: Record<string, any>): Record<string, any> {
  const output = { ...target };
  
  if (!source) return output;
  
  for (const key in source) {
    if (typeof source[key] === 'object' && source[key] !== null && key in target) {
      output[key] = deepMerge(target[key], source[key]);
    } else if (source[key] !== undefined) {
      output[key] = source[key];
    }
  }
  
  return output;
}

/**
 * Checks if a dictionary object is empty or missing essential keys
 */
function isEmptyOrMissingKeys(dict: Record<string, any>): boolean {
  // Check if object is empty
  if (Object.keys(dict).length === 0) return true;
  
  // Check for essential top-level keys (customize as needed)
  const essentialKeys = ['app', 'nav', 'common', 'actions'];
  const missingEssentials = essentialKeys.some(key => !dict[key]);
  
  return missingEssentials;
}

/**
 * Creates an empty dictionary with minimal structure to prevent crashes
 */
function createEmptyDictionary(): Dictionary {
  return {
    app: { title: 'Application', description: 'Description' },
    nav: {
      home: 'Home',
      teams: 'Teams',
      projects: 'Projects',
      documents: 'Documents',
      calendar: 'Calendar',
      directory: 'Directory',
      company: 'Company',
      settings: 'Settings',
      profile: 'Profile',
      help: 'Help',
    },
    auth: {
      logout: 'Logout',
      login: 'Login',
      signup: 'Sign Up',
      forgotPassword: 'Forgot Password',
    },
    actions: {
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      add: 'Add',
      search: 'Search',
      view: 'View',
      upload: 'Upload',
      download: 'Download',
      create: 'Create',
      update: 'Update',
      remove: 'Remove',
      filter: 'Filter',
      sort: 'Sort',
      close: 'Close',
      open: 'Open',
      confirm: 'Confirm',
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      emptyState: 'No items to display',
      noResults: 'No results found',
      showMore: 'Show more',
      showLess: 'Show less',
      seeAll: 'See all',
    },
    errors: {
      notFound: 'Not found',
      serverError: 'Server error',
      unauthorized: 'Unauthorized',
      forbidden: 'Forbidden',
      offline: 'You are offline',
      validation: 'Validation error',
    },
    messages: {
      welcome: 'Welcome',
      farewell: 'Goodbye',
      saveSuccess: 'Saved successfully',
      saveError: 'Failed to save',
      deleteConfirm: 'Are you sure?',
      deleteSuccess: 'Deleted successfully',
      deleteError: 'Failed to delete',
    },
    dates: {
      today: 'Today',
      yesterday: 'Yesterday',
      tomorrow: 'Tomorrow',
      formatFull: 'MMMM d, yyyy',
      formatShort: 'MM/dd/yyyy',
      months: {
        january: 'January',
        february: 'February',
        march: 'March',
        april: 'April',
        may: 'May',
        june: 'June',
        july: 'July',
        august: 'August',
        september: 'September',
        october: 'October',
        november: 'November',
        december: 'December',
      },
      weekdays: {
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday',
      },
    },
    plurals: {
      items: {
        singular: '{{count}} item',
        plural: '{{count}} items',
      },
      members: {
        singular: '{{count}} member',
        plural: '{{count}} members',
      },
      tasks: {
        singular: '{{count}} task',
        plural: '{{count}} tasks',
      },
      projects: {
        singular: '{{count}} project',
        plural: '{{count}} projects',
      },
      documents: {
        singular: '{{count}} document',
        plural: '{{count}} documents',
      },
      events: {
        singular: '{{count}} event',
        plural: '{{count}} events',
      },
    },
    home: {
      title: 'Home',
      welcome: 'Welcome',
      quickLinks: {
        title: 'Quick Links',
        viewAll: 'View All',
      },
      companyAnnouncements: {
        title: 'Company Announcements',
        viewAll: 'View All',
        noAnnouncements: 'No announcements',
      },
      upcomingEvents: {
        title: 'Upcoming Events',
        viewAll: 'View All',
        noEvents: 'No upcoming events',
        today: 'Today',
        tomorrow: 'Tomorrow',
      },
      recentDocuments: {
        title: 'Recent Documents',
        viewAll: 'View All',
        noDocuments: 'No recent documents',
      },
      teamActivity: {
        title: 'Team Activity',
        viewAll: 'View All',
        noActivity: 'No recent activity',
      },
      birthdaysAndAnniversaries: {
        title: 'Birthdays & Anniversaries',
        viewAll: 'View All',
        noBirthdays: 'No birthdays today',
        noAnniversaries: 'No work anniversaries today',
        birthdayToday: 'Birthday today',
        anniversary: '{{count}} year anniversary',
        anniversaryPlural: '{{count}} year anniversary',
      },
      stats: {
        tasksCompleted: 'Tasks completed',
        documentsUploaded: 'Documents uploaded',
        teamMembers: 'Team members',
        upcomingDeadlines: 'Upcoming deadlines',
      },
    },
    teams: {
      title: 'Teams',
      createNew: 'Create New Team',
      memberSingular: 'member',
      memberPlural: 'members',
      projectSingular: 'project',
      projectPlural: 'projects',
      details: {
        title: 'Team Details',
        description: 'Description',
        members: 'Members',
        projects: 'Projects',
        activity: 'Activity',
      },
      status: {
        active: 'Active',
        archived: 'Archived',
        pending: 'Pending',
      },
      list: {
        title: 'All Teams',
        noTeams: 'No teams found',
        search: 'Search teams',
        filterBy: 'Filter by',
      },
      actions: {
        join: 'Join Team',
        leave: 'Leave Team',
        edit: 'Edit Team',
        delete: 'Delete Team',
        addMember: 'Add Member',
        removeMember: 'Remove Member',
        createProject: 'Create Project',
      },
      roles: {
        admin: 'Admin',
        member: 'Member',
        guest: 'Guest',
      },
      confirmations: {
        deleteTitle: 'Delete Team',
        deleteDescription: 'This action cannot be undone.',
        leaveTitle: 'Leave Team',
        leaveDescription: 'Are you sure you want to leave?',
      },
      activity: {
        title: 'Team Activity',
      },
    },
    calendar: {
      title: 'Calendar',
      target: 'target',
    },
    documents: {
      title: 'Documents',
    },
  } as Dictionary;
}