/**
 * Represents monthly financial data
 */
export interface MonthlyValue {
  /** Month number (1-12) */
  month: number;
  /** Year */
  year: number;
  /** Financial value for the month */
  value: number;
}

/**
 * Year-to-date financial metrics structure
 */
export interface YearToDateMetrics {
  /** Current total value */
  current: number;
  /** Monthly breakdown values */
  byMonth: MonthlyValue[];
}

/**
 * Complete project financial data response
 * GET /api/v1/projects/{projectId}/financial-summary
 */
export interface ProjectFinancialSummaryDto {
  /** Year-to-date margin data */
  marginYtd: YearToDateMetrics;
  /** Year-to-date revenue data */
  revenuesYtd: YearToDateMetrics;
  /** Year-to-date costs data */
  costsYtd: YearToDateMetrics;
  
  // Project identification
  /** Unique project identifier */
  id: string;
  /** Project name */
  name: string;
  /** Project currency code (e.g., MAD, EUR, USD) */
  currency: string;
  /** Whether the project needs updates */
  toUpdate: boolean;
  
  // Company information
  /** Company identifier */
  companyId: string;
  /** Company name */
  company: string;
  
  // Division information
  /** Division identifier */
  divisionId: string;
  /** Division name */
  division: string;
  
  // Activity information
  /** Activity identifier */
  activityId: string;
  /** Activity name */
  activity: string;
  /** Activity code */
  activityCode: number;
  
  // Project management
  /** Project identifier (same as id) */
  projectId: string;
  /** List of project manager names */
  projectManagers: string[];
  /** List of project manager identifiers */
  projectManagerIds: string[];
  
  // Deal information
  /** Deal identifier */
  dealId: string;
  /** Deal reference number */
  deal: string;
  /** Whether the deal is currently active */
  dealIsActive: boolean;
  
  // Customer information
  /** Customer identifier */
  customerId: string;
  /** Customer name */
  customer: string;
  /** Final customer identifier */
  finalCustomerId: string;
  /** Final customer name */
  finalCustomer: string;
  
  // Project status
  /** Project status identifier */
  projectStatusId: number;
  /** Project status description */
  projectStatus: string;
  
  // Metadata
  /** Current year for calculations */
  currentYear: number;
  /** Custom project data */
  customData: Record<string, unknown>;
  /** Project creation date */
  createDate: string;
  /** Project creator email */
  creator: string;
  /** Last update date */
  updateDate: string;
  /** Last update author email */
  updateAuthor: string;
  
  // Anomalies
  /** Whether the project has anomalies */
  hasAnomalies: boolean;
  /** Number of warning-level anomalies */
  warningAnomaliesCount: number;
  /** Number of info-level anomalies */
  infoAnomaliesCount: number;
  
  // Financial metrics
  /** Current valuation amount */
  valuationAmount: number;
  /** Current valuation cost */
  valuationCost: number;
  /** Current margin amount */
  marginAmount: number;
  /** Forecast margin amount */
  forecastMarginAmount: number;
  
