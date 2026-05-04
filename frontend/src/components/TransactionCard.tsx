import { Pencil, Trash2, Calendar, Tag } from 'lucide-react';
import type { Transaction } from '../types';

interface Props {
  transaction: Transaction;
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
}

const categoryEmoji: Record<string, string> = {
  Alimentaire: '🛒', Transport: '🚗', Logement: '🏠', Loisirs: '🎮',
  Santé: '💊', Shopping: '🛍️', Factures: '⚡', Restaurants: '🍽️',
  Salaire: '💼', Freelance: '💻', Cadeau: '🎁', Investissement: '📈', Autre: '📦',
};

const TransactionCard: React.FC<Props> = ({ transaction, onEdit, onDelete }) => {
  const isIncome = transaction.type === 'income';
  const dateFormatted = new Date(transaction.date).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group animate-fade-in">
      {/* Emoji catégorie */}
      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-900 shadow-sm text-lg flex-shrink-0">
        {categoryEmoji[transaction.category] || '📦'}
      </div>

      {/* Infos */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
            {transaction.category}
          </span>
          <span className={isIncome ? 'badge-income' : 'badge-expense'}>
            {isIncome ? 'Revenu' : 'Dépense'}
          </span>
        </div>
        {transaction.note && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{transaction.note}</p>
        )}
        <div className="flex items-center gap-3 mt-1">
          <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
            <Calendar size={11} />
            {dateFormatted}
          </span>
        </div>
      </div>

      {/* Montant */}
      <div className="text-right flex-shrink-0">
        <p className={`text-base font-bold font-mono ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
          {isIncome ? '+' : '-'}{transaction.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={() => onEdit(transaction)}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 transition-all"
          title="Modifier"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={() => onDelete(transaction._id)}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-500 dark:text-red-400 transition-all"
          title="Supprimer"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
};

export default TransactionCard;
