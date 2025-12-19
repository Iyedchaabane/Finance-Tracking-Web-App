import { getCurrencyLocale } from './currencyUtils';

/**
 * Maps language code to standard locale for date/time formatting.
 */
const localeMap = {
    'en': 'en-US',
    'ar': 'ar-SA',
    'fr': 'fr-FR'
};

/**
 * Formats a numeric amount into a localized currency string.
 * 
 * @param {number} amount - value to format
 * @param {string} currency - 3-letter currency code (e.g., 'USD')
 * @param {string} language - 2-letter language code (e.g., 'en')
 * @returns {string} - localized currency string
 */
export const formatCurrency = (amount, currency = 'USD', language = 'en') => {
    try {
        const locale = getCurrencyLocale(currency, language);
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency || 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount || 0);
    } catch (error) {
        console.error("Error formatting currency:", error);
        return `${currency} ${amount}`;
    }
};

/**
 * Formats an ISO date string into a localized short date.
 * 
 * @param {string} dateString - ISO date string
 * @param {string} language - 2-letter language code
 * @returns {string} - localized short date
 */
export const formatDate = (dateString, language = 'en') => {
    if (!dateString) return '';
    try {
        const locale = localeMap[language] || 'en-US';
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(new Date(dateString));
    } catch (error) {
        console.error("Error formatting date:", error);
        return dateString;
    }
};

/**
 * Checks if a JWT token is expired.
 * 
 * @param {string} token - JWT token string
 * @returns {boolean} - true if expired or invalid, false otherwise
 */
export const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const { exp } = JSON.parse(jsonPayload);
        if (!exp) return false; // If no exp claim, assume not expired

        const currentTime = Math.floor(Date.now() / 1000);
        return exp < currentTime;
    } catch (error) {
        console.error("Error decoding token:", error);
        return true;
    }
};
