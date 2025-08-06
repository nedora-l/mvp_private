# 📧 Email Management APIs - Postman Collections

This directory contains comprehensive Postman collections for testing and interacting with the Email Management system APIs.

## 📁 Collections Overview

### 1. **Email Templates Admin API** (`Email_Templates_Admin_API.postman_collection.json`)

Complete CRUD operations and advanced management for email templates.

**Key Features:**

- ✅ Template CRUD (Create, Read, Update, Delete)
- ✅ Status Management (Activate, Deactivate, Set Default)
- ✅ Category Management
- ✅ Template Processing (Preview, Variable Extraction)
- ✅ Advanced Operations (Clone, Bulk Actions)
- ✅ Statistics & Analytics

### 2. **Email Logs Admin API** (`Email_Logs_Admin_API.postman_collection.json`)

Email tracking, monitoring, and analytics for sent emails.

**Key Features:**

- ✅ Log Management (View, Filter, Search)
- ✅ Date & Time Queries
- ✅ Status Management
- ✅ Email Tracking (Open, Click tracking)
- ✅ Statistics & Analytics

### 3. **Environment File** (`Email_APIs_Environment.postman_environment.json`)

Pre-configured environment variables for seamless API testing.

## 🚀 Quick Start

### 1. Import Collections

1. Open Postman
2. Click **Import** button
3. Select all three files:
   - `Email_Templates_Admin_API.postman_collection.json`
   - `Email_Logs_Admin_API.postman_collection.json`
   - `Email_APIs_Environment.postman_environment.json`

### 2. Configure Environment

1. Select **Email APIs Environment** from the environment dropdown
2. Update the following variables:
   - `base_url`: Your API base URL (default: `http://localhost:8080`)
   - `jwt_token`: Your authentication token

### 3. Start Testing

All collections are ready to use with pre-configured requests and example data.

## 📋 API Endpoints Reference

### Email Templates Admin API

#### Template Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/emails/templates` | Get all templates with pagination |
| GET | `/api/admin/emails/templates/{id}` | Get template by ID |
| GET | `/api/admin/emails/templates/by-name/{name}` | Get template by name |
| POST | `/api/admin/emails/templates` | Create new template |
| PUT | `/api/admin/emails/templates/{id}` | Update template |
| DELETE | `/api/admin/emails/templates/{id}` | Delete template |

#### Status Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/emails/templates/{id}/activate` | Activate template |
| POST | `/api/admin/emails/templates/{id}/deactivate` | Deactivate template |
| POST | `/api/admin/emails/templates/{id}/set-default` | Set as default template |

#### Category Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/emails/templates/categories` | Get all categories |
| GET | `/api/admin/emails/templates/category/{category}` | Get templates by category |
| GET | `/api/admin/emails/templates/category/{category}/default` | Get default template for category |

#### Template Processing

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/emails/templates/{id}/preview` | Preview template with variables |
| POST | `/api/admin/emails/templates/extract-variables` | Extract variables from content |

#### Advanced Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/emails/templates/{id}/clone` | Clone template |
| POST | `/api/admin/emails/templates/bulk-action` | Bulk operations |
| GET | `/api/admin/emails/templates/statistics` | Get statistics |

### Email Logs Admin API

#### Log Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/emails/logs` | Get all logs with pagination |
| GET | `/api/admin/emails/logs/message/{messageId}` | Get log by message ID |
| GET | `/api/admin/emails/logs/recipient/{email}` | Get logs by recipient |
| GET | `/api/admin/emails/logs/campaign/{campaignId}` | Get logs by campaign |
| GET | `/api/admin/emails/logs/template/{templateId}` | Get logs by template |

#### Date & Time Queries

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/emails/logs/date-range` | Get logs in date range |
| GET | `/api/admin/emails/logs/failed` | Get failed emails |

#### Email Status Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/admin/emails/logs/message/{messageId}/status` | Update email status |

#### Email Tracking

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/emails/logs/message/{messageId}/opened` | Mark as opened |
| POST | `/api/admin/emails/logs/message/{messageId}/clicked` | Mark as clicked |

#### Statistics & Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/emails/logs/statistics` | Get comprehensive statistics |
| GET | `/api/admin/emails/logs/statistics/date-range` | Get statistics for date range |
| GET | `/api/admin/emails/logs/count/status/{status}` | Get count by status |
| GET | `/api/admin/emails/logs/count/today` | Get count sent today |

## 🔧 Environment Variables

| Variable | Description | Default Value | Type |
|----------|-------------|---------------|------|
| `base_url` | API base URL | `http://localhost:8080` | string |
| `jwt_token` | Authentication token | `your-jwt-token-here` | secret |
| `template_id` | Template ID for testing | `1` | string |
| `template_name` | Template name for testing | `welcome-email` | string |
| `category_name` | Category name for testing | `welcome` | string |
| `message_id` | Message ID for testing | `msg-12345` | string |
| `recipient_email` | Recipient email for testing | `test@example.com` | string |
| `campaign_id` | Campaign ID for testing | `welcome-campaign-2025` | string |
| `email_status` | Email status for testing | `SENT` | string |
| `start_date` | Start date for range queries | `2025-06-22T00:00:00` | string |
| `end_date` | End date for range queries | `2025-06-22T23:59:59` | string |
| `since_date` | Since date for queries | `2025-06-21T00:00:00` | string |

## 📊 Template Statuses

- **DRAFT**: Template is being created/edited
- **ACTIVE**: Template is ready for use
- **INACTIVE**: Template is temporarily disabled
- **ARCHIVED**: Template is archived (read-only)
- **TESTING**: Template is in testing phase

## 📈 Email Statuses

- **PENDING**: Email is queued for sending
- **SENT**: Email has been sent
- **DELIVERED**: Email was successfully delivered
- **FAILED**: Email sending failed
- **BOUNCED**: Email bounced back
- **OPENED**: Email was opened by recipient
- **CLICKED**: Recipient clicked a link in the email

## 🧪 Testing Workflows

### 1. Template Management Workflow

1. **Create Template** → Use "Create Template" request
2. **Preview Template** → Use "Preview Template" with sample variables
3. **Activate Template** → Use "Activate Template"
4. **Set as Default** → Use "Set as Default Template"
5. **Clone Template** → Use "Clone Template" for variations

### 2. Email Monitoring Workflow

1. **Check Today's Stats** → Use "Get Count Sent Today"
2. **View Recent Logs** → Use "Get All Logs" with recent date filter
3. **Check Failed Emails** → Use "Get Failed Emails"
4. **View Template Performance** → Use "Get Logs by Template"

### 3. Analytics Workflow

1. **Overall Statistics** → Use "Get Email Statistics"
2. **Date Range Analysis** → Use "Get Statistics for Date Range"
3. **Status Breakdown** → Use "Get Count by Status" for each status
4. **Template Statistics** → Use "Get Template Statistics"

## 🔐 Authentication

All API requests require JWT authentication. Set your token in the `jwt_token` environment variable:

```text
Authorization: Bearer your-jwt-token-here
```

## 📝 Example Request Bodies

### Create Template

```json
{
  "name": "welcome-email-v2",
  "displayName": "Welcome Email V2",
  "description": "Updated welcome email template",
  "category": "welcome",
  "subjectTemplate": "Welcome to {{companyName}}, {{userName}}!",
  "htmlContent": "<h1>Welcome {{userName}}!</h1>",
  "plainTextContent": "Welcome {{userName}}!",
  "language": "en",
  "tags": ["welcome", "onboarding"],
  "metadata": {
    "version": "2.0",
    "designer": "UI Team"
  }
}
```

### Preview Template

```json
{
  "userName": "John Doe",
  "companyName": "ACME Corporation",
  "supportEmail": "support@acme.com"
}
```

### Bulk Actions

```json
{
  "action": "activate",
  "templateIds": [1, 2, 3, 4]
}
```

## 🚨 Common Issues & Solutions

### 1. **404 Not Found**

- Verify the `base_url` is correct
- Check if the API server is running
- Ensure the endpoint path is correct

### 2. **401 Unauthorized**

- Update the `jwt_token` with a valid token
- Check token expiration

### 3. **400 Bad Request**

- Verify request body format
- Check required fields are provided
- Validate data types and constraints

## 📞 Support

For API-related questions or issues:

- Check the main API documentation
- Review error responses for detailed error messages
- Verify environment variable values

## 🔄 Collection Updates

These collections are maintained alongside the API development. Import the latest versions to get new endpoints and features as they are added.
