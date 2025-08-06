# AI Agents Management System - Testing Guide

## Quick Start Testing

### 1. Navigate to AI Agents Management

1. Start the development server: `npm run dev`
2. Navigate to: `http://localhost:3000/{locale}/admin/ai-agents`
3. You should see the AI Agents management dashboard

### 2. Test Main Features

#### Dashboard Overview

- ✅ **Statistics Cards**: Shows total agents, requests, uptime, and active agents
- ✅ **Agent Listing**: Table with 6 mock agents of different types and statuses
- ✅ **Filtering**: Try filtering by type (Chat, Support, Analytics, etc.)
- ✅ **Search**: Search for agents by name, description, or tags
- ✅ **Status Indicators**: Color-coded badges with icons

#### Create New Agent

1. Click "Create Agent" button
2. **Template Selection**: Choose from pre-built templates or start from scratch
3. **Agent Details**: Fill in name, description, type, and tags
4. **Configuration**: Set model, temperature, system prompt, and constraints
5. **Submit**: Create the agent and see success notification

#### Agent Actions

- **View Details**: Click on any agent to see detailed information
- **Toggle Status**: Activate/deactivate agents from the dropdown menu
- **Clone Agent**: Copy agent configuration (placeholder)
- **Delete Agent**: Remove agents with confirmation

#### Individual Agent Details

1. Click "View Details" on any agent
2. Navigate through tabs: Overview, Configuration, Metrics, Permissions
3. Test action buttons: Edit, Toggle Status, Clone, Export

### 3. Mock Data Available

The system includes 6 comprehensive mock agents:

1. **Customer Support Assistant** (Support, Active)
   - High usage, excellent metrics
   - Multi-language support
   - Auto-escalation features

2. **Data Analytics Engine** (Analytics, Active)
   - Advanced analytics and reporting
   - Statistical analysis tools
   - Business intelligence features

3. **Workflow Automation Bot** (Automation, Training)
   - Process automation
   - API integrations
   - Document processing

4. **Chat Assistant Alpha** (Chat, Active)
   - General purpose chatbot
   - Employee communications
   - High activity levels

5. **Document Assistant** (Assistant, Error)
   - Document analysis and summarization
   - Content generation
   - Currently in error state for testing

6. **Code Review Assistant** (Assistant, Inactive)
   - Code analysis and review
   - Security scanning
   - Development best practices

### 4. Test Scenarios

#### Scenario 1: Create a New Marketing Agent

1. Click "Create Agent"
2. Select "Start from Scratch"
3. Fill in details:
   - Name: "Marketing Campaign Assistant"
   - Type: "Assistant"
   - Description: "Helps create and optimize marketing campaigns"
   - Tags: "marketing", "campaigns", "optimization"
4. Configure:
   - Model: GPT-4 Turbo
   - Temperature: 0.6
   - System Prompt: "You are a marketing expert..."
5. Enable rate limiting: 50 requests/hour
6. Create and verify it appears in the list

#### Scenario 2: Filter and Search

1. Filter by type: "Support" - should show Customer Support Assistant
2. Filter by status: "Error" - should show Document Assistant
3. Search for "analytics" - should show Data Analytics Engine
4. Clear filters to see all agents

#### Scenario 3: Agent Management

1. Select "Chat Assistant Alpha"
2. View detailed metrics and configuration
3. Test export functionality
4. Try toggling status from Active to Inactive
5. Navigate to individual agent page using the detail view

#### Scenario 4: Error Handling

1. Try creating an agent without required fields
2. Test with invalid data
3. Verify error messages and toast notifications

### 5. Development Features

#### Mock Data System

- All API calls use mock data when `USE_MOCK_DATA = true`
- Realistic delays simulate real API responses
- Comprehensive test data covers all scenarios

#### Component Architecture

- Modular, reusable components
- Type-safe TypeScript implementation
- Responsive design for all screen sizes

#### State Management

- React hooks for local state
- Toast notifications for user feedback
- Loading states and error handling

