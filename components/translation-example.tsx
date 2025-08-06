'use client';

import { Dictionary } from '@/locales/dictionary';
import { useI18n } from '@/lib/i18n/use-i18n';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface TranslationExampleProps {
  dictionary: Dictionary;
  memberCount: number;
  documentCount: number;
}

/**
 * Example component demonstrating how to use the i18n utilities
 */
export function TranslationExample({
  dictionary,
  memberCount = 5,
  documentCount = 12
}: TranslationExampleProps) {
  // Use our custom i18n hook
  const { t, formatPlural, formatDate, formatNumber, locale, isRTL } = useI18n(dictionary);

  // Sample date for demonstration
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  return (
    <Card className={isRTL ? 'rtl' : 'ltr'}>
      <CardHeader>
        <CardTitle>{t('app.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">{t('teams.title')}</h3>
          <p>
            {/* Example of using formatPlural */}
            {formatPlural(memberCount, 'members')}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">{t('documents.title')}</h3>
          <p>
            {/* Another example of formatPlural with a different count */}
            {formatPlural(documentCount, 'documents')}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">{t('dates.today')}</h3>
          <p>
            {/* Example of date formatting */}
            {formatDate(today, 'full')}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">{t('dates.tomorrow')}</h3>
          <p>
            {/* Example of short date formatting */}
            {formatDate(tomorrow, 'short')}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">{t('messages.welcome')}</h3>
          {/* Example of variable interpolation in a translation */}
          <p>{t('birthdaysAndAnniversaries.anniversary', { count: 5 })}</p>
        </div>

        <div className="text-xs text-muted-foreground mt-4">
          {/* Display current locale */}
          Current locale: {locale.toUpperCase()}
        </div>
      </CardContent>
    </Card>
  );
}