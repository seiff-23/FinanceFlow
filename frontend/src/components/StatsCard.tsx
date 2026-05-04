import { TrendingUp, TrendingDown, Wallet, LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  amount: number;
  type: 'balance' | 'income' | 'expense';
  subtitle?: string;
}

const icons: Record<Props['type'], LucideIcon> = {
  balance: Wallet,
  income: TrendingUp,
  expense: TrendingDown,
};

const colorMap = {
  balance: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    icon: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40',
    amount: 'text-gray-900 dark:text-gray-100',
  },
  income: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    icon: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    amount: 'text-emerald-600 dark:text-emerald-400',
  },
  expense: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    icon: 'text-red-600 dark:text-red-400',
    iconBg: 'bg-red-100 dark:bg-red-900/40',
    amount: 'text-red-600 dark:text-red-400',
  },
};

const StatsCard: React.FC<Props> = ({ title, amount, type, subtitle }) => {
  const Icon = icons[type];
  const colors = colorMap[type];

  const formatAmount = (val: number) => {
    const formatted = Math.abs(val).toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    if (type === 'balance') {
      return val < 0 ? `-${formatted} €` : `+${formatted} €`;
    }
    return `${formatted} €`;
  };

  return (
    <div className={`card animate-slide-up`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <p className={`text-2xl font-bold font-mono ${colors.amount}`}>
            {formatAmount(amount)}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl ${colors.iconBg} flex items-center justify-center flex-shrink-0`}>
          <Icon size={20} className={colors.icon} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
