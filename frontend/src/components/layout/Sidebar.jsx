import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Layers, Settings, X, Wallet } from 'lucide-react';
import clsx from 'clsx';
import { useFinance } from '../../context/FinanceContext';
import { useTranslation } from '../../utils/translations';

const Sidebar = ({ isOpen, onClose }) => {
    const { settings } = useFinance();
    const t = useTranslation(settings.language);
    const isRTL = settings.language === 'ar';

    const navItems = [
        { icon: LayoutDashboard, label: t('dashboard'), to: '/' },
        { icon: Receipt, label: t('transactions'), to: '/transactions' },
        { icon: Layers, label: t('categories'), to: '/categories' },
        { icon: Settings, label: t('settings'), to: '/settings' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={clsx(
                "fixed inset-y-0 z-50 w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 shadow-xl transition-transform duration-300 lg:translate-x-0 lg:static lg:shadow-none",
                {
                    "-translate-x-full": !isOpen && !isRTL,
                    "translate-x-full": !isOpen && isRTL,
                    "right-0 border-l border-r-0": isRTL,
                    "left-0": !isRTL
                }
            )}>
                <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-3 text-primary-600 dark:text-primary-400">
                        <div className="p-2 bg-blue-500/10 rounded-xl">
                            <Wallet className="w-8 h-8 text-blue-500" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">FinTrack</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 lg:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="px-4 mt-6 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => window.innerWidth < 1024 && onClose()}
                            className={({ isActive }) => clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium shadow-sm"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                            )}
                        >
                            <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
