/**
 * Utility functions for internationalization (i18n)
 */

/**
 * Format a date according to the specified locale and options
 */
export function formatDate(date: Date, locale: string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Format a number according to the specified locale and options
 */
export function formatNumber(number: number, locale: string, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(locale, options).format(number);
}

/**
 * Format a currency value according to the specified locale and currency code
 */
export function formatCurrency(amount: number, locale: string, currencyCode: string = 'USD'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
}

/**
 * Format a relative time (e.g., "5 days ago", "in 3 months")
 */
export function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  locale: string,
  options?: Intl.RelativeTimeFormatOptions
): string {
  const rtf = new Intl.RelativeTimeFormat(locale, options);
  return rtf.format(value, unit);
}

/**
 * Interface for plural forms
 */
interface PluralForms {
  zero?: string; // For languages that have a special form for zero
  one: string;   // Singular form (1)
  two?: string;  // For languages that have a special form for two (dual)
  few?: string;  // For languages that have a special form for "few" (e.g., 2-4 in some Slavic languages)
  many?: string; // For languages that have a special form for "many" (e.g., numbers ending in 11-19 in Russian)
  other: string; // Plural form for everything else
}

/**
 * Get the appropriate plural form based on the count and locale
 */
export function getPluralForm(count: number, locale: string, forms: PluralForms): string {
  // Get the plural rule for the locale
  const pluralRules = new Intl.PluralRules(locale);
  const rule = pluralRules.select(count);
  
  // Return the appropriate form or fall back to 'other'
  return forms[rule] || forms.other;
}

/**
 * Get the appropriate ordinal form (1st, 2nd, 3rd, etc.) based on the locale
 */
export function getOrdinalForm(count: number, locale: string, forms: Record<string, string>): string {
  const pluralRules = new Intl.PluralRules(locale, { type: 'ordinal' });
  const rule = pluralRules.select(count);
  
  return forms[rule] || forms.other;
}

/**
 * Compare two strings according to the collation rules of the specified locale
 */
export function compareStrings(a: string, b: string, locale: string, options?: Intl.CollatorOptions): number {
  const collator = new Intl.Collator(locale, options);
  return collator.compare(a, b);
}

/**
 * Direction of text based on locale (RTL or LTR)
 */
export function getTextDirection(locale: string): 'rtl' | 'ltr' {
  // RTL languages
  const rtlLocales = ['ar', 'fa', 'he', 'ur', 'yi', 'dv'];
  const baseLocale = locale.split('-')[0].toLowerCase();
  
  return rtlLocales.includes(baseLocale) ? 'rtl' : 'ltr';
}

/**
 * Get appropriate locale display name
 */
export function getLocaleDisplayName(locale: string, displayLocale?: string): string {
  return new Intl.DisplayNames([displayLocale || locale], { type: 'language' }).of(locale) || locale;
}