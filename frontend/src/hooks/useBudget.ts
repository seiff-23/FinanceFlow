import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import type { Budget } from '../types';
import { budgetAPI } from '../services/api';

export const useBudget = () => {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBudget = useCallback(async (month: number, year: number) => {
    setIsLoading(true);
    try {
      const { data } = await budgetAPI.get(month, year);
      setBudget(data.budget);
    } catch (err) {
      toast.error('Erreur lors du chargement du budget');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveBudget = async (budgetData: Budget): Promise<boolean> => {
    try {
      const { data } = await budgetAPI.save(budgetData);
      setBudget(data.budget);
      toast.success('Budget sauvegardé ✓');
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de la sauvegarde');
      return false;
    }
  };

  return { budget, isLoading, fetchBudget, saveBudget };
};
