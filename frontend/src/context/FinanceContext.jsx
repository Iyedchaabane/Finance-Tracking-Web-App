import { createContext, useContext, useState, useEffect } from 'react';
import { transactionService, categoryService, userSettingsService, authService } from '../services/api';
import { isTokenExpired } from '../utils/helpers';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
    // State
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        if (saved) {
            const userData = JSON.parse(saved);
            if (isTokenExpired(userData.token)) {
                localStorage.removeItem('user');
                return null;
            }
            return userData;
        }
        return null;
    });

    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('settings');
        return saved ? JSON.parse(saved) : {
            currency: 'EUR',
            language: 'en',
            theme: 'light',
        };
    });

    // Effects
    useEffect(() => {
        if (user) {
            fetchData();
        } else {
            setTransactions([]);
            setCategories([]);
        }
    }, [user]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [transRes, catsRes, settingsRes] = await Promise.all([
                transactionService.getAll(0, 100), // Fetching first 100 for now
                categoryService.getAll(),
                userSettingsService.get()
            ]);

            // Normalize types to lowercase for frontend consistency
            // And map backend fields to frontend expectations
            const transactionsData = (transRes.data.content || transRes.data || []).map(t => ({
                ...t,
                type: t.type?.toLowerCase(),
                category: t.transactionCategoryName || t.category
            }));
            const categoriesData = (catsRes.data || []).map(c => ({
                ...c,
                type: c.type?.toLowerCase()
            }));

            setTransactions(transactionsData);
            setCategories(categoriesData);
            setSettings(prev => ({ ...prev, ...settingsRes.data }));
        } catch (err) {
            console.error("Failed to fetch data", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        localStorage.setItem('settings', JSON.stringify(settings));
        // Apply Theme
        if (settings.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        // Apply Direction
        document.documentElement.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = settings.language;
    }, [settings]);

    // Actions
    const login = async (credentials) => {
        const response = await authService.login(credentials);
        const userData = response.data;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        setTransactions([]);
        setCategories([]);
    };

    const addTransaction = async (transaction) => {
        try {
            // Convert to backend format (Uppercase Enum)
            // Ensure date is in ISO format for ZonedDateTime
            const dateObj = new Date(transaction.date);
            const isoDate = dateObj.toISOString();

            const payload = {
                ...transaction,
                type: transaction.type.toUpperCase(),
                date: isoDate
            };
            const response = await transactionService.create(payload);

            // Convert back to frontend format
            const newTransaction = {
                ...response.data,
                type: response.data.type?.toLowerCase(),
                category: response.data.transactionCategoryName || response.data.category
            };
            setTransactions(prev => [newTransaction, ...prev]);
        } catch (err) {
            console.error("Error adding transaction", err);
            throw err;
        }
    };

    const addCategory = async (category) => {
        try {
            // Convert to backend format
            const payload = {
                ...category,
                type: category.type.toUpperCase()
            };
            const response = await categoryService.create(payload);

            // Convert back
            const newCategory = {
                ...response.data,
                type: response.data.type?.toLowerCase()
            };
            setCategories(prev => [...prev, newCategory]);
        } catch (err) {
            console.error("Error adding category", err);
            throw err;
        }
    };

    const deleteCategory = async (id) => {
        try {
            await categoryService.delete(id);
            setCategories(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            console.error("Error deleting category", err);
            throw err;
        }
    };

    const updateSettings = async (newSettings) => {
        try {
            const oldCurrency = settings.currency;
            const oldLanguage = settings.language;

            // Handle Currency Change independently
            if (newSettings.currency && newSettings.currency !== oldCurrency) {
                await updateCurrency(newSettings.currency);
            }

            // Handle Language Change independently
            if (newSettings.language && newSettings.language !== oldLanguage) {
                await updateLanguage(newSettings.language);
            }

            // Handle Other Settings (Theme)
            if (newSettings.theme && newSettings.theme !== settings.theme) {
                setSettings(prev => ({ ...prev, theme: newSettings.theme }));
                await userSettingsService.update({ theme: newSettings.theme });
            }
        } catch (err) {
            console.error("Error updating settings", err);
            setError("Failed to update settings. Please try again.");
        }
    };

    /**
     * Updates only the currency and reloads transactions to get converted amounts.
     */
    const updateCurrency = async (newCurrency) => {
        try {
            const oldCurrency = settings.currency;
            if (oldCurrency === newCurrency) return;

            console.log(`Currency changing from ${oldCurrency} to ${newCurrency}. Processing conversion...`);

            // Optimistic update
            setSettings(prev => ({ ...prev, currency: newCurrency }));

            await userSettingsService.update({ currency: newCurrency });

            // Reload EVERYTHING to ensure all amounts are recalculated from backend
            await fetchData();
            console.log("Transactions converted and reloaded successfully.");
        } catch (err) {
            console.error("Error updating currency", err);
            setError("Currency conversion failed. Data may be inconsistent.");
            throw err;
        }
    };

    /**
     * Updates only the language and direction metadata.
     */
    const updateLanguage = async (newLanguage) => {
        try {
            const oldLanguage = settings.language;
            if (oldLanguage === newLanguage) return;

            console.log(`Language changing to ${newLanguage}`);

            // Optimistic update
            setSettings(prev => ({ ...prev, language: newLanguage }));

            await userSettingsService.update({ language: newLanguage });
            // Language doesn't require a full reload, just local state update
        } catch (err) {
            console.error("Error updating language", err);
            setError("Failed to change language.");
            throw err;
        }
    };

    const getBalance = () => {
        return transactions.reduce((acc, curr) => {
            return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
        }, 0);
    };

    const getIncome = () => {
        return transactions
            .filter(t => t.type === 'income')
            .reduce((acc, curr) => acc + curr.amount, 0);
    };

    const getExpenses = () => {
        return transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, curr) => acc + curr.amount, 0);
    };

    return (
        <FinanceContext.Provider value={{
            user,
            loading,
            error,
            login,
            logout,
            transactions,
            categories,
            settings,
            addTransaction,
            addCategory,
            deleteCategory,
            updateSettings,
            getBalance,
            getIncome,
            getExpenses
        }}>
            {children}
        </FinanceContext.Provider>
    );
};
