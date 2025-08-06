'use client';

import { useParams } from 'next/navigation';
import { 
  formatPlural, 
  formatDate, 
  formatNumber, 
  formatCurrency, 
  isRTL, 
  getDirection 
} from './format-utils';
import { Dictionary } from '@/locales/dictionary';

/**
 * Custom hook for internationalization utilities within client components
 * Provides easy access to locale information and formatting functions
 */
export function useI18n(dictionary: Dictionary) {
  // Get the current locale from the URL params
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  
  // Direction (LTR or RTL) based on locale
  const dir = getDirection(locale);
  
  return {
    // Basic locale information
    locale,
    dir,
    isRTL: isRTL(locale),
    dictionary,
    
    // Formatting utilities
    formatPlural: (count: number, key: keyof Dictionary['plurals']) => 
      formatPlural(count, key, dictionary, locale),
    
    formatDate: (date: Date, format: 'full' | 'short' = 'full') => 
      formatDate(date, format, dictionary, locale),
      
    formatNumber: (num: number, options?: Intl.NumberFormatOptions) => 
      formatNumber(num, locale, options),
      
    formatCurrency: (amount: number, currency: string = 'USD') => 
      formatCurrency(amount, currency, locale),
      
    // Translation helper with variable interpolation
    t: (key: string, variables?: Record<string, string | number>) => {
      // Parse the dot notation to access nested properties
      const keys = key.split('.');
      let value: any = dictionary;
      
      // Navigate through the nested structure
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) {
          console.warn(`Translation key not found: ${key}`);
          return key; // Return the key as fallback
        }
      }
      
      // If the value is not a string, return it as is
      if (typeof value !== 'string') {
        return value;
      }
      
      // Replace variables in the string if provided
      if (variables) {
        return Object.entries(variables).reduce(
          (acc, [varKey, varValue]) => 
            acc.replace(new RegExp(`{{${varKey}}}`, 'g'), String(varValue)),
          value
        );
      }
      
      return value;
    }
  };
}