import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu, Plus, Search, Bell, Sun, Moon, LogOut, User, Settings } from 'lucide-react';
import Sidebar from './Sidebar';
import { useFinance } from '../../context/FinanceContext';
import { useTranslation } from '../../utils/translations';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const Layout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout, settings, updateSettings } = useFinance();
    const t = useTranslation(settings.language);
    const location = useLocation();
    const isRTL = settings.language === 'ar';

    // Dropdown States
    const [showProfile, setShowProfile] = useState(false);


    const getPageTitle = () => {
        switch (location.pathname) {
            case '/': return t('dashboard');
            case '/transactions': return t('transactions');
            case '/categories': return t('categories');
            case '/settings': return t('settings');
            default: return '';
        }
    };

    return (
        <div className={clsx("min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-300", { "flex-row-reverse": isRTL })}>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0">
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b dark:border-gray-700 px-6 py-4 flex items-center justify-between transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                            {getPageTitle()}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">

                        {/* Theme Toggle */}
                        <button
                            onClick={() => updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' })}
                            className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-full transition-colors"
                        >
                            {settings.theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>

                        {/* Notification Dropdown */}
                        {/* Notification Dropdown Removed */}

                        {/* Profile Dropdown */}
                        <div className="relative pl-2 border-l dark:border-gray-700">
                            <div
                                onClick={() => {
                                    setShowProfile(!showProfile);
                                }}
                                className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                            >
                                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                            </div>

                            {showProfile && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setShowProfile(false)} />
                                    <div className={clsx(
                                        "absolute top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 z-20 overflow-hidden animate-in slide-in-from-top-2 duration-200",
                                        isRTL ? "left-0" : "right-0"
                                    )}>
                                        <div className="p-4 border-b dark:border-gray-700">
                                            <p className="font-medium text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</p>
                                            <p className="text-xs text-gray-500">{user?.email}</p>
                                        </div>
                                        <div className="p-1">
                                            <Link
                                                to="/settings"
                                                onClick={() => setShowProfile(false)}
                                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                            >
                                                <Settings size={16} />
                                                <span>{t('settings')}</span>
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setShowProfile(false);
                                                }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                                                <LogOut size={16} />
                                                <span>{t('logout')}</span>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-y-auto w-full max-w-7xl mx-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
