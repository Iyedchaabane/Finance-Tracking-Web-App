import { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import clsx from 'clsx';

const AddCategoryForm = ({ onClose }) => {
    const { addCategory, settings } = useFinance();
    const isRTL = settings.language === 'ar';

    const [formData, setFormData] = useState({
        name: '',
        type: 'expense',
        icon: '📦',
        color: 'bg-gray-100 text-gray-600'
    });

    const icons = ['💰', '🛒', '🚗', '🏠', '🎬', '💡', '🍽️', '🛍️', '💊', '📚', '🎁', '💻', '✈️', '🎮'];
    const colors = [
        { label: 'Red', value: 'bg-red-100 text-red-600' },
        { label: 'Green', value: 'bg-green-100 text-green-600' },
        { label: 'Blue', value: 'bg-blue-100 text-blue-600' },
        { label: 'Yellow', value: 'bg-yellow-100 text-yellow-600' },
        { label: 'Purple', value: 'bg-purple-100 text-purple-600' },
        { label: 'Pink', value: 'bg-pink-100 text-pink-600' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        addCategory(formData);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
                <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
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
                    onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
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
                    {isRTL ? 'اسم الفئة' : 'Category Name'}
                </label>
                <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {isRTL ? 'أيقونة' : 'Icon'}
                </label>
                <div className="flex flex-wrap gap-2">
                    {icons.map(icon => (
                        <button
                            key={icon}
                            type="button"
                            onClick={() => setFormData({ ...formData, icon })}
                            className={clsx(
                                "w-10 h-10 flex items-center justify-center rounded-lg text-xl transition-all",
                                formData.icon === icon
                                    ? "bg-blue-100 border-2 border-blue-500"
                                    : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                            )}
                        >
                            {icon}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {isRTL ? 'لون' : 'Color'}
                </label>
                <div className="flex gap-2">
                    {colors.map(c => (
                        <button
                            key={c.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, color: c.value })}
                            className={clsx(
                                "w-8 h-8 rounded-full border-2 transition-all",
                                formData.color === c.value ? "border-gray-900 dark:border-white scale-110" : "border-transparent"
                            )}
                        >
                            <div className={clsx("w-full h-full rounded-full", c.value.split(' ')[0])} />
                        </button>
                    ))}
                </div>
            </div>

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
                    {isRTL ? 'حفظ' : 'Save Category'}
                </button>
            </div>
        </form>
    );
};

export default AddCategoryForm;
