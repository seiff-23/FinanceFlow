import axios from 'axios';
import type {
  Transaction,
  TransactionFormData,
  TransactionFilters,
  Budget,
  DashboardStats,
  User,
} from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Injecter le token JWT dans chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ff_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gérer les erreurs 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ff_token');
      localStorage.removeItem('ff_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ───────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<{ token: string; user: User }>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<{ token: string; user: User }>('/auth/login', data),

  getMe: () =>
    api.get<{ user: User }>('/auth/me'),
};

// ─── Transactions ────────────────────────────────────────────────────────────
export const transactionAPI = {
  getAll: (filters: Partial<TransactionFilters>) =>
    api.get<{ transactions: Transaction[] }>('/transactions', { params: filters }),

  getStats: () =>
    api.get<DashboardStats>('/transactions/stats'),

  create: (data: TransactionFormData) =>
    api.post<{ transaction: Transaction }>('/transactions', data),

  update: (id: string, data: Partial<TransactionFormData>) =>
    api.put<{ transaction: Transaction }>(`/transactions/${id}`, data),

  delete: (id: string) =>
    api.delete<{ message: string }>(`/transactions/${id}`),
};

// ─── Budget ──────────────────────────────────────────────────────────────────
export const budgetAPI = {
  get: (month: number, year: number) =>
    api.get<{ budget: Budget | null }>('/budgets', { params: { month, year } }),

  save: (data: Budget) =>
    api.post<{ budget: Budget }>('/budgets', data),
};

// ─── CSV Export ──────────────────────────────────────────────────────────────
export const generateCSV = (transactions: Transaction[]): void => {
  const headers = ['Date', 'Type', 'Catégorie', 'Montant (€)', 'Note'];

  const rows = transactions.map((t) => [
    new Date(t.date).toLocaleDateString('fr-FR'),
    t.type === 'income' ? 'Revenu' : 'Dépense',
    t.category,
    t.type === 'income' ? `+${t.amount.toFixed(2)}` : `-${t.amount.toFixed(2)}`,
    `"${(t.note || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `financeflow_transactions_${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export default api;
