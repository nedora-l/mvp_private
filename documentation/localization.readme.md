# Next.js App Router Localization Guide

This document outlines the localization strategy implemented in this Next.js project (using the App Router) and provides a guide on how to replicate this setup in other Next.js applications.

## 1. Overview

The localization strategy is built around Next.js middleware for locale detection and routing, JSON files for storing translations, and a combination of server-side and client-side utilities for accessing these translations in a type-safe manner.

**Key Features:**

*   **Middleware-driven locale detection:** Uses `negotiator` and `@formatjs/intl-localematcher`.
*   **Path-based localization:** Locales are part of the URL (e.g., `/en/about`, `/fr/about`).
*   **JSON-based translation files:** Easy to manage and update.
*   **Type-safe dictionary:** TypeScript interface for translation keys.
*   **Server-side rendering (SSR) of translations:** `getDictionary` function for Server Components.
*   **Client-side hook:** `useI18n` for easy access in Client Components.
*   **Formatting utilities:** For dates, numbers, plurals, etc., respecting the current locale.

## 2. Core Components & File Structure

Here's a typical file structure for this localization setup:

```
.
├── app/
│   └── [locale]/                # Dynamic route for locale
│       ├── layout.tsx           # Locale-specific layout
│       └── page.tsx             # Locale-specific page
├── components/
│   └── translation-example.tsx  # Example component using i18n
├── lib/
│   ├── constants/
│   │   └── global.ts            # Defines supported locales, default locale
│   └── i18n/
│       ├── use-i18n.ts          # Custom hook for Client Components
│       └── format-utils.ts      # Formatting helper functions (dates, numbers, etc.)
├── locales/
│   ├── dictionaries.ts          # Loads translation files (getDictionary function)
│   ├── dictionary.ts            # TypeScript interface for translations
│   ├── en/
│   │   └── common.json          # English translations
│   ├── fr/
│   │   └── common.json          # French translations
│   └── ar/
│       └── common.json          # Arabic translations
├── middleware.ts                # Handles locale detection and redirection
└── package.json                 # Project dependencies
```

## 3. Step-by-Step Implementation Guide

### Step 1: Install Dependencies

Install the necessary packages for locale detection and matching:

```bash
npm install negotiator @formatjs/intl-localematcher
# or
yarn add negotiator @formatjs/intl-localematcher
# or
pnpm add negotiator @formatjs/intl-localematcher
```

Your `package.json` should include:

```json
{
  "dependencies": {
    "@formatjs/intl-localematcher": "^0.x.x",
    "negotiator": "^0.x.x",
    // ... other dependencies
  }
}
```

### Step 2: Define Locale Constants

Create a file for global constants, including your supported locales and the default locale.

**File:** `lib/constants/global.ts`

```typescript
export const DEFAULT_LOCALE = "en"; // Your default language
export const SUPPORTED_LOCALES = ["en", "fr", "ar"]; // Your supported languages

// Example:
// export const TOKEN_STORAGE_KEY = "app-auth-token"; // Other constants
```

### Step 3: Configure Middleware for Locale Detection

The middleware will detect the user's preferred locale and redirect them accordingly.

**File:** `middleware.ts` (at the root of your project or in `src/`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import { match } from '@formatjs/intl-localematcher';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/lib/constants/global'; // Adjust path if needed

// Function to get locale from request headers
function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const locales: string[] = SUPPORTED_LOCALES;
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  return match(languages, locales, DEFAULT_LOCALE); // Find best match
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip if this request is for an asset, API route, etc.
  const PUBLIC_FILE = /\.(.*)$/; // Matches files with extensions (e.g. .jpg, .svg)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return;
  }

  // Check if pathname already has a supported locale
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    // If the path already has a locale, and it's a protected route, you might add auth checks here.
    // For example, the current project's middleware includes authentication logic:
    // const isProtectedRoute = /^\/(en|fr|ar)\/app(?:\/.*)?$/.test(pathname) && !pathname.endsWith('/auth/login');
    // if (isProtectedRoute) { /* ... authentication logic ... */ }
    return; // No redirection needed if locale is present and valid
  }

  // Redirect to include the locale in the path
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`; // Ensure leading slash for pathname if missing

  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|static|.*\\.).*)', // Adjust if you have other paths to skip
    // Optional: only run on root (/) URL
    // '/'
  ],
};
```