### 6. Extension Points

#### Adding New Agent Types

1. Update `AIAgentType` in `lib/interfaces/apis/ai-agents.ts`
2. Add type colors and icons in components
3. Create new templates if needed

#### Custom Templates

1. Add to `defaultTemplates` in `create-ai-agent-modal.tsx`
2. Define configuration, system prompts, and capabilities
3. Include appropriate tags and metadata

#### New Metrics

1. Extend `AIAgentMetrics` interface
2. Update mock data to include new metrics
3. Add visualization in detail views

### 7. File Locations

#### Core Files

- **Main Page**: `app/[locale]/admin/ai-agents/page.tsx`
- **Management Component**: `components/admin/ai-agents-management.component.tsx`
- **Create Modal**: `components/admin/modals/create-ai-agent-modal.tsx`
- **Details Modal**: `components/admin/modals/ai-agent-details-modal.tsx`
- **Detail View**: `components/admin/ai-agent-detail-view.tsx`

#### Configuration

- **Types**: `lib/interfaces/apis/ai-agents.ts`
- **Services**: `lib/services/client/admin/ai-agents/ai-agents.client.service.ts`
- **Mock Data**: `lib/mock-data/ai-agents.ts`

#### Routes

- **Main Dashboard**: `/admin/ai-agents`
- **Individual Agent**: `/admin/ai-agents/[id]`

### 8. Browser Testing

#### Desktop (Chrome, Firefox, Safari, Edge)

- ✅ Full functionality
- ✅ Responsive layout
- ✅ Modal interactions
- ✅ Dropdown menus
- ✅ Keyboard navigation

#### Mobile (iOS Safari, Chrome Mobile)

- ✅ Mobile-optimized layout
- ✅ Touch interactions
- ✅ Responsive tables
- ✅ Modal sheets

#### Tablet (iPad, Android tablets)

- ✅ Optimized for tablet screens
- ✅ Touch-friendly interfaces
- ✅ Landscape/portrait modes

### 9. Performance Testing

#### Load Testing

- Test with large agent lists (modify mock data)
- Verify search and filtering performance
- Check memory usage with many modal opens

#### Network Testing

- Test with slow connections (throttle in DevTools)
- Verify loading states display correctly
- Check error handling for network failures

### 10. Accessibility Testing

#### Screen Readers

- Use VoiceOver (macOS) or NVDA (Windows)
- Verify all content is properly announced
- Test navigation with screen reader

#### Keyboard Navigation

- Tab through all interactive elements
- Test modal focus management
- Verify skip links and ARIA labels

#### Visual Accessibility

- Test with high contrast mode
- Verify color contrast ratios
- Check with zoom levels up to 200%

## Common Issues & Solutions

### Issue: "Module not found"

**Solution**: Ensure all imports use correct paths relative to project structure

### Issue: "Type errors"

**Solution**: Check TypeScript interfaces match actual data structure

### Issue: "Mock data not loading"

**Solution**: Verify `USE_MOCK_DATA = true` in service file

### Issue: "Styling issues"

**Solution**: Ensure Tailwind CSS classes are properly configured

### Issue: "Toast notifications not working"

**Solution**: Check toast provider is configured in layout

## Success Criteria

- [ ] All 6 mock agents display correctly
- [ ] Create agent modal works end-to-end
- [ ] Filtering and search function properly
- [ ] Status toggle updates correctly
- [ ] Agent details modal shows comprehensive information
- [ ] Individual agent pages load and display correctly
- [ ] Export functionality downloads JSON file
- [ ] Responsive design works on all screen sizes
- [ ] Error handling displays appropriate messages
- [ ] Toast notifications appear for all actions

## Next Steps

1. **Backend Integration**: Replace mock data with real API calls
2. **Enhanced Features**: Add real-time metrics, advanced filtering
3. **User Management**: Integrate with actual user permissions system
4. **Monitoring**: Add real-time agent status monitoring
5. **Analytics**: Implement detailed usage analytics and reporting