  // Tasks financial data
  /** Total price of all tasks */
  tasksTotalPrice: number;
  /** Estimated daily rate for tasks */
  tasksEstimatedTJM: number;
  /** Valued daily rate for tasks */
  tasksValuedTJM: number;
  /** Forecast daily rate for tasks */
  tasksForecastTJM: number;
  /** Total valued quantity */
  tasksTotalValuedQuantity: number;
  /** Total remaining quantity */
  tasksTotalRemaining: number;
  /** Last total remaining quantity */
  tasksLastTotalRemaining: number;
  /** Total estimated quantity */
  tasksTotalEstimate: number;
  /** Total month consumption */
  tasksTotalMonthConsumption: number;
  /** Total previous months consumption */
  tasksTotalPreviousMonthsConsumption: number;
  /** Total consumption */
  tasksTotalConsumption: number;
  /** Tasks valuation cost */
  tasksValuationCost: number;
  /** Tasks valuation amount */
  tasksValuationAmount: number;
  /** Tasks month valuation amount */
  tasksMonthValuationAmount: number;
  /** Tasks margin amount */
  tasksMarginAmount: number;
  /** Tasks month forecasted quantity */
  tasksMonthForecastedQuantity: number;
  /** Tasks next months forecasted quantity */
  tasksNextMonthsForecastedQuantity: number;
  /** Tasks next months expected forecasted quantity */
  tasksNextMonthsExpectedForecastedQuantity: number;
  /** Tasks total forecasted quantity */
  tasksTotalForecastedQuantity: number;
  /** Tasks forecasted quantity */
  tasksForecastedQuantity: number;
  /** Tasks forecasted quantity delta */
  tasksForecastedQuantityDelta: number;
  /** Tasks advance forecasted quantity */
  tasksAdvanceForecastedQuantity: number;
  /** Whether project has exceptional tasks */
  hasExceptionalTasks: boolean;
  
  // Trading financial data
  /** Trading sold price */
  tradingSoldPrice: number;
  /** Trading valuation cost */
  tradingValuationCost: number;
  /** Trading valuation amount */
  tradingValuationAmount: number;
  /** Trading margin amount */
  tradingMarginAmount: number;
  /** Trading forecast valuation cost */
  tradingForecastValuationCost: number;
  /** Trading forecast valuation amount */
  tradingForecastValuationAmount: number;
  /** Trading forecast margin amount */
  tradingForecastMarginAmount: number;
  
  // Expenses financial data
  /** Expenses valuation amount */
  expensesValuationAmount: number;
  /** Expenses valuation cost */
  expensesValuationCost: number;
  /** Expenses margin amount */
  expensesMarginAmount: number;
  /** Expenses margin rate */
  expensesMarginRate: number;
  /** Expenses to valuate amount */
  expensesToValuateAmount: number;
  /** Expenses to valuate cost */
  expensesToValuateCost: number;
  /** Expenses rebillable amount */
  expensesRebillableAmount: number;
  /** Expenses forecast valuation amount */
  expensesForecastValuationAmount: number;
  /** Expenses forecast valuation cost */
  expensesForecastValuationCost: number;
  /** Expenses forecast margin amount */
  expensesForecastMarginAmount: number;
  
  // Provisions data
  /** Provisions amount */
  provisionsAmount: number;
  /** Provisions invoiced amount */
  provisionsInvoicedAmount: number;
  /** Provisions invoiced percentage */
  provisionsInvoicedPercentage: number;
  /** Provisions paid amount */
  provisionsPaidAmount: number;
  
  // Invoices data
  /** Invoices invoiced amount */
  invoicesInvoicedAmount: number;
  /** Invoices invoiced percentage */
  invoicesInvoicedPercentage: number;
  /** Invoices paid amount */
  invoicesPaidAmount: number;
  
  // Cost provisions data
  /** Costs provisions amount */
  costsProvisionsAmount: number;
  /** Costs provisions invoiced amount */
  costsProvisionsInvoicedAmount: number;
  /** Costs provisions valued cost */
  costsProvisionsValuedCost: number;
  
  // Contracts data
  /** Contracts total amount */
  contractsAmount: number;
  /** Number of active contracts */
  contractsActiveContractsCount: number;
  /** Number of non-billed payment schedules */
  contractsNonBilledPaymentSchedules: number;
  /** Amount of non-billed payment schedules */
  contractsNonBilledPaymentSchedulesAmount: number;
  /** Payment schedules to invoice */
  contractsPaymentSchedulesToInvoice: number;
  /** Number of proforma contracts */
  contractsProformaCount: number;
  
  // Subcontractor contracts data
  /** Subcontractor contracts amount */
  subcontractorContractsAmount: number;
  /** Subcontractor contracts cost */
  subcontractorContractsCost: number;
  /** Number of active subcontractor contracts */
  subcontractorContractsActiveContractsCount: number;
  /** Number of non-billed subcontractor payment schedules */
  subcontractorContractsNonBilledPaymentSchedules: number;
}

