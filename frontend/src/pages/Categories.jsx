import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/helpers';
import Modal from '../components/ui/Modal';
import AddCategoryForm from '../components/categories/AddCategoryForm';
import { Plus, Layers, Trash2, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

const Categories = () => {
    const { categories, transactions, settings, deleteCategory } = useFinance();
    const [isModalOpen, setModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const isRTL = settings.language === 'ar';

    const handleDeleteClick = (id) => {
        setCategoryToDelete(id);
    };

    const confirmDelete = async () => {
        if (categoryToDelete) {
            try {
                await deleteCategory(categoryToDelete);
                setCategoryToDelete(null);
            } catch (err) {
                alert('Failed to delete category');
            }
        }
    };

    const getCategoryTotal = (categoryName) => {
        return transactions
            .filter(t => t.category === categoryName)
            .reduce((acc, curr) => acc + curr.amount, 0);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {isRTL ? "إدارة الفئات" : "Manage Categories"}
                </h2>
                <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={18} />
                    <span>{isRTL ? "فئة جديدة" : "Add Category"}</span>
                </button>
            </div>

            {categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
                        <Layers size={40} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                        {isRTL ? "لا توجد فئات" : "No Categories Found"}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm text-sm">
                        {isRTL ? "ابدأ بإضافة فئة جديدة لتنظيم معاملاتك" : "Start by adding a new category to organize your transactions."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.map((c) => {
                        const total = getCategoryTotal(c.name);
                        return (
                            <div key={c.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600 dark:hover:border-gray-500 hover:shadow-md hover:scale-[1.02] transition-all duration-200 group relative">
                                {/* Type Badge - Top Right (LTR) / Top Left (RTL) */}
                                <span className={clsx(
                                    "absolute top-4 ltr:right-4 rtl:left-4 px-2.5 py-1 rounded-full text-xs font-medium",
                                    c.type === 'income' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                )}>
                                    {c.type === 'income' ? (isRTL ? 'دخل' : 'Income') : (isRTL ? 'مصروف' : 'Expense')}
                                </span>

                                {/* Icon - Top Left (LTR) / Top Right (RTL) */}
                                <div className={clsx("w-12 h-12 flex items-center justify-center rounded-xl text-2xl mb-4", c.color)}>
                                    {c.icon}
                                </div>

                                <div className="space-y-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{c.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {formatCurrency(total, settings.currency, settings.language)}
                                    </p>
                                </div>

                                {/* Delete Button - Bottom Right (LTR) / Bottom Left (RTL) */}
                                {c.name !== "Archived Transactions" && (
                                    <button
                                        onClick={() => handleDeleteClick(c.id)}
                                        className="absolute bottom-4 ltr:right-4 rtl:left-4 p-2 text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10"
                                        title={isRTL ? "حذف" : "Delete"}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                title={isRTL ? "إضافة فئة جديدة" : "Add New Category"}
            >
                <AddCategoryForm onClose={() => setModalOpen(false)} />
            </Modal>

            {/* Confirmation Modal */}
            <Modal
                isOpen={!!categoryToDelete}
                onClose={() => setCategoryToDelete(null)}
                title={isRTL ? "تأكيد الحذف" : "Confirm Deletion"}
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded-xl border border-amber-200 dark:border-amber-800">
                        <AlertTriangle className="shrink-0" size={24} />
                        <p className="text-sm">
                            {isRTL
                                ? "هل أنت متأكد من حذف هذه الفئة؟ سيتم نقل جميع المعاملات المرتبطة بها إلى 'المعاملات المؤرشفة'."
                                : "Are you sure you want to delete this category? All linked transactions will be moved to 'Archived Transactions'."}
                        </p>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={() => setCategoryToDelete(null)}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            {isRTL ? "إلغاء" : "Cancel"}
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                            <span>{isRTL ? "حذف" : "Delete"}</span>
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Categories;