### Step 4: Define the Dictionary TypeScript Interface

Create an interface that defines the structure of your translation objects. This ensures type safety.

**File:** `locales/dictionary.ts`

```typescript
// Example structure, adapt to your needs
export interface Dictionary {
  app: {
    title: string;
    description?: string;
  };
  navigation: {
    home: string;
    products: string;
    // ... more navigation items
  };
  common: {
    submit: string;
    cancel: string;
    loading: string;
    // ... more common terms
  };
  errors: {
    notFound: string;
    generic: string;
  };
  // You can add more specific sections as your application grows
  // For example, translations for a specific feature or page:
  productPage: {
    title: string;
    addToCart: string;
  };
  // For plurals, you might define a structure like this,
  // which can be consumed by a formatting utility.
  plurals: {
    itemCount: { // key for the item
      one: string;    // "1 item"
      other: string;  // "{{count}} items"
    };
    // ... other pluralizable strings
  };
  // For messages with placeholders:
  greetings: {
    welcome: string; // "Hello, {{name}}!"
  };
  // Add all keys that your application will use.
  // The structure should match your JSON translation files.
  [key: string]: any; // Allow for nested structures not explicitly defined for flexibility
}
```
*Self-correction: The provided `locales/dictionary.ts` in the attachments is much more detailed. The generated documentation should reflect a more comprehensive example or refer to the project's specific structure.*
*Revising the Dictionary interface example to be more generic but hint at complexity.*

**File:** `locales/dictionary.ts` (Revised Example)
```typescript
export interface Dictionary {
  // Define top-level categories for your translations
  app: {
    title: string;
    description?: string;
  };
  navigation: {
    home: string;
    products: string;
    // ... more navigation items
  };
  common: {
    submit: string;
    cancel: string;
    loading: string;
    // ... more common terms
  };
  errors: {
    notFound: string;
    generic: string;
  };
  // You can add more specific sections as your application grows
  // For example, translations for a specific feature or page:
  productPage: {
    title: string;
    addToCart: string;
  };
  // For plurals, you might define a structure like this,
  // which can be consumed by a formatting utility.
  plurals: {
    itemCount: { // key for the item
      one: string;    // "1 item"
      other: string;  // "{{count}} items"
    };
    // ... other pluralizable strings
  };
  // For messages with placeholders:
  greetings: {
    welcome: string; // "Hello, {{name}}!"
  };
  // Add all keys that your application will use.
  // The structure should match your JSON translation files.
  [key: string]: any; // Allow for nested structures not explicitly defined for flexibility
}
```

### Step 5: Create Translation JSON Files

For each supported locale, create a JSON file containing the translations. The structure should match the `Dictionary` interface.

**File:** `locales/en/common.json` (Example for English)

```json
{
  "app": {
    "title": "My Next.js App",
    "description": "A fantastic application"
  },
  "navigation": {
    "home": "Home",
    "products": "Products"
  },
  "common": {
    "submit": "Submit",
    "cancel": "Cancel",
    "loading": "Loading..."
  },
  "errors": {
    "notFound": "Page not found.",
    "generic": "An unexpected error occurred."
  },
  "productPage": {
    "title": "Our Products",
    "addToCart": "Add to Cart"
  },
  "plurals": {
    "itemCount": {
      "one": "1 item",
      "other": "{{count}} items"
    }
  },
  "greetings": {
    "welcome": "Hello, {{name}}!"
  }
}
```
Create similar files for other locales (e.g., `locales/fr/common.json`, `locales/ar/common.json`).

### Step 6: Implement the Dictionary Loader

Create a function to dynamically load the correct translation file based on the locale.

**File:** `locales/dictionaries.ts`

