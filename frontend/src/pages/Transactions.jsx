import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate } from '../utils/helpers';
import Modal from '../components/ui/Modal';
import AddTransactionForm from '../components/transactions/AddTransactionForm';
import { Plus, Search, Filter } from 'lucide-react';
import clsx from 'clsx';

const Transactions = () => {
    const { transactions, settings } = useFinance();
    const [isModalOpen, setModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');

    const isRTL = settings.language === 'ar';

    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase()) ||
            t.category.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === 'all' || t.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder={isRTL ? "بحث..." : "Search transactions..."}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    >
                        <option value="all">{isRTL ? "الكل" : "All Types"}</option>
                        <option value="income">{isRTL ? "دخل" : "Income"}</option>
                        <option value="expense">{isRTL ? "مصروف" : "Expense"}</option>
                    </select>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline">{isRTL ? "إضافة معاملة" : "Add New"}</span>
                    </button>
                </div>
            </div>

            {/* Table/List */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-4 font-medium">{isRTL ? "التاريخ" : "Date"}</th>
                                <th className="px-6 py-4 font-medium">{isRTL ? "الفئة" : "Category"}</th>
                                <th className="px-6 py-4 font-medium">{isRTL ? "الوصف" : "Description"}</th>
                                <th className="px-6 py-4 font-medium text-right">{isRTL ? "المبلغ" : "Amount"}</th>
                                <th className="px-6 py-4 font-medium text-center">{isRTL ? "النوع" : "Type"}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filteredTransactions.map((t) => (
                                <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                        {formatDate(t.date, settings.language)}
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100 whitespace-nowrap">
                                        <span className="inline-flex items-center gap-2">
                                            <span className="text-lg opacity-80">
                                                {/* We could lookup icon, but for now just text */}
                                                {t.category}
                                            </span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{t.description}</td>
                                    <td className={clsx(
                                        "px-6 py-4 text-right font-medium whitespace-nowrap",
                                        t.type === 'income' ? 'text-green-600' : 'text-red-600'
                                    )}>
                                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, settings.currency, settings.language)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={clsx(
                                            "px-2.5 py-0.5 rounded-full text-xs font-medium",
                                            t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        )}>
                                            {t.type === 'income' ? (isRTL ? 'دخل' : 'Income') : (isRTL ? 'مصروف' : 'Expense')}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredTransactions.length === 0 && (
                        <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                            {isRTL ? "لم يتم العثور على معاملات" : "No transactions found matching your criteria."}
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                title={isRTL ? "إضافة معاملة جديدة" : "Add New Transaction"}
            >
                <AddTransactionForm onClose={() => setModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default Transactions;
