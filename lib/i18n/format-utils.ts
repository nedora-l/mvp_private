/**
 * i18n formatting utilities for client components
 * These utilities help format dates, numbers, and plurals correctly based on locale
 */

import { Dictionary } from "@/locales/dictionary";

/**
 * Formats a plural string based on count and locale
 * Handles complex pluralization rules for different languages
 * 
 * @param count The count to determine plural form
 * @param key The plural key in the dictionary (e.g., 'items', 'members')
 * @param dictionary The translation dictionary
 * @param locale The current locale
 * @returns Properly formatted plural string
 */
export function formatPlural(
  count: number,
  key: keyof Dictionary['plurals'],
  dictionary: Dictionary,
  locale: string
): string {
  if (!dictionary.plurals || !dictionary.plurals[key]) {
    // Fallback if the plural key doesn't exist
    return `${count} ${key}`;
  }

  const pluralForms = dictionary.plurals[key];

  // For Arabic which has complex pluralization rules
  if (locale === 'ar') {
    // Arabic has 6 plural forms: zero, one, two, few, many, other
    if (count === 0 && 'zero' in pluralForms) {
      return (pluralForms as { zero: string }).zero.replace('{{count}}', count.toString());
    }
    if (count === 1 && 'one' in pluralForms) {
      return (pluralForms as { one: string }).one.replace('{{count}}', count.toString());
    }
    if (count === 2 && 'two' in pluralForms) {
      return (pluralForms as { two: string }).two.replace('{{count}}', count.toString());
    }
    // For counts 3-10
    if (count >= 3 && count <= 10 && 'few' in pluralForms) {
      return (pluralForms as { few: string }).few.replace('{{count}}', count.toString());
    }
    // For counts 11-99
    if (count >= 11 && count <= 99 && 'many' in pluralForms) {
      return (pluralForms as { many: string }).many.replace('{{count}}', count.toString());
    }
    // Default fallback for other numbers
    if ('other' in pluralForms) {
      return (pluralForms as { other: string }).other.replace('{{count}}', count.toString());
    }
  }
  
  // For French which has two forms: singular and plural
  if (locale === 'fr') {
    if (count <= 1 && 'singular' in pluralForms) {
      return pluralForms.singular.replace('{{count}}', count.toString());
    } else if ('plural' in pluralForms) {
      return pluralForms.plural.replace('{{count}}', count.toString());
    }
  }
  
  // For English and other languages with simple singular/plural
  if (count === 1 && 'singular' in pluralForms) {
    return pluralForms.singular.replace('{{count}}', count.toString());
  } else if ('plural' in pluralForms) {
    return pluralForms.plural.replace('{{count}}', count.toString());
  }
  
  // Final fallback
  return `${count} ${key}`;
}

/**
 * Formats a date according to the specified locale
 * 
 * @param date The date to format
 * @param format The format to use ('full' or 'short')
 * @param dictionary The translation dictionary
 * @param locale The current locale
 * @returns Formatted date string
 */
export function formatDate(
  date: Date,
  format: 'full' | 'short',
  dictionary: Dictionary,
  locale: string
): string {
  try {
    const formatString = format === 'full' 
      ? dictionary.dates.formatFull 
      : dictionary.dates.formatShort;
    
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: format === 'full' ? 'long' : '2-digit',
      year: 'numeric',
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return date.toLocaleDateString(locale);
  }
}

/**
 * Formats a number according to the specified locale
 * 
 * @param number The number to format
 * @param locale The current locale
 * @param options Formatting options
 * @returns Formatted number string
 */
export function formatNumber(
  number: number,
  locale: string,
  options?: Intl.NumberFormatOptions
): string {
  try {
    return new Intl.NumberFormat(locale, options).format(number);
  } catch (error) {
    console.error('Error formatting number:', error);
    return number.toString();
  }
}

/**
 * Formats currency according to the specified locale
 * 
 * @param amount The amount to format
 * @param currency The currency code (e.g., 'USD', 'EUR')
 * @param locale The current locale
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string,
  locale: string
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${amount} ${currency}`;
  }
}

/**
 * Determines if the locale is RTL (Right-to-Left)
 * 
 * @param locale The locale to check
 * @returns Boolean indicating if the locale is RTL
 */
export function isRTL(locale: string): boolean {
  const rtlLocales = ['ar', 'he', 'fa', 'ur'];
  return rtlLocales.includes(locale);
}

/**
 * Gets the direction (ltr/rtl) for the specified locale
 * 
 * @param locale The locale to check
 * @returns The text direction ('ltr' or 'rtl')
 */
export function getDirection(locale: string): 'ltr' | 'rtl' {
  return isRTL(locale) ? 'rtl' : 'ltr';
}