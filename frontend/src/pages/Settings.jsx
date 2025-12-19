import { useFinance } from '../context/FinanceContext';
import { Moon, Sun, Monitor, Globe, Wallet, Check } from 'lucide-react';
import clsx from 'clsx';

const Settings = () => {
    const { settings, updateSettings } = useFinance();
    const isRTL = settings.language === 'ar';

    // Debug: Log settings to see what we're comparing
    console.log('Current settings:', settings);

    const themes = [
        { id: 'light', icon: Sun, label: isRTL ? 'فاتح' : 'Light' },
        { id: 'dark', icon: Moon, label: isRTL ? 'داكن' : 'Dark' },
    ];

    const currrencies = [
        { code: 'TND', label: 'TND (د.ت)' },
        { code: 'USD', label: 'USD ($)' },
        { code: 'EUR', label: 'EUR (€)' },
        { code: 'GBP', label: 'GBP (£)' },
        { code: 'EGP', label: 'EGP (ج.م)' },
        { code: 'SAR', label: 'SAR (ر.س)' },
    ];

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'ar', label: 'العربية' },
        { code: 'fr', label: 'Français' },
    ];

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Theme */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                        <Monitor size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {isRTL ? 'المظهر' : 'Appearance'}
                    </h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {themes.map(t => (
                        <button
                            key={t.id}
                            onClick={() => updateSettings({ theme: t.id })}
                            className={clsx(
                                "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all",
                                settings.theme === t.id
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                            )}
                        >
                            <t.icon className={clsx(
                                "w-8 h-8",
                                settings.theme === t.id ? "text-blue-500" : "text-gray-500"
                            )} />
                            <span className={clsx(
                                "font-medium",
                                settings.theme === t.id ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"
                            )}>
                                {t.label}
                            </span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Currency */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                        <Wallet size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {isRTL ? 'العملة' : 'Currency'}
                    </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {currrencies.map(c => (
                        <button
                            key={c.code}
                            onClick={() => updateSettings({ currency: c.code })}
                            className={clsx(
                                "px-4 py-3 rounded-xl border transition-all text-sm font-medium relative",
                                settings.currency === c.code
                                    ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                            )}
                        >
                            {settings.currency === c.code && (
                                <Check className="absolute top-2 right-2 w-4 h-4" />
                            )}
                            {c.label}
                        </button>
                    ))}
                </div>
            </section>

            {/* Language */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                        <Globe size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {isRTL ? 'اللغة' : 'Language'}
                    </h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {languages.map(l => (
                        <button
                            key={l.code}
                            onClick={() => updateSettings({ language: l.code })}
                            className={clsx(
                                "px-4 py-3 rounded-xl border transition-all font-medium relative",
                                settings.language?.toLowerCase() === l.code.toLowerCase()
                                    ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                            )}
                        >
                            {settings.language?.toLowerCase() === l.code.toLowerCase() && (
                                <Check className="absolute top-2 right-2 w-4 h-4" />
                            )}
                            {l.label}
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Settings;