```typescript
import { Dictionary } from './dictionary'; // Your Dictionary interface
import { DEFAULT_LOCALE } from '@/lib/constants/global'; // Adjust path

// Define how to load each dictionary
// This project uses a single 'common.json' per locale.
// You could extend this to support multiple namespaces (e.g., 'common', 'userProfile').
const dictionaries: Record<string, () => Promise<any>> = {
  en: () => import('./en/common.json').then((module) => module.default),
  fr: () => import('./fr/common.json').then((module) => module.default),
  ar: () => import('./ar/common.json').then((module) => module.default),
  // Add other locales here
};

/**
 * Loads the translation dictionary for the specified locale.
 * Falls back to the default locale if the requested locale is not found or fails to load.
 *
 * @param locale The desired locale (e.g., 'en', 'fr').
 * @returns A Promise resolving to the Dictionary object.
 */
export const getDictionary = async (locale: string): Promise<Dictionary> => {
  const validLocale = locale in dictionaries ? locale : DEFAULT_LOCALE;
  try {
    const dictionaryModule = await dictionaries[validLocale]();
    // Ensure the loaded module is treated as a Dictionary.
    // If your JSON files are directly the Dictionary type, this is fine.
    // If they are nested (e.g. module.default.translations), adjust accordingly.
    return dictionaryModule as Dictionary;
  } catch (error) {
    console.error(`Error loading dictionary for locale "${validLocale}":`, error);
    // Fallback to default locale's dictionary in case of an error
    if (validLocale !== DEFAULT_LOCALE) {
      console.warn(`Falling back to default locale "${DEFAULT_LOCALE}".`);
      try {
        const defaultDictionaryModule = await dictionaries[DEFAULT_LOCALE]();
        return defaultDictionaryModule as Dictionary;
      } catch (defaultError) {
        console.error(`FATAL: Error loading default dictionary for locale "${DEFAULT_LOCALE}":`, defaultError);
        // As a last resort, return a minimal empty dictionary to prevent app crashes.
        // You might want to throw an error or handle this more gracefully.
        return {} as Dictionary; // Or a predefined minimal safe dictionary
      }
    }
    return {} as Dictionary; // Should ideally not be reached if default loads
  }
};
```

### Step 7: Create Formatting Utilities (Optional but Recommended)

Helper functions for formatting dates, numbers, plurals, etc., can be centralized.

**File:** `lib/i18n/format-utils.ts` (Example Structure)

```typescript
import { Dictionary } from '@/locales/dictionary'; // Adjust path

// Basic directionality check
export const isRTL = (locale: string): boolean => ['ar', 'he', 'fa'].includes(locale);
export const getDirection = (locale: string): 'ltr' | 'rtl' => isRTL(locale) ? 'rtl' : 'ltr';

// Date Formatting
export const formatDate = (
  date: Date,
  formatType: 'full' | 'short' = 'full',
  dictionary: Dictionary, // Pass dictionary if format strings are stored there
  locale: string
): string => {
  const options: Intl.DateTimeFormatOptions = formatType === 'full'
    ? { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
    : { year: 'numeric', month: 'short', day: 'numeric' };
  // Example: Using format strings from dictionary (if you store them like 'MM/DD/YYYY')
  // const customFormat = dictionary.dates?.formats?.[formatType];
  // if (customFormat) { /* ... apply custom format ... */ }
  return new Intl.DateTimeFormat(locale, options).format(date);
};

// Number Formatting
export const formatNumber = (
  num: number,
  locale: string,
  options?: Intl.NumberFormatOptions
): string => {
  return new Intl.NumberFormat(locale, options).format(num);
};

// Currency Formatting
export const formatCurrency = (
  amount: number,
  currency: string, // e.g., 'USD', 'EUR'
  locale: string
): string => {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
};

// Plural Formatting
// This example assumes your dictionary.plurals has keys like 'itemCount'
// with 'one' and 'other' sub-keys.
export const formatPlural = (
  count: number,
  key: keyof NonNullable<Dictionary['plurals']>, // e.g., 'itemCount'
  dictionary: Dictionary,
  locale: string
): string => {
  const pluralRules = new Intl.PluralRules(locale);
  const pluralCategory = pluralRules.select(count); // 'one', 'other', 'zero', 'two', 'few', 'many'

  const translations = dictionary.plurals?.[key];
  if (!translations) return `${count} ${key}`; // Fallback

  let translation = translations[pluralCategory as keyof typeof translations] || translations.other;

  // Replace placeholder for count
  return translation.replace(/{{count}}/g, String(count));
};
```
*Note: The project's `use-i18n.ts` directly calls these functions, so their signatures should match.*

