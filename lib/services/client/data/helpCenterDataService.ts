import { 
  createDataRecordClientApi,
  updateDataRecordClientApi,
  getDataRecordDetailsClientApi,
  DataRecordDto,
  DataRecordRequestDto 
} from '@/lib/services/client/data';

/**
 * Utility functions for saving help center data records
 */
export class HelpCenterDataService {

  /**
   * Save a new help center category
   */
  static async saveCategory(categoryData: {
    slug: string;
    title: string;
    description: string;
    iconName: string;
    isPublic?: boolean;
    metadata?: Record<string, any>;
  }): Promise<DataRecordDto> {
    try {
      const requestDto: DataRecordRequestDto = {
        metaRecordApiName: 'HelpCenter_Category__c',
        data: {
          slug: categoryData.slug,
          title: categoryData.title,
          description: categoryData.description,
          iconName: categoryData.iconName,
          sortOrder: 0,
          articleCount: 0,
          ...categoryData.metadata
        },
        isActive: true,
        isArchived: false,
        isPublic: categoryData.isPublic ?? true
      };

      const response = await createDataRecordClientApi(requestDto);
      
      if (response.success && response.data) {
        console.log('Category saved successfully:', response.data);
        return response.data;
      } else {
        throw new Error(response.error?.message || 'Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      throw error;
    }
  }

  /**
   * Save a new help center article
   */
  static async saveArticle(articleData: {
    title: string;
    content: string;
    categoryId: string;
    slug: string;
    tags?: string[];
    author?: string;
    metadata?: Record<string, any>;
  }): Promise<DataRecordDto> {
    try {
      const requestDto: DataRecordRequestDto = {
        metaRecordApiName: 'HelpCenter_Article__c',
        data: {
          title: articleData.title,
          content: articleData.content,
          slug: articleData.slug,
          categoryId: articleData.categoryId,
          tags: articleData.tags || [],
          author: articleData.author || 'system',
          viewCount: 0,
          isHelpful: 0,
          isNotHelpful: 0,
          lastUpdated: new Date().toISOString(),
          ...articleData.metadata
        },
        isActive: true,
        isArchived: false,
        isPublic: true
      };

      const response = await createDataRecordClientApi(requestDto);
      
      if (response.success && response.data) {
        console.log('Article saved successfully:', response.data);
        return response.data;
      } else {
        throw new Error(response.error?.message || 'Failed to save article');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      throw error;
    }
  }

  /**
   * Update an existing category
   */
  static async updateCategory(
    categoryId: string, 
    updates: Partial<{
      title: string;
      description: string;
      iconName: string;
      isPublic: boolean;
      sortOrder: number;
    }>
  ): Promise<DataRecordDto> {
    try {
      // First, get the current record
      const currentRecord = await getDataRecordDetailsClientApi(categoryId);
      
      if (!currentRecord.success || !currentRecord.data) {
        throw new Error('Category not found');
      }

      // Merge current data with updates
      const updatedData = {
        ...currentRecord.data,
        ...updates,
        lastModified: new Date().toISOString()
      };

      const requestDto: DataRecordRequestDto = {
        metaRecordApiName: 'HelpCenter_Category__c',
        data: updatedData,
        isActive: currentRecord.data.isActive,
        isArchived: currentRecord.data.isArchived,
        isPublic: updates.isPublic ?? currentRecord.data.isPublic
      };

      const response = await updateDataRecordClientApi(categoryId, requestDto);
      
      if (response.success && response.data) {
        console.log('Category updated successfully:', response.data);
        return response.data;
      } else {
        throw new Error(response.error?.message || 'Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  /**
   * Batch save multiple categories
   */
  static async batchSaveCategories(categories: Array<{
    slug: string;
    title: string;
    description: string;
    iconName: string;
    sortOrder?: number;
  }>): Promise<DataRecordDto[]> {
    const results: DataRecordDto[] = [];
    const errors: Error[] = [];

    for (const [index, category] of categories.entries()) {
      try {
        const saved = await this.saveCategory({
          ...category,
          //sortOrder: category.sortOrder ?? index,
          metadata: { batchId: Date.now() }
        });
        results.push(saved);
      } catch (error) {
        console.error(`Failed to save category ${category.title}:`, error);
        errors.push(error as Error);
      }
    }

    if (errors.length > 0) {
      console.warn(`${errors.length} categories failed to save out of ${categories.length}`);
    }

    return results;
  }

  /**
   * Save with validation
   */
  static async saveWithValidation(data: {
    type: 'category' | 'article';
    payload: Record<string, any>;
  }): Promise<DataRecordDto> {
    // Validation logic
    if (data.type === 'category') {
      if (!data.payload.title || !data.payload.slug) {
        throw new Error('Title and slug are required for categories');
      }
      if (data.payload.slug.includes(' ')) {
        throw new Error('Slug cannot contain spaces');
      }
    }

    if (data.type === 'article') {
      if (!data.payload.title || !data.payload.content || !data.payload.categoryId) {
        throw new Error('Title, content, and category are required for articles');
      }
    }

    // Save based on type
    if (data.type === 'category') {
      return await this.saveCategory(data.payload as {
        slug: string;
        title: string;
        description: string;
        iconName: string;
      });
    } else {
      return await this.saveArticle(data.payload as {
        title: string;
        content: string;
        categoryId: string;
        slug: string;
      });
    }
  }

  /**
   * Save with retry logic
   */
  static async saveWithRetry<T>(
    saveFunction: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await saveFunction();
      } catch (error) {
        lastError = error as Error;
        console.warn(`Save attempt ${attempt} failed:`, error);
        
        if (attempt < maxRetries) {
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
        }
      }
    }

    throw new Error(`Failed to save after ${maxRetries} attempts. Last error: ${lastError!.message}`);
  }
}

/**
 * Example usage in a React component
 */
export const useHelpCenterSave = () => {
  const saveCategory = async (categoryData: Parameters<typeof HelpCenterDataService.saveCategory>[0]) => {
    try {
      return await HelpCenterDataService.saveWithRetry(
        () => HelpCenterDataService.saveCategory(categoryData),
        3,
        1000
      );
    } catch (error) {
      console.error('Failed to save category with retry:', error);
      throw error;
    }
  };

  const saveArticle = async (articleData: Parameters<typeof HelpCenterDataService.saveArticle>[0]) => {
    try {
      return await HelpCenterDataService.saveWithRetry(
        () => HelpCenterDataService.saveArticle(articleData),
        3,
        1000
      );
    } catch (error) {
      console.error('Failed to save article with retry:', error);
      throw error;
    }
  };

  return { saveCategory, saveArticle };
};
