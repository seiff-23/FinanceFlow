import { AlertTriangle, CheckCircle } from 'lucide-react';
import type { Budget } from '../types';

interface Props {
  budget: Budget | null;
  monthExpense: number;
  categoryTotals: { name: string; value: number }[];
}

const BudgetCard: React.FC<Props> = ({ budget, monthExpense, categoryTotals }) => {
  if (!budget || (!budget.globalLimit && budget.categoryBudgets.length === 0)) {
    return (
      <div className="card">
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">Budget mensuel</h3>
        <p className="text-sm text-gray-400 dark:text-gray-500 italic">
          Aucun budget défini. Configurez votre budget dans l'onglet Budget.
        </p>
      </div>
    );
  }

  const globalPct = budget.globalLimit > 0 ? (monthExpense / budget.globalLimit) * 100 : 0;
  const isOverGlobal = budget.globalLimit > 0 && monthExpense > budget.globalLimit;

  return (
    <div className="card animate-fade-in">
      <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">Budget mensuel</h3>

      {/* Budget global */}
      {budget.globalLimit > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Budget global</span>
            <span className={`text-xs font-semibold flex items-center gap-1 ${isOverGlobal ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {isOverGlobal ? <AlertTriangle size={12} /> : <CheckCircle size={12} />}
              {monthExpense.toFixed(0)} / {budget.globalLimit.toFixed(0)} €
            </span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOverGlobal ? 'bg-red-500' : globalPct > 80 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(globalPct, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Budgets par catégorie */}
      {budget.categoryBudgets.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Par catégorie</p>
          {budget.categoryBudgets.map((cb) => {
            const spent = categoryTotals.find((c) => c.name === cb.category)?.value || 0;
            const pct = cb.limit > 0 ? (spent / cb.limit) * 100 : 0;
            const isOver = spent > cb.limit;
            return (
              <div key={cb.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{cb.category}</span>
                  <span className={`text-xs font-semibold flex items-center gap-1 ${isOver ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                    {isOver && <AlertTriangle size={10} />}
                    {spent.toFixed(0)} / {cb.limit.toFixed(0)} €
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOver ? 'bg-red-500' : pct > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BudgetCard;
