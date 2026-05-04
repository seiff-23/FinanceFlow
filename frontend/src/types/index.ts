// ─── Auth ───────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ─── Transactions ────────────────────────────────────────────────────────────
export type TransactionType = 'income' | 'expense';

export type ExpenseCategory =
  | 'Alimentaire'
  | 'Transport'
  | 'Logement'
  | 'Loisirs'
  | 'Santé'
  | 'Shopping'
  | 'Factures'
  | 'Restaurants'
  | 'Autre';

export type IncomeCategory =
  | 'Salaire'
  | 'Freelance'
  | 'Cadeau'
  | 'Investissement'
  | 'Autre';

export type Category = ExpenseCategory | IncomeCategory;

export interface Transaction {
  _id: string;
  user: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFormData {
  amount: string;
  type: TransactionType;
  category: Category;
  date: string;
  note: string;
}

// ─── Budget ──────────────────────────────────────────────────────────────────
export interface CategoryBudget {
  category: string;
  limit: number;
}

export interface Budget {
  _id?: string;
  user?: string;
  month: number;
  year: number;
  globalLimit: number;
  categoryBudgets: CategoryBudget[];
}

// ─── Stats ───────────────────────────────────────────────────────────────────
export interface CategoryTotal {
  name: string;
  value: number;
}

export interface MonthData {
  month: string;
  income: number;
  expense: number;
}

export interface DashboardStats {
  monthIncome: number;
  monthExpense: number;
  totalBalance: number;
  categoryTotals: CategoryTotal[];
  sixMonthsData: MonthData[];
  latestTransactions: Transaction[];
}

// ─── Filters ─────────────────────────────────────────────────────────────────
export interface TransactionFilters {
  month: number;
  year: number;
  search: string;
}

// ─── API Response ─────────────────────────────────────────────────────────────
export interface ApiError {
  message: string;
  errors?: { msg: string; param: string }[];
}

// ─── Constants ───────────────────────────────────────────────────────────────
export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Alimentaire',
  'Transport',
  'Logement',
  'Loisirs',
  'Santé',
  'Shopping',
  'Factures',
  'Restaurants',
  'Autre',
];

export const INCOME_CATEGORIES: IncomeCategory[] = [
  'Salaire',
  'Freelance',
  'Cadeau',
  'Investissement',
  'Autre',
];

export const CHART_COLORS = [
  '#10b981', '#3b82f6', '#f59e0b', '#ef4444',
  '#8b5cf6', '#06b6d4', '#f97316', '#84cc16',
  '#ec4899', '#6366f1',
];
