import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Transaction, TransactionFormData, TransactionType } from '../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../types';

interface Props {
  onSubmit: (data: TransactionFormData) => Promise<boolean>;
  onClose: () => void;
  editingTransaction?: Transaction | null;
}

const defaultForm: TransactionFormData = {
  amount: '',
  type: 'expense',
  category: 'Alimentaire',
  date: new Date().toISOString().split('T')[0],
  note: '',
};

const TransactionForm: React.FC<Props> = ({ onSubmit, onClose, editingTransaction }) => {
  const [form, setForm] = useState<TransactionFormData>(defaultForm);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        amount: String(editingTransaction.amount),
        type: editingTransaction.type,
        category: editingTransaction.category,
        date: editingTransaction.date.split('T')[0],
        note: editingTransaction.note || '',
      });
    } else {
      setForm(defaultForm);
    }
  }, [editingTransaction]);

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleTypeChange = (type: TransactionType) => {
    setForm((prev) => ({
      ...prev,
      type,
      category: type === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) return;

    setIsLoading(true);
    const success = await onSubmit(form);
    setIsLoading(false);
    if (success) {
      setForm(defaultForm);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md card animate-slide-up shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {editingTransaction ? 'Modifier la transaction' : 'Nouvelle transaction'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type toggle */}
          <div>
            <label className="label">Type</label>
            <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`flex-1 py-2.5 text-sm font-semibold transition-all ${
                  form.type === 'expense'
                    ? 'bg-red-500 text-white'
                    : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                💸 Dépense
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`flex-1 py-2.5 text-sm font-semibold transition-all ${
                  form.type === 'income'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                💰 Revenu
              </button>
            </div>
          </div>

          {/* Montant */}
          <div>
            <label className="label">Montant (€)</label>
            <input
              type="number"
              className="input-field font-mono"
              placeholder="0.00"
              step="0.01"
              min="0.01"
              value={form.amount}
              onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
              required
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="label">Catégorie</label>
            <select
              className="input-field"
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as any }))}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="label">Date</label>
            <input
              type="date"
              className="input-field"
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              required
            />
          </div>

          {/* Note */}
          <div>
            <label className="label">Note <span className="text-gray-400 font-normal">(optionnel)</span></label>
            <input
              type="text"
              className="input-field"
              placeholder="Ex: Courses du week-end"
              maxLength={200}
              value={form.note}
              onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Annuler
            </button>
            <button type="submit" disabled={isLoading} className="btn-primary flex-1">
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enregistrement...
                </span>
              ) : editingTransaction ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