### Step 8: Create the `useI18n` Custom Hook (for Client Components)

This hook provides convenient access to translations and formatting functions in Client Components.

**File:** `lib/i18n/use-i18n.ts`

```typescript
'use client';

import { useParams } from 'next/navigation';
import { Dictionary } from '@/locales/dictionary'; // Adjust path
import {
  formatDate,
  formatNumber,
  formatCurrency,
  formatPlural,
  isRTL,
  getDirection,
} from './format-utils'; // Adjust path

export function useI18n(dictionary: Dictionary) {
  const params = useParams();
  // Ensure locale is a string, fallback to a default or handle error if needed
  const locale = typeof params?.locale === 'string' ? params.locale : 'en'; // Fallback to 'en' or your DEFAULT_LOCALE

  // Translation function 't'
  const t = (path: string, variables?: Record<string, string | number>): string => {
    const keys = path.split('.');
    let result: any = dictionary;
    for (const key of keys) {
      result = result?.[key];
      if (result === undefined) {
        console.warn(`Translation key not found: "${path}" for locale "${locale}"`);
        return path; // Return the key itself as a fallback
      }
    }

    if (typeof result !== 'string') {
      // If the result is not a string (e.g., an object or array from the dictionary),
      // it might be an error or an intended non-string value.
      // For simplicity, returning the path. You might want to stringify or handle differently.
      console.warn(`Translation for key "${path}" is not a string.`);
      return path;
    }

    let translatedString = result;
    if (variables) {
      Object.entries(variables).forEach(([varKey, varValue]) => {
        translatedString = translatedString.replace(
          new RegExp(`{{${varKey}}}`, 'g'),
          String(varValue)
        );
      });
    }
    return translatedString;
  };

  return {
    locale,
    dir: getDirection(locale),
    isRTL: isRTL(locale),
    dictionary, // The full dictionary if needed
    t,
    // Bound formatting functions
    formatDate: (date: Date, format: 'full' | 'short' = 'full') =>
      formatDate(date, format, dictionary, locale),
    formatNumber: (num: number, options?: Intl.NumberFormatOptions) =>
      formatNumber(num, locale, options),
    formatCurrency: (amount: number, currency: string) =>
      formatCurrency(amount, currency, locale),
    formatPlural: (count: number, key: keyof NonNullable<Dictionary['plurals']>) =>
      formatPlural(count, key, dictionary, locale),
  };
}
```

### Step 9: Set Up `app/[locale]` Directory and Layout

Create a dynamic route segment `[locale]` in your `app` directory.

**File:** `app/[locale]/layout.tsx`

```typescript
import { ReactNode } from 'react';
import { getDictionary } from '@/locales/dictionaries'; // Adjust path
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/lib/constants/global'; // Adjust path
import { getDirection } from '@/lib/i18n/format-utils'; // Adjust path

// This function can be used to generate static paths for each locale
export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: LocaleLayoutProps) {
  // Validate locale or use default (middleware should handle this, but good for safety)
  const currentLocale = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  // const dictionary = await getDictionary(currentLocale); // Load dictionary if needed globally in layout

  return (
    <html lang={currentLocale} dir={getDirection(currentLocale)}>
      <body>
        {/*
          You can pass the dictionary to a Context Provider here if many
          Client Components deep in the tree need it without prop drilling.
          Or, fetch it in specific Server Components and pass as props.
        */}
        {children}
      </body>
    </html>
  );
}
```

**File:** `app/[locale]/page.tsx` (Example Home Page)

