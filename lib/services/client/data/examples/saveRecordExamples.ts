/**
 * Examples of saving new records using the Dynamic Data API
 * This file demonstrates various patterns for creating and saving data records
 */

import { 
  createDataRecordClientApi,
  updateDataRecordClientApi,
  HelpCenterDataService,
  oqlQueryBuilderClient,
  DataRecordRequestDto
} from '@/lib/services/client/data';

// Example 1: Basic record creation
export const saveBasicRecord = async () => {
  try {
    const response = await createDataRecordClientApi({
      metaRecordApiName: 'Contact__c',
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        department: 'Engineering'
      },
      isActive: true,
      isArchived: false,
      isPublic: false
    });

    console.log('Contact saved:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to save contact:', error);
    throw error;
  }
};

// Example 2: Save with complex data structure
export const saveComplexRecord = async () => {
  try {
    const projectData = {
      metaRecordApiName: 'Project__c',
      data: {
        name: 'New Product Launch',
        description: 'Launch our new product line in Q2 2024',
        startDate: '2024-04-01',
        endDate: '2024-06-30',
        status: 'Planning',
        budget: 150000,
        team: {
          projectManager: 'john.doe@company.com',
          developers: ['dev1@company.com', 'dev2@company.com'],
          designers: ['designer1@company.com']
        },
        milestones: [
          { name: 'Requirements Gathering', dueDate: '2024-04-15', completed: false },
          { name: 'Design Phase', dueDate: '2024-05-15', completed: false },
          { name: 'Development Phase', dueDate: '2024-06-15', completed: false }
        ],
        tags: ['product-launch', 'q2-2024', 'high-priority'],
        customFields: {
          riskLevel: 'Medium',
          stakeholders: ['CEO', 'CTO', 'Marketing Director'],
          externalVendors: []
        }
      },
      isActive: true,
      isArchived: false,
      isPublic: false
    };

    const response = await createDataRecordClientApi(projectData);
    console.log('Project saved:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to save project:', error);
    throw error;
  }
};

// Example 3: Save with validation and error handling
export const saveWithValidation = async (contactData: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}) => {
  // Client-side validation
  if (!contactData.firstName || !contactData.lastName) {
    throw new Error('First name and last name are required');
  }

  if (!contactData.email || !contactData.email.includes('@')) {
    throw new Error('Valid email address is required');
  }

  if (contactData.phone && !/^\+?[\d\s\-\(\)]+$/.test(contactData.phone)) {
    throw new Error('Invalid phone number format');
  }

  try {
    // Check if email already exists using OQL
    const existingContacts = await oqlQueryBuilderClient('Contact__c')
      .addField('id')
      .addField('email')
      .where('email', '=', contactData.email)
      .limit(1)
      .fetch();

    if (existingContacts.data && Object.keys(existingContacts.data).length > 0) {
      throw new Error('A contact with this email already exists');
    }

    // Save the new contact
    const response = await createDataRecordClientApi({
      metaRecordApiName: 'Contact__c',
      data: {
        ...contactData,
        createdAt: new Date().toISOString(),
        source: 'web-form'
      },
      isActive: true,
      isArchived: false,
      isPublic: false
    });

    console.log('Contact saved with validation:', response.data);
    return response.data;
  } catch (error) {
    console.error('Validation or save failed:', error);
    throw error;
  }
};

