import { useState, useEffect, useCallback } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  Plus, Search, Download, Settings, RefreshCw,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import TransactionCard from '../components/TransactionCard';
import TransactionForm from '../components/TransactionForm';
import BudgetCard from '../components/BudgetCard';

import { useTransactions } from '../hooks/useTransactions';
import { useBudget } from '../hooks/useBudget';
import { transactionAPI, generateCSV } from '../services/api';
import { budgetAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import type {
  Transaction, TransactionFormData, DashboardStats, Budget,
} from '../types';
import { EXPENSE_CATEGORIES } from '../types';

const CHART_COLORS = [
  '#10b981','#3b82f6','#f59e0b','#ef4444',
  '#8b5cf6','#06b6d4','#f97316','#84cc16',
  '#ec4899','#6366f1',
];

const TABS = ['dashboard', 'transactions', 'budget'] as const;
type Tab = (typeof TABS)[number];

const DashboardPage: React.FC = () => {
  const { isDark } = useTheme();
  const now = new Date();

  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const { transactions, isLoading: txLoading, fetchTransactions, addTransaction, editTransaction, removeTransaction } = useTransactions();
  const { budget, fetchBudget, saveBudget } = useBudget();

  // Budget form state
  const [budgetForm, setBudgetForm] = useState<Budget>({
    month: selectedMonth, year: selectedYear, globalLimit: 0, categoryBudgets: [],
  });

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Load stats
  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const { data } = await transactionAPI.getStats();
      setStats(data);
    } catch {
      toast.error('Impossible de charger les statistiques');
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  // Load transactions when filters change
  useEffect(() => {
    if (activeTab === 'transactions') {
      fetchTransactions({ month: selectedMonth, year: selectedYear, search: debouncedSearch });
    }
  }, [activeTab, selectedMonth, selectedYear, debouncedSearch, fetchTransactions]);

  // Load budget
  useEffect(() => {
    if (activeTab === 'budget') {
      fetchBudget(selectedMonth, selectedYear);
    }
  }, [activeTab, selectedMonth, selectedYear, fetchBudget]);

  // Sync budget form with loaded budget
  useEffect(() => {
    if (budget) {
      setBudgetForm(budget);
    } else {
      setBudgetForm({ month: selectedMonth, year: selectedYear, globalLimit: 0, categoryBudgets: [] });
    }
  }, [budget, selectedMonth, selectedYear]);

  const handleAddOrEdit = async (formData: TransactionFormData): Promise<boolean> => {
    let ok: boolean;
    if (editingTransaction) {
      ok = await editTransaction(editingTransaction._id, formData);
    } else {
      ok = await addTransaction(formData);
    }
    if (ok) {
      loadStats();
      fetchTransactions({ month: selectedMonth, year: selectedYear, search: debouncedSearch });
    }
    return ok;
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette transaction ?')) return;
    const ok = await removeTransaction(id);
    if (ok) loadStats();
  };

  const handleExportCSV = async () => {
    try {
      const { data } = await transactionAPI.getAll({ month: selectedMonth, year: selectedYear });
      if (data.transactions.length === 0) {
        toast.error('Aucune transaction à exporter');
        return;
      }
      generateCSV(data.transactions);
      toast.success('CSV exporté 📄');
    } catch {
      toast.error('Erreur lors de l\'export');
    }
  };

  const handleSaveBudget = async () => {
    await saveBudget({ ...budgetForm, month: selectedMonth, year: selectedYear });
  };

  const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  const axisStyle = { fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 };
  const tooltipStyle = {
    backgroundColor: isDark ? '#1f2937' : '#fff',
    border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
    borderRadius: '12px',
    color: isDark ? '#f3f4f6' : '#111827',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Month selector */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (selectedMonth === 1) { setSelectedMonth(12); setSelectedYear((y) => y - 1); }
                else setSelectedMonth((m) => m - 1);
              }}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize min-w-[120px] text-center">
              {monthName}
            </span>
            <button
              onClick={() => {
                if (selectedMonth === 12) { setSelectedMonth(1); setSelectedYear((y) => y + 1); }
                else setSelectedMonth((m) => m + 1);
              }}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            <span className="hidden sm:inline">Ajouter</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl w-fit">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all capitalize ${
                activeTab === tab
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab === 'dashboard' ? '📊 Dashboard' : tab === 'transactions' ? '💳 Transactions' : '🎯 Budget'}
            </button>
          ))}
        </div>

        {/* ── DASHBOARD TAB ─────────────────────────────────────────── */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            {statsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card h-28 animate-pulse bg-gray-100 dark:bg-gray-900" />
                ))}
              </div>
            ) : stats ? (
              <>
                {/* Stats cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatsCard title="Solde total" amount={stats.totalBalance} type="balance" subtitle="Tous les temps" />
                  <StatsCard title="Revenus du mois" amount={stats.monthIncome} type="income" subtitle={`${monthName}`} />
                  <StatsCard title="Dépenses du mois" amount={stats.monthExpense} type="expense" subtitle={`${monthName}`} />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Pie chart */}
                  <div className="card">
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">
                      Dépenses par catégorie
                    </h3>
                    {stats.categoryTotals.length === 0 ? (
                      <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
                        Aucune dépense ce mois-ci
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie
                            data={stats.categoryTotals}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {stats.categoryTotals.map((_, i) => (
                              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={tooltipStyle}
                            formatter={(val: number) => [`${val.toFixed(2)} €`, '']}
                          />
                          <Legend
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ fontSize: 12 }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Bar chart */}
                  <div className="card">
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">
                      Évolution sur 6 mois
                    </h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={stats.sixMonthsData} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#f3f4f6'} />
                        <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}€`} />
                        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v.toFixed(2)} €`, '']} />
                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                        <Bar dataKey="income" name="Revenus" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expense" name="Dépenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Latest transactions */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">Dernières transactions</h3>
                    <button
                      onClick={() => setActiveTab('transactions')}
                      className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                    >
                      Voir tout →
                    </button>
                  </div>
                  {stats.latestTransactions.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">Aucune transaction pour le moment</p>
                  ) : (
                    <div className="space-y-2">
                      {stats.latestTransactions.map((t) => (
                        <TransactionCard
                          key={t._id}
                          transaction={t}
                          onEdit={(t) => { setEditingTransaction(t); setShowForm(true); }}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Budget overview on dashboard */}
                <BudgetCard
                  budget={budget}
                  monthExpense={stats.monthExpense}
                  categoryTotals={stats.categoryTotals}
                />
              </>
            ) : null}
          </div>
        )}

        {/* ── TRANSACTIONS TAB ─────────────────────────────────────── */}
        {activeTab === 'transactions' && (
          <div className="space-y-4 animate-fade-in">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="input-field pl-9"
                  placeholder="Rechercher par note..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button onClick={handleExportCSV} className="btn-secondary flex items-center gap-2 whitespace-nowrap">
                <Download size={15} />
                Exporter CSV
              </button>
              <button onClick={() => fetchTransactions({ month: selectedMonth, year: selectedYear, search: debouncedSearch })} className="btn-secondary flex items-center gap-2">
                <RefreshCw size={15} />
                <span className="hidden sm:inline">Actualiser</span>
              </button>
            </div>

            {/* List */}
            {txLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 rounded-xl bg-gray-100 dark:bg-gray-900 animate-pulse" />
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-400 text-sm">Aucune transaction trouvée</p>
                <button onClick={() => setShowForm(true)} className="btn-primary mt-4 inline-flex items-center gap-2">
                  <Plus size={15} /> Ajouter une transaction
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {transactions.map((t) => (
                  <TransactionCard
                    key={t._id}
                    transaction={t}
                    onEdit={(t) => { setEditingTransaction(t); setShowForm(true); }}
                    onDelete={handleDelete}
                  />
                ))}
                <p className="text-xs text-center text-gray-400 pt-2">
                  {transactions.length} transaction{transactions.length > 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── BUDGET TAB ──────────────────────────────────────────── */}
        {activeTab === 'budget' && (
          <div className="max-w-lg space-y-6 animate-fade-in">
            <div className="card">
              <div className="flex items-center gap-2 mb-5">
                <Settings size={16} className="text-emerald-600" />
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                  Budget — {monthName}
                </h3>
              </div>

              {/* Global limit */}
              <div className="mb-5">
                <label className="label">Budget global mensuel (€)</label>
                <input
                  type="number"
                  className="input-field font-mono"
                  placeholder="0"
                  min="0"
                  value={budgetForm.globalLimit || ''}
                  onChange={(e) =>
                    setBudgetForm((p) => ({ ...p, globalLimit: Number(e.target.value) }))
                  }
                />
              </div>

              {/* Per-category */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Par catégorie (€)</p>
                {EXPENSE_CATEGORIES.map((cat) => {
                  const existing = budgetForm.categoryBudgets.find((c) => c.category === cat);
                  return (
                    <div key={cat} className="flex items-center gap-3">
                      <label className="text-sm text-gray-600 dark:text-gray-400 w-32 flex-shrink-0">{cat}</label>
                      <input
                        type="number"
                        className="input-field font-mono"
                        placeholder="0"
                        min="0"
                        value={existing?.limit || ''}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setBudgetForm((p) => {
                            const cbs = p.categoryBudgets.filter((c) => c.category !== cat);
                            if (val > 0) cbs.push({ category: cat, limit: val });
                            return { ...p, categoryBudgets: cbs };
                          });
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              <button onClick={handleSaveBudget} className="btn-primary w-full mt-6">
                Sauvegarder le budget
              </button>
            </div>

            {/* Preview */}
            {stats && (
              <BudgetCard
                budget={budget}
                monthExpense={stats.monthExpense}
                categoryTotals={stats.categoryTotals}
              />
            )}
          </div>
        )}
      </div>

      {/* Transaction Form Modal */}
      {showForm && (
        <TransactionForm
          onSubmit={handleAddOrEdit}
          onClose={() => { setShowForm(false); setEditingTransaction(null); }}
          editingTransaction={editingTransaction}
        />
      )}
    </div>
  );
};

export default DashboardPage;
