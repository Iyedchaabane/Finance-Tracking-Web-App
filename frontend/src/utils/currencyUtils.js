/**
 * Utility for currency-specific metadata and locale mapping.
 * 
 * This module ensures that currency formatting uses standard international locales
 * that correctly pair a specific currency with the user's selected language.
 */

/**
 * Maps a currency and language combination to a specific BCP 47 locale.
 * 
 * Examples:
 * - EUR + en -> en-DE (English formatting for Europe)
 * - TND + ar -> ar-TN (Arabic formatting for Tunisia)
 * - TND + fr -> fr-TN (French formatting for Tunisia)
 * 
 * @param {string} currency - 3-letter currency code (e.g., 'USD')
 * @param {string} language - 2-letter language code (e.g., 'en')
 * @returns {string} - Full BCP 47 locale string
 */
export const getCurrencyLocale = (currency, language) => {
    const normalizedLang = (language || 'en').toLowerCase();
    const normalizedCurr = (currency || 'USD').toUpperCase();

    const localeMap = {
        'EUR': {
            'en': 'en-IE',
            'fr': 'fr-FR',
            'ar': 'ar-FR'
        },
        'USD': {
            'en': 'en-US',
            'fr': 'fr-CA',
            'ar': 'ar-US'
        },
        'TND': {
            'en': 'en-TN',
            'fr': 'fr-TN',
            'ar': 'ar-TN'
        },
        'GBP': {
            'en': 'en-GB',
            'fr': 'fr-GB',
            'ar': 'ar-GB'
        }
    };

    return localeMap[normalizedCurr]?.[normalizedLang] || `${normalizedLang}-${normalizedCurr.substring(0, 2)}`;
};

/**
 * Returns the symbol for a given currency code.
 * 
 * @param {string} currency - 3-letter currency code
 * @returns {string} - Currency symbol
 */
export const getCurrencySymbol = (currency) => {
    const symbols = {
        'USD': '$',
        'EUR': '€',
        'TND': 'د.ت',
        'GBP': '£'
    };
    return symbols[currency.toUpperCase()] || currency;
};

/**
 * List of currencies supported by the application.
 */
export const SUPPORTED_CURRENCIES = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'TND', name: 'Tunisian Dinar', symbol: 'د.ت' },
    { code: 'GBP', name: 'British Pound', symbol: '£' }
];
