import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import type { Transaction, TransactionFormData, TransactionFilters } from '../types';
import { transactionAPI } from '../services/api';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTransactions = useCallback(async (filters: Partial<TransactionFilters> = {}) => {
    setIsLoading(true);
    try {
      const { data } = await transactionAPI.getAll(filters);
      setTransactions(data.transactions);
    } catch (err) {
      toast.error('Erreur lors du chargement des transactions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTransaction = async (formData: TransactionFormData): Promise<boolean> => {
    try {
      const { data } = await transactionAPI.create(formData);
      setTransactions((prev) => [data.transaction, ...prev]);
      toast.success('Transaction ajoutée ✓');
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'ajout');
      return false;
    }
  };

  const editTransaction = async (id: string, formData: Partial<TransactionFormData>): Promise<boolean> => {
    try {
      const { data } = await transactionAPI.update(id, formData);
      setTransactions((prev) =>
        prev.map((t) => (t._id === id ? data.transaction : t))
      );
      toast.success('Transaction modifiée ✓');
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de la modification');
      return false;
    }
  };

  const removeTransaction = async (id: string): Promise<boolean> => {
    try {
      await transactionAPI.delete(id);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
      toast.success('Transaction supprimée');
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression');
      return false;
    }
  };

  return {
    transactions,
    isLoading,
    fetchTransactions,
    addTransaction,
    editTransaction,
    removeTransaction,
  };
};
