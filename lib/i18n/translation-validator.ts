/**
 * Translation validation utilities
 * These functions help ensure consistency across different locale files
 */

import fs from 'fs';
import path from 'path';

type TranslationKey = string | Record<string, any>;

/**
 * Recursively extracts all keys from a nested translation object
 * @param obj The translation object
 * @param prefix Current key prefix
 * @returns Array of flattened keys
 */
export function extractKeys(obj: Record<string, any>, prefix = ''): string[] {
  let keys: string[] = [];
  
  for (const key in obj) {
    const newPrefix = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Recursively extract keys from nested objects
      keys = [...keys, ...extractKeys(obj[key], newPrefix)];
    } else {
      keys.push(newPrefix);
    }
  }
  
  return keys;
}

/**
 * Compares two sets of translation keys and returns missing keys
 * @param sourceKeys Keys from the source/reference translation
 * @param targetKeys Keys from the translation being checked
 * @returns Array of keys missing from the target
 */
export function findMissingKeys(sourceKeys: string[], targetKeys: string[]): string[] {
  return sourceKeys.filter(key => !targetKeys.includes(key));
}

/**
 * Loads a translation file and returns its content as a JSON object
 * @param locale The locale code (e.g., 'en', 'fr')
 * @param namespace The translation namespace
 * @returns The parsed JSON content
 */
export function loadTranslationFile(locale: string, namespace: string): Record<string, any> {
  try {
    const filePath = path.join(process.cwd(), 'locales', locale, `${namespace}.json`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error loading translation file for ${locale}/${namespace}:`, error);
    return {};
  }
}

/**
 * Checks for missing translations in a target locale compared to a source locale
 * @param sourceLocale The reference locale (e.g., 'en')
 * @param targetLocale The locale to check for missing translations (e.g., 'fr')
 * @param namespace The translation namespace to check
 * @returns Object with missing keys and suggestions
 */
export function checkMissingTranslations(
  sourceLocale: string,
  targetLocale: string,
  namespace: string
): { missingKeys: string[], suggestions: Record<string, any> } {
  // Load source and target translation files
  const sourceTranslation = loadTranslationFile(sourceLocale, namespace);
  const targetTranslation = loadTranslationFile(targetLocale, namespace);
  
  // Extract flattened keys from both translations
  const sourceKeys = extractKeys(sourceTranslation);
  const targetKeys = extractKeys(targetTranslation);
  
  // Find keys that are in the source but missing from the target
  const missingKeys = findMissingKeys(sourceKeys, targetKeys);
  
  // Create a suggestions object with the missing translations
  const suggestions: Record<string, any> = {};
  for (const key of missingKeys) {
    const keyParts = key.split('.');
    let current = sourceTranslation;
    let currentSuggestion = suggestions;
    
    // Navigate through the nested structure following the key parts
    for (let i = 0; i < keyParts.length; i++) {
      const part = keyParts[i];
      current = current[part];
      
      if (i === keyParts.length - 1) {
        // Last part, assign the value
        currentSuggestion[part] = current;
      } else {
        // Create nested object if needed
        if (!currentSuggestion[part]) {
          currentSuggestion[part] = {};
        }
        currentSuggestion = currentSuggestion[part];
      }
    }
  }
  
  return { missingKeys, suggestions };
}

/**
 * Creates a merged complete translation object by filling missing translations from source
 * @param targetLocale The target locale to complete
 * @param sourceLocale The source locale to use for missing translations
 * @param namespace The namespace to process
 * @returns Complete translation object
 */
export function createCompleteTranslation(
  targetLocale: string,
  sourceLocale: string,
  namespace: string
): Record<string, any> {
  const targetTranslation = loadTranslationFile(targetLocale, namespace);
  const { suggestions } = checkMissingTranslations(sourceLocale, targetLocale, namespace);
  
  // Deep merge the suggestions into the target translation
  return deepMerge(targetTranslation, suggestions);
}

/**
 * Deep merges source object into target object
 */
function deepMerge(target: Record<string, any>, source: Record<string, any>): Record<string, any> {
  const output = { ...target };
  
  for (const key in source) {
    if (typeof source[key] === 'object' && source[key] !== null && key in target) {
      output[key] = deepMerge(target[key], source[key]);
    } else {
      output[key] = source[key];
    }
  }
  
  return output;
}

/**
 * Writes a translation object to a file
 * @param locale The locale code
 * @param namespace The namespace
 * @param data The translation data to write
 */
export function writeTranslationFile(
  locale: string,
  namespace: string,
  data: Record<string, any>
): void {
  try {
    const dirPath = path.join(process.cwd(), 'locales', locale);
    const filePath = path.join(dirPath, `${namespace}.json`);
    
    // Ensure directory exists
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    // Write the file with pretty formatting
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Successfully wrote ${locale}/${namespace}.json`);
  } catch (error) {
    console.error(`Error writing translation file for ${locale}/${namespace}:`, error);
  }
}