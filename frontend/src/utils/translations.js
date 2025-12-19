export const translations = {
    en: {
        // Nav
        dashboard: 'Dashboard',
        transactions: 'Transactions',
        categories: 'Categories',
        settings: 'Settings',
        // Dashboard
        totalBalance: 'Total Balance',
        totalIncome: 'Total Income',
        totalExpenses: 'Total Expenses',
        spendingAnalysis: 'Spending Analysis',
        expenseByCategory: 'Expense by Category',
        recentTransactions: 'Recent Transactions',
        viewAll: 'View All',
        addTransaction: 'Add Transaction',
        // Transactions
        searchPlaceholder: 'Search transactions...',
        allTypes: 'All Types',
        income: 'Income',
        expense: 'Expense',
        addNew: 'Add New',
        date: 'Date',
        category: 'Category',
        description: 'Description',
        amount: 'Amount',
        type: 'Type',
        noTransactions: 'No transactions found matching your criteria.',
        // Categories
        manageCategories: 'Manage Categories',
        addCategory: 'Add Category',
        total: 'Total:',
        // Settings
        appearance: 'Appearance',
        currency: 'Currency',
        language: 'Language',
        light: 'Light',
        dark: 'Dark',
        // Modals
        addTransactionTitle: 'Add New Transaction',
        addCategoryTitle: 'Add New Category',
        fillAll: 'Please fill all fields',
        cancel: 'Cancel',
        save: 'Save',
        saveTransaction: 'Save Transaction',
        saveCategory: 'Save Category',
        // Header
        search: 'Search...',
        logout: 'Logout',
        notifications: 'Notifications',
        noNotifications: 'No new notifications',
        profile: 'Profile',
    },
    ar: {
        // Nav
        dashboard: 'لوحة القيادة',
        transactions: 'المعاملات',
        categories: 'الفئات',
        settings: 'الإعدادات',
        // Dashboard
        totalBalance: 'الرصيد الإجمالي',
        totalIncome: 'مجموع الدخل',
        totalExpenses: 'مجموع المصاريف',
        spendingAnalysis: 'تحليل الإنفاق',
        expenseByCategory: 'المصاريف حسب الفئة',
        recentTransactions: 'أحدث المعاملات',
        viewAll: 'عرض الكل',
        addTransaction: 'إضافة معاملة',
        // Transactions
        searchPlaceholder: 'بحث في المعاملات...',
        allTypes: 'كل الأنواع',
        income: 'دخل',
        expense: 'مصروف',
        addNew: 'إضافة جديد',
        date: 'التاريخ',
        category: 'الفئة',
        description: 'الوصف',
        amount: 'المبلغ',
        type: 'النوع',
        noTransactions: 'لا توجد معاملات تطابق بحثك.',
        // Categories
        manageCategories: 'إدارة الفئات',
        addCategory: 'إضافة فئة',
        total: 'المجموع:',
        // Settings
        appearance: 'المظهر',
        currency: 'العملة',
        language: 'اللغة',
        light: 'فاتح',
        dark: 'داكن',
        // Modals
        addTransactionTitle: 'إضافة معاملة جديدة',
        addCategoryTitle: 'إضافة فئة جديدة',
        fillAll: 'يرجى ملء جميع الحقول',
        cancel: 'إلغاء',
        save: 'حفظ',
        saveTransaction: 'حفظ المعاملة',
        saveCategory: 'حفظ الفئة',
        // Header
        search: 'بحث...',
        logout: 'تسجيل خروج',
        notifications: 'الإشعارات',
        noNotifications: 'لا توجد إشعارات جديدة',
        profile: 'الملف الشخصي',
    },
    fr: {
        // Nav
        dashboard: 'Tableau de bord',
        transactions: 'Transactions',
        categories: 'Catégories',
        settings: 'Paramètres',
        // Dashboard
        totalBalance: 'Solde Total',
        totalIncome: 'Revenu Total',
        totalExpenses: 'Dépenses Totales',
        spendingAnalysis: 'Analyse des Dépenses',
        expenseByCategory: 'Dépenses par Catégorie',
        recentTransactions: 'Transactions Récentes',
        viewAll: 'Voir Tout',
        addTransaction: 'Ajouter Transaction',
        // Transactions
        searchPlaceholder: 'Rechercher...',
        allTypes: 'Tous types',
        income: 'Revenu',
        expense: 'Dépense',
        addNew: 'Ajouter',
        date: 'Date',
        category: 'Catégorie',
        description: 'Description',
        amount: 'Montant',
        type: 'Type',
        noTransactions: 'Aucune transaction trouvée.',
        // Categories
        manageCategories: 'Gérer les Catégories',
        addCategory: 'Ajouter Catégorie',
        total: 'Total:',
        // Settings
        appearance: 'Apparence',
        currency: 'Devise',
        language: 'Langue',
        light: 'Clair',
        dark: 'Sombre',
        // Modals
        addTransactionTitle: 'Ajouter une Transaction',
        addCategoryTitle: 'Ajouter une Catégorie',
        fillAll: 'Veuillez remplir tous les champs',
        cancel: 'Annuler',
        save: 'Enregistrer',
        saveTransaction: 'Enregistrer Transaction',
        saveCategory: 'Enregistrer Catégorie',
        // Header
        search: 'Rechercher...',
        logout: 'Déconnexion',
        notifications: 'Notifications',
        noNotifications: 'Pas de nouvelles notifications',
        profile: 'Profil',
    }
};

/**
 * Hook-like function to handle translations based on current language.
 * 
 * @param {string} language - current active language code ('en', 'ar', 'fr')
 * @returns {function} - translate function that takes a key and returns translated string
 */
export const useTranslation = (language) => {
    return (key) => {
        return translations[language]?.[key] || translations['en']?.[key] || key;
    };
};
