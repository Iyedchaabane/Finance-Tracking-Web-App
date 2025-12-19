import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate } from '../utils/helpers';
import { useTranslation } from '../utils/translations';
import StatsCard from '../components/dashboard/StatsCard';
import { Wallet, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import clsx from 'clsx';

import { useState, useEffect } from 'react';
import { dashboardService } from '../services/api';

const Dashboard = () => {
    const { transactions, settings, getBalance, getIncome, getExpenses } = useFinance();
    const t = useTranslation(settings.language);
    const balance = getBalance();
    const income = getIncome();
    const expenses = getExpenses();

    const [chartData, setChartData] = useState([]);
    const [pieData, setPieData] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [monthlyRes, categoryRes] = await Promise.all([
                    dashboardService.getMonthlyAnalysis(),
                    dashboardService.getExpenseByCategory()
                ]);

                // Convert backend data to frontend format
                if (monthlyRes.data && Array.isArray(monthlyRes.data)) {
                    const formattedChartData = monthlyRes.data.map(item => ({
                        name: item.name,
                        income: Number(item.income || 0),
                        expense: Number(item.expense || 0)
                    }));
                    setChartData(formattedChartData);
                }

                if (categoryRes.data && Array.isArray(categoryRes.data)) {
                    // Color palette for categories
                    const colorPalette = [
                        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
                        '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
                        '#F8B739', '#52B788', '#E76F51', '#2A9D8F'
                    ];

                    const formattedPieData = categoryRes.data.map((item, index) => {
                        // Check if color is a valid hex code (starts with #)
                        const isValidHexColor = item.color && item.color.startsWith('#') &&
                            item.color !== '#9CA3AF' && item.color !== '#000000';

                        const assignedColor = isValidHexColor
                            ? String(item.color)
                            : colorPalette[index % colorPalette.length];

                        return {
                            name: item.name || 'Unknown',
                            value: Number(item.value || 0),
                            color: assignedColor
                        };
                    });

                    setPieData(formattedPieData);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard charts", error);
            }
        };

        fetchDashboardData();
    }, [transactions]); // Refetch when transactions change

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title={t('totalBalance')}
                    value={formatCurrency(balance, settings.currency, settings.language)}
                    icon={Wallet}
                    colorClass="bg-balance shadow-lg shadow-sky-500/20"
                    delay={0}
                />
                <StatsCard
                    title={t('totalIncome')}
                    value={formatCurrency(income, settings.currency, settings.language)}
                    icon={TrendingUp}
                    colorClass="bg-income shadow-lg shadow-green-500/20"
                    delay={100}
                />
                <StatsCard
                    title={t('totalExpenses')}
                    value={formatCurrency(expenses, settings.currency, settings.language)}
                    icon={TrendingDown}
                    colorClass="bg-expense shadow-lg shadow-red-500/20"
                    delay={200}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        {t('spendingAnalysis')}
                    </h3>
                    <div className="h-[300px] w-full">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    />
                                    <Line type="monotone" dataKey="income" stroke="#16A34A" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                                    <Line type="monotone" dataKey="expense" stroke="#DC2626" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                No data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Expense by Category (Donut Chart) */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        {t('expenseByCategory')}
                    </h3>
                    <div className="h-[300px] w-full">
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                        formatter={(value) => formatCurrency(value, settings.currency, settings.language)}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                No expense data
                            </div>
                        )}
                    </div>
                    {/* Simple Legend */}
                    <div className="flex flex-wrap justify-center gap-3 mt-4">
                        {pieData.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-xs text-gray-600 dark:text-gray-400">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Transactions (Full Width) */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t('recentTransactions')}
                    </h3>
                    <Link to="/transactions" className="text-sm text-blue-500 hover:text-blue-600 font-medium">
                        {t('viewAll')}
                    </Link>
                </div>

                <div className="space-y-0">
                    {transactions.slice(0, 5).map((t) => (
                        <div key={t.id} className="flex items-center justify-between group p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b last:border-0 border-gray-50 dark:border-gray-700">
                            <div className="flex items-center gap-4">
                                <div className={clsx(
                                    "w-12 h-12 rounded-full flex items-center justify-center text-xl",
                                    t.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                )}>
                                    {t.type === 'income' ? '💰' : '🛒'}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
                                        {t.description}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {formatDate(t.date, settings.language)} • {t.category}
                                    </p>
                                </div>
                            </div>
                            <span className={clsx(
                                "font-bold text-base",
                                t.type === 'income' ? 'text-green-600' : 'text-red-600'
                            )}>
                                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, settings.currency, settings.language)}
                            </span>
                        </div>
                    ))}
                </div>

                <Link to="/transactions" className="mt-6 w-full py-2 flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Plus size={18} />
                    <span className="text-sm font-medium">{t('addTransaction')}</span>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
