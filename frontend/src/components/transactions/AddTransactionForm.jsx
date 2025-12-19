import { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import clsx from 'clsx';

const AddTransactionForm = ({ onClose }) => {
    const { addTransaction, categories, settings } = useFinance();
    const isRTL = settings.language === 'ar';

    const [formData, setFormData] = useState({
        amount: '',
        type: 'expense',
        transactionCategoryId: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
    });

    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.amount || !formData.transactionCategoryId || !formData.description) {
            setError(isRTL ? 'يرجى ملء جميع الحقول' : 'Please fill all fields');
            return;
        }

        addTransaction({
            ...formData,
            amount: Number(formData.amount)
        });
        onClose();
    };

    const filteredCategories = categories.filter(c => c.type === formData.type);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
                <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'income', transactionCategoryId: '' }))}
                    className={clsx(
                        "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors",
                        formData.type === 'income'
                            ? "bg-white dark:bg-gray-600 text-green-600 shadow-sm"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                    )}
                >
                    {isRTL ? 'دخل' : 'Income'}
                </button>
                <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'expense', transactionCategoryId: '' }))}
                    className={clsx(
                        "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors",
                        formData.type === 'expense'
                            ? "bg-white dark:bg-gray-600 text-red-600 shadow-sm"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                    )}
                >
                    {isRTL ? 'مصروف' : 'Expense'}
                </button>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {isRTL ? 'المبلغ' : 'Amount'}
                </label>
                <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {isRTL ? 'الفئة' : 'Category'}
                    </label>

                    <select
                        required
                        value={formData.transactionCategoryId}
                        onChange={e => setFormData({ ...formData, transactionCategoryId: e.target.value })}
                        className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">{isRTL ? 'اختر فئة' : 'Select Category'}</option>
                        {filteredCategories.map(c => (
                            <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {isRTL ? 'التاريخ' : 'Date'}
                    </label>
                    <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {isRTL ? 'الوصف' : 'Description'}
                </label>
                <textarea
                    required
                    rows="3"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>

            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}

            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                    {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {isRTL ? 'حفظ' : 'Save Transaction'}
                </button>
            </div>
        </form>
    );
};

export default AddTransactionForm;
