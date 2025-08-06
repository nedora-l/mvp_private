// Email Templates Client API Exports
// Index file for easy importing

export * from './email.templates.client.service';

// Re-export commonly used functions for convenience
export {
  getAllEmailTemplates,
  getEmailTemplateById,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  activateEmailTemplate,
  deactivateEmailTemplate,
  setEmailTemplateAsDefault,
  getEmailTemplatesByCategory,
  previewEmailTemplate,
  cloneEmailTemplate,
  searchEmailTemplates,
  bulkActionEmailTemplates
} from './email.templates.client.service';