// Example 4: Batch save multiple records
export const batchSaveRecords = async (contacts: Array<{
  firstName: string;
  lastName: string;
  email: string;
  department: string;
}>) => {
  const results = [];
  const errors = [];

  for (const [index, contact] of contacts.entries()) {
    try {
      const response = await createDataRecordClientApi({
        metaRecordApiName: 'Contact__c',
        data: {
          ...contact,
          batchId: `batch-${Date.now()}`,
          batchIndex: index,
          createdAt: new Date().toISOString()
        },
        isActive: true,
        isArchived: false,
        isPublic: false
      });

      results.push(response.data);
      console.log(`Contact ${index + 1} saved:`, response.data?.id);
    } catch (error) {
      console.error(`Failed to save contact ${index + 1}:`, error);
      errors.push({ index, contact, error });
    }

    // Add delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return { results, errors };
};

// Example 5: Save with relationship to parent record
export const saveChildRecord = async (parentId: string, taskData: {
  title: string;
  description: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
}) => {
  try {
    const response = await createDataRecordClientApi({
      metaRecordApiName: 'Task__c',
      data: {
        ...taskData,
        projectId: parentId, // Reference to parent project
        status: 'Not Started',
        createdAt: new Date().toISOString(),
        estimatedHours: 0,
        actualHours: 0
      },
      isActive: true,
      isArchived: false,
      isPublic: false
    });

    console.log('Task saved with parent reference:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to save task:', error);
    throw error;
  }
};

// Example 6: Save with file attachments (assuming file handling is implemented)
export const saveWithAttachments = async (documentData: {
  title: string;
  description: string;
  category: string;
  attachments?: File[];
}) => {
  try {
    // First save the main record
    const response = await createDataRecordClientApi({
      metaRecordApiName: 'Document__c',
      data: {
        title: documentData.title,
        description: documentData.description,
        category: documentData.category,
        hasAttachments: documentData.attachments && documentData.attachments.length > 0,
        attachmentCount: documentData.attachments?.length || 0,
        createdAt: new Date().toISOString()
      },
      isActive: true,
      isArchived: false,
      isPublic: true
    });

    const documentId = response.data?.id;

    // If there are attachments, save them as separate records
    if (documentData.attachments && documentId) {
      const attachmentPromises = documentData.attachments.map(async (file, index) => {
        // In a real implementation, you'd upload the file first and get a URL
        return createDataRecordClientApi({
          metaRecordApiName: 'Attachment__c',
          data: {
            documentId: documentId,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            uploadIndex: index,
            // fileUrl: uploadedFileUrl, // This would come from file upload service
            createdAt: new Date().toISOString()
          },
          isActive: true,
          isArchived: false,
          isPublic: false
        });
      });

      const attachmentResults = await Promise.allSettled(attachmentPromises);
      console.log('Attachments saved:', attachmentResults);
    }

    return response.data;
  } catch (error) {
    console.error('Failed to save document with attachments:', error);
    throw error;
  }
};

// Example 7: Save and immediately update
export const saveAndUpdate = async (initialData: any, updateData: any) => {
  try {
    // Create the record
    const createResponse = await createDataRecordClientApi({
      metaRecordApiName: 'Lead__c',
      data: initialData,
      isActive: true,
      isArchived: false,
      isPublic: false
    });

    const recordId = createResponse.data?.id;
    if (!recordId) {
      throw new Error('Failed to get record ID after creation');
    }

    // Immediately update with additional data
    const updateResponse = await updateDataRecordClientApi(recordId, {
      metaRecordApiName: 'Lead__c',
      data: {
        ...initialData,
        ...updateData,
        lastModified: new Date().toISOString()
      },
      isActive: true,
      isArchived: false,
      isPublic: false
    });

    console.log('Record created and updated:', updateResponse.data);
    return updateResponse.data;
  } catch (error) {
    console.error('Failed to save and update:', error);
    throw error;
  }
};

// Example 8: Using the Help Center Data Service
export const saveHelpCenterCategory = async () => {
  try {
    const category = await HelpCenterDataService.saveCategory({
      slug: 'getting-started',
      title: 'Getting Started',
      description: 'Learn the basics of using our platform',
      iconName: 'play-circle',
      isPublic: true,
      metadata: {
        sortOrder: 1,
        featured: true,
        estimatedReadTime: '5 minutes'
      }
    });

    console.log('Help center category saved:', category);
    return category;
  } catch (error) {
    console.error('Failed to save help center category:', error);
    throw error;
  }
};

// Example 9: Save with retry logic
export const saveWithRetry = async (recordData: DataRecordRequestDto, maxRetries = 3) => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await createDataRecordClientApi(recordData);
      console.log(`Record saved on attempt ${attempt}:`, response.data);
      return response.data;
    } catch (error) {
      lastError = error as Error;
      console.warn(`Save attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(`Failed to save after ${maxRetries} attempts. Last error: ${lastError!.message}`);
};

// Example 10: Save with progress tracking (for UI)
export const saveWithProgress = async (
  recordData: DataRecordRequestDto,
  onProgress?: (step: string, progress: number) => void
) => {
  try {
    onProgress?.('Validating data...', 10);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate validation

    onProgress?.('Preparing record...', 30);
    await new Promise(resolve => setTimeout(resolve, 300));

    onProgress?.('Saving to database...', 60);
    const response = await createDataRecordClientApi(recordData);

    onProgress?.('Finalizing...', 90);
    await new Promise(resolve => setTimeout(resolve, 200));

    onProgress?.('Complete!', 100);
    
    console.log('Record saved with progress tracking:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to save with progress:', error);
    throw error;
  }
};