```typescript
import { getDictionary } from '@/locales/dictionaries'; // Adjust path
import { Dictionary } from '@/locales/dictionary'; // Adjust path
// import { TranslationExample } from '@/components/translation-example'; // If you have an example component

interface HomePageProps {
  params: { locale: string };
}

export default async function HomePage({ params: { locale } }: HomePageProps) {
  const dictionary = await getDictionary(locale);

  return (
    <div>
      <h1>{dictionary.app.title}</h1>
      <p>{dictionary.navigation.home}</p>
      {/* Example of passing dictionary to a Client Component */}
      {/* <TranslationExample dictionary={dictionary} memberCount={5} documentCount={10} /> */}
    </div>
  );
}
```

### Step 10: Using Translations

**In Server Components:**

Fetch the dictionary using `getDictionary` and access translations directly.

```typescript
// app/[locale]/some-server-page.tsx
import { getDictionary } from '@/locales/dictionaries';

export default async function SomeServerPage({ params: { locale } }: { params: { locale: string }}) {
  const dict = await getDictionary(locale);
  return (
    <div>
      <h2>{dict.common.submit}</h2>
      <p>{dict.greetings.welcome.replace('{{name}}', 'Guest')}</p>
    </div>
  );
}
```

**In Client Components:**

1.  Fetch the dictionary in the nearest parent Server Component and pass it as a prop.
2.  Use the `useI18n` hook.

```typescript
// components/my-client-component.tsx
'use client';

import { Dictionary } from '@/locales/dictionary';
import { useI18n } from '@/lib/i18n/use-i18n'; // Adjust path

interface MyClientComponentProps {
  dictionary: Dictionary; // Passed from a Server Component
}

export function MyClientComponent({ dictionary }: MyClientComponentProps) {
  const { t, formatDate, locale, isRTL } = useI18n(dictionary);
  const today = new Date();

  return (
    <div className={isRTL ? 'rtl' : 'ltr'}>
      <p>{t('productPage.addToCart')}</p>
      <p>{t('greetings.welcome', { name: 'User' })}</p>
      <p>Date: {formatDate(today)}</p>
      <p>Current Locale: {locale}</p>
    </div>
  );
}
```
See `components/translation-example.tsx` in this project for a more detailed usage example.

## 4. Adding a New Locale

1.  **Add to Constants:** Add the new locale code (e.g., `"es"` for Spanish) to `SUPPORTED_LOCALES` in `lib/constants/global.ts`.
2.  **Create Translation File:** Create a new JSON file for the locale (e.g., `locales/es/common.json`). Populate it with translations.
3.  **Update Dictionary Loader:** Add an entry for the new locale in the `dictionaries` object in `locales/dictionaries.ts`:
    ```typescript
    // locales/dictionaries.ts
    const dictionaries: Record<string, () => Promise<any>> = {
      // ... existing locales
      es: () => import('./es/common.json').then((module) => module.default),
    };
    ```
4.  **Update Middleware (if necessary):** If your `middleware.ts` `config.matcher` or other logic is locale-specific in a way that needs updating, review it. The provided example `middleware.ts` should work fine as `SUPPORTED_LOCALES` is dynamic.
5.  **Test:** Verify that routing and translations work correctly for the new locale.

## 5. Example: `translation-example.tsx`

This project includes `components/translation-example.tsx`, which demonstrates various features of the `useI18n` hook, including simple translations, pluralization, date formatting, and handling RTL text direction. It's a good reference for seeing the system in action.

```typescript
// Snippet from components/translation-example.tsx
// 'use client';
// import { Dictionary } from '@/locales/dictionary';
// import { useI18n } from '@/lib/i18n/use-i18n';
// // ... other imports

// export function TranslationExample({ dictionary, memberCount, documentCount }) {
//   const { t, formatPlural, formatDate, locale, isRTL } = useI18n(dictionary);
//   // ... component logic using t(), formatPlural(), etc.
// }
```

This guide provides a comprehensive overview of the localization setup used in this project. By following these steps, you can implement a similar robust and type-safe internationalization system in your Next.js App Router applications.