/**
 * API response wrapper for project financial summary
 */
export interface ProjectFinancialSummaryResponse {
  data: ProjectFinancialSummaryDto;
  success: boolean;
  message?: string;
  timestamp: string;
}

/**
 * Mock example of ProjectFinancialSummaryDto for testing purposes
 */
export const mockProjectFinancialSummary: ProjectFinancialSummaryDto = {
  marginYtd: {
    current: 0.0,
    byMonth: [
      { month: 1, year: 2025, value: 0.0 },
      { month: 2, year: 2025, value: 0.0 },
      { month: 3, year: 2025, value: 0.0 },
      { month: 4, year: 2025, value: 0.0 },
      { month: 5, year: 2025, value: 0.0 },
      { month: 6, year: 2025, value: 0.0 },
      { month: 7, year: 2025, value: 0.0 },
      { month: 8, year: 2025, value: 0.0 },
      { month: 9, year: 2025, value: 0.0 },
      { month: 10, year: 2025, value: 0.0 },
      { month: 11, year: 2025, value: 0.0 },
      { month: 12, year: 2025, value: 0.0 }
    ]
  },
  revenuesYtd: {
    current: 0.0,
    byMonth: [
      { month: 1, year: 2025, value: 0.0 },
      { month: 2, year: 2025, value: 0.0 },
      { month: 3, year: 2025, value: 0.0 },
      { month: 4, year: 2025, value: 0.0 },
      { month: 5, year: 2025, value: 0.0 },
      { month: 6, year: 2025, value: 0.0 },
      { month: 7, year: 2025, value: 0.0 },
      { month: 8, year: 2025, value: 0.0 },
      { month: 9, year: 2025, value: 0.0 },
      { month: 10, year: 2025, value: 0.0 },
      { month: 11, year: 2025, value: 0.0 },
      { month: 12, year: 2025, value: 0.0 }
    ]
  },
  costsYtd: {
    current: 0.0,
    byMonth: [
      { month: 1, year: 2025, value: 0.0 },
      { month: 2, year: 2025, value: 0.0 },
      { month: 3, year: 2025, value: 0.0 },
      { month: 4, year: 2025, value: 0.0 },
      { month: 5, year: 2025, value: 0.0 },
      { month: 6, year: 2025, value: 0.0 },
      { month: 7, year: 2025, value: 0.0 },
      { month: 8, year: 2025, value: 0.0 },
      { month: 9, year: 2025, value: 0.0 },
      { month: 10, year: 2025, value: 0.0 },
      { month: 11, year: 2025, value: 0.0 },
      { month: 12, year: 2025, value: 0.0 }
    ]
  },
  id: "c10372e4-e8b4-4f74-a1ea-13a652ab4fce",
  name: "DISUN_TMA",
  currency: "MAD",
  toUpdate: false,
  companyId: "4340d6ec-4605-43d7-99da-3579166806dd",
  company: "D&A TECHNOLOGIES",
  divisionId: "945a8a30-07da-490e-85f2-d02c1ccf2d85",
  division: "Equipe Rokia",
  activityId: "b42db26b-7961-4db8-a60b-b88992d9393d",
  activity: "Régie",
  activityCode: 203,
  projectId: "c10372e4-e8b4-4f74-a1ea-13a652ab4fce",
  projectManagers: ["Rokia LAROUSSI"],
  projectManagerIds: ["de4ac454-2c69-4a18-b345-b64a49cd3eb6"],
  dealId: "33529eb1-fad3-453e-93f9-fd73002ba916",
  deal: "0000033",
  dealIsActive: false,
  currentYear: 2024,
  customerId: "8606309f-68e0-4d93-a116-b7c45a32dac6",
  customer: "DISUM",
  finalCustomerId: "8606309f-68e0-4d93-a116-b7c45a32dac6",
  finalCustomer: "DISUM",
  projectStatusId: 3,
  projectStatus: "Inactif",
  customData: {},
  createDate: "2024-05-29T09:46:04.763",
  creator: "ihsane.benkirane@da-tech.ma",
  updateDate: "2025-06-18T15:28:21.14",
  updateAuthor: "pierre-yves.hemery@atimeus.com",
  hasAnomalies: false,
  warningAnomaliesCount: 0,
  infoAnomaliesCount: 0,
  valuationAmount: 0.00,
  valuationCost: 0.00,
  marginAmount: 0.00,
  forecastMarginAmount: 0.00,
  tasksTotalPrice: 100000.00,
  tasksEstimatedTJM: 5000.00,
  tasksValuedTJM: 0.00,
  tasksForecastTJM: 5000.00,
  tasksTotalValuedQuantity: 0.000,
  tasksTotalRemaining: 0.000,
  tasksLastTotalRemaining: 20.000,
  tasksTotalEstimate: 20.000,
  tasksTotalMonthConsumption: 0.000,
  tasksTotalPreviousMonthsConsumption: 8.000,
  tasksTotalConsumption: 8.000,
  tasksValuationCost: 0.00,
  tasksValuationAmount: 0.00,
  tasksMonthValuationAmount: 0.00,
  tasksMarginAmount: 0.00,
  tasksMonthForecastedQuantity: 0.00,
  tasksNextMonthsForecastedQuantity: 0.00,
  tasksNextMonthsExpectedForecastedQuantity: 0.00,
  tasksTotalForecastedQuantity: 8.00,
  tasksForecastedQuantity: 0.00,
  tasksForecastedQuantityDelta: 0.00,
  tasksAdvanceForecastedQuantity: 12.00,
  hasExceptionalTasks: false,
  tradingSoldPrice: 0.00,
  tradingValuationCost: 0.00,
  tradingValuationAmount: 0.00,
  tradingMarginAmount: 0.00,
  tradingForecastValuationCost: 0.00,
  tradingForecastValuationAmount: 0.00,
  tradingForecastMarginAmount: 0.00,
  expensesValuationAmount: 0.00,
  expensesValuationCost: 0.00,
  expensesMarginAmount: 0.00,
  expensesMarginRate: 0.0000,
  expensesToValuateAmount: 0.00,
  expensesToValuateCost: 0.00,
  expensesRebillableAmount: 0.00,
  expensesForecastValuationAmount: 0.00,
  expensesForecastValuationCost: 0.00,
  expensesForecastMarginAmount: 0.00,
  provisionsAmount: 0.00,
  provisionsInvoicedAmount: 0.00,
  provisionsInvoicedPercentage: 0.0000,
  provisionsPaidAmount: 0.00,
  invoicesInvoicedAmount: 0.0000,
  invoicesInvoicedPercentage: 0.0000,
  invoicesPaidAmount: 0.00,
  costsProvisionsAmount: 0.00,
  costsProvisionsInvoicedAmount: 0.00,
  costsProvisionsValuedCost: 0.00,
  contractsAmount: 0.00,
  contractsActiveContractsCount: 0,
  contractsNonBilledPaymentSchedules: 0,
  contractsNonBilledPaymentSchedulesAmount: 0.00,
  contractsPaymentSchedulesToInvoice: 0,
  contractsProformaCount: 0,
  subcontractorContractsAmount: 0.00,
  subcontractorContractsCost: 0.00,
  subcontractorContractsActiveContractsCount: 0,
  subcontractorContractsNonBilledPaymentSchedules: 0
};

/**
 * Mock example of ProjectFinancialSummaryResponse for testing purposes
 */
export const mockProjectFinancialSummaryResponse: ProjectFinancialSummaryResponse = {
  data: mockProjectFinancialSummary,
  success: true,
  message: "Project financial summary retrieved successfully",
  timestamp: new Date().toISOString()
};
