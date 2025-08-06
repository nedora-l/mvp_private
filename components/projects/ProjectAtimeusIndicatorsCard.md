# ProjectAtimeusIndicatorsCard Component

A comprehensive React component for displaying Atimeus financial indicators and project metrics in a Next.js application.

## Features

- **Complete Financial Overview**: Displays YTD margins, revenues, and costs with monthly breakdowns
- **Tasks Metrics**: Comprehensive task-related financial indicators including TJM rates and consumption tracking
- **Trading Data**: Trading-related financial metrics and forecasts
- **Expenses Tracking**: Expense management with margin calculations and rebillable amounts
- **Invoicing & Contracts**: Invoice status, payment tracking, and contract management
- **Project Management**: Team information, customer details, and project status
- **Responsive Design**: Mobile-first approach with collapsible sections
- **Internationalization**: Full i18n support with English and French translations
- **Loading States**: Proper loading and error handling
- **Accessibility**: WCAG compliant with proper semantic HTML and keyboard navigation

## Usage

```tsx
import { ProjectAtimeusIndicatorsCard } from '@/components/projects/ProjectAtimeusIndicatorsCard';
import { ProjectFinancialSummaryDto } from '@/lib/interfaces/apis/atimeus';
import { ProjectDto } from '@/lib/services/client/projects';

function ProjectPage() {
  const [atimeusData, setAtimeusData] = useState<ProjectFinancialSummaryDto | null>(null);
  const [projectData, setProjectData] = useState<ProjectDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ProjectAtimeusIndicatorsCard
      previewProject={projectData}
      atimeusProject={atimeusData}
      dictionary={dictionary}
      isLoading={isLoading}
    />
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `previewProject` | `ProjectDto` | Yes | Basic project information |
| `atimeusProject` | `ProjectFinancialSummaryDto` | Yes | Atimeus financial data |
| `dictionary` | `Dictionary` | Yes | Translation dictionary |
| `isLoading` | `boolean` | No | Loading state (default: false) |

## Sections

### 1. Financial Overview

- YTD Revenue, Costs, and Margin
- Margin rate calculation with progress indicator
- Valuation amounts and forecasts

### 2. Tasks Metrics

- Total price and TJM rates (estimated, valued, forecast)
- Consumption tracking and efficiency calculations
- Remaining tasks and margin analysis
- Exceptional tasks indicator

### 3. Trading

- Sold prices and valuation amounts
- Margin calculations for trading activities
- Forecast data for trading metrics

### 4. Expenses

- Expense valuation and margin tracking
- Margin rate with visual progress indicator
- Rebillable amounts and pending valuations

### 5. Invoicing & Contracts

- Invoice status and payment tracking
- Provisions management
- Contract information and subcontractor data

### 6. Project Management

- Project managers and team information
- Customer and final customer details
- Activity and deal information
- Project status and update history

## Styling

The component uses Tailwind CSS with shadcn/ui components:

- `Card`, `CardHeader`, `CardTitle`, `CardContent` for layout
- `Badge` for status indicators
- `Progress` for percentage visualizations
- `Separator` for section divisions
- Responsive grid layouts with proper spacing

## Accessibility Features

- Semantic HTML structure
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly content
- Color contrast compliance
- Focus management

## Internationalization

The component supports full i18n with keys under `projects.atimeus.*`:

- Section titles and labels
- Metric descriptions
- Status indicators
- Error messages

## Performance Optimizations

- `useMemo` for expensive calculations
- Conditional rendering for optional data
- Efficient state management with `useState`
- Proper error boundaries and loading states

## Error Handling

- Graceful degradation when data is missing
- User-friendly error messages
- Retry functionality for failed operations
- Loading states during data fetching

## Best Practices Applied

1. **TypeScript**: Full type safety with proper interfaces
2. **React Hooks**: Efficient use of `useState`, `useMemo`
3. **Next.js**: Client-side component with proper imports
4. **Performance**: Memoized calculations and conditional rendering
5. **Accessibility**: WCAG compliant implementation
6. **Internationalization**: Comprehensive i18n support
7. **Responsive Design**: Mobile-first approach
8. **Error Handling**: Comprehensive error boundaries
9. **Code Organization**: Clean, maintainable structure
10. **UI/UX**: Intuitive collapsible sections and clear visual hierarchy
