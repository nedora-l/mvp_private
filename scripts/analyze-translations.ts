#!/usr/bin/env node
/**
 * Translation Analysis Script
 * 
 * This script analyzes translation files across different locales and generates
 * a report on missing translation keys.
 * 
 * Usage:
 *   npm run analyze-translations
 */

import { 
  checkMissingTranslations, 
  createCompleteTranslation,
  writeTranslationFile
} from '../lib/i18n/translation-validator';
import { locales } from '../middleware';
import path from 'path';
import fs from 'fs';

// Configuration
const SOURCE_LOCALE = 'en'; // Reference locale
const NAMESPACES = ['common', 'home', 'teams']; // Namespaces to check

/**
 * Analyzes translations and logs a report
 */
async function analyzeTranslations() {
  console.log('📊 Translation Analysis Report');
  console.log('==============================');
  console.log(`Reference locale: ${SOURCE_LOCALE}`);
  console.log(`Target locales: ${locales.filter(l => l !== SOURCE_LOCALE).join(', ')}`);
  console.log(`Namespaces: ${NAMESPACES.join(', ')}`);
  console.log('------------------------------');
  
  // Analyze each non-source locale
  for (const locale of locales) {
    if (locale === SOURCE_LOCALE) continue;
    
    console.log(`\n🌐 Locale: ${locale}`);
    let totalMissingKeys = 0;
    
    // Check each namespace
    for (const namespace of NAMESPACES) {
      const { missingKeys } = checkMissingTranslations(SOURCE_LOCALE, locale, namespace);
      totalMissingKeys += missingKeys.length;
      
      console.log(`  📁 ${namespace}.json: ${missingKeys.length} missing keys`);
      
      if (missingKeys.length > 0) {
        console.log('    Missing keys:');
        missingKeys.forEach(key => console.log(`    - ${key}`));
      }
    }
    
    console.log(`  Total missing keys: ${totalMissingKeys}`);
  }
  
  console.log('\n==============================');
}

/**
 * Generates template translation files with missing keys
 */
async function generateTemplates() {
  console.log('🔨 Generating Template Translation Files');
  console.log('========================================');
  
  // Process each non-source locale
  for (const locale of locales) {
    if (locale === SOURCE_LOCALE) continue;
    
    console.log(`\n🌐 Locale: ${locale}`);
    
    // Process each namespace
    for (const namespace of NAMESPACES) {
      // Create complete translation object with missing keys
      const completeTranslation = createCompleteTranslation(locale, SOURCE_LOCALE, namespace);
      
      // Create a template filename to avoid overwriting existing files
      const templatePath = path.join(process.cwd(), 'locales', locale, `${namespace}.template.json`);
      
      // Write the template file
      fs.writeFileSync(templatePath, JSON.stringify(completeTranslation, null, 2), 'utf8');
      console.log(`  ✅ Generated template: ${locale}/${namespace}.template.json`);
    }
  }
  
  console.log('\n========================================');
  console.log('Template files created. These files include all missing translations');
  console.log('filled with values from the source locale. You can use these as a');
  console.log('starting point for completing your translations.');
}

// Run the analysis and template generation
(async function run() {
  try {
    await analyzeTranslations();
    await generateTemplates();
  } catch (error) {
    console.error('Error running translation analysis:', error);
    process.exit(1);
  }
})();