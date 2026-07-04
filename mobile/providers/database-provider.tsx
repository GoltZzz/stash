import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getDatabase } from '@/db/client';
import {
  createBudget,
  getLatestBudget,
  hasCompletedOnboarding,
  hasSavedBudget,
  markOnboardingComplete,
} from '@/features/budgets/repository';
import type { Budget, BudgetPayload } from '@/features/budgets/types';
import { daysLeftInPeriod, periodLengthDays } from '@/components/home/budget-helpers';
import type { CatMood } from '@/components/home/cat-sprite';

type DatabaseStatus = 'loading' | 'ready' | 'error';

type DatabaseContextValue = {
  status: DatabaseStatus;
  error: Error | null;
  onboardingComplete: boolean;
  resumeAtCelebration: boolean;
  latestBudget: Budget | null;
  catMood: CatMood;
  reloadLatestBudget: () => Promise<void>;
  saveBudget: (payload: BudgetPayload) => Promise<void>;
  finishOnboarding: () => Promise<void>;
};

const getCatMood = (budget: Budget | null, loading: boolean): CatMood => {
  if (loading) return 'good';
  if (!budget) return 'walking';

  const daysLeft = daysLeftInPeriod(budget);
  const length = periodLengthDays(budget);
  const ratio = daysLeft / length;

  if (daysLeft === 0) return 'empty';
  if (ratio <= 0.05) return 'critical';
  if (ratio <= 0.25) return 'warning';
  if (ratio <= 0.50) return 'walking';
  return 'good';
};

const DatabaseContext = createContext<DatabaseContextValue>({
  status: 'loading',
  error: null,
  onboardingComplete: false,
  resumeAtCelebration: false,
  latestBudget: null,
  catMood: 'walking',
  reloadLatestBudget: async () => {},
  saveBudget: async () => {},
  finishOnboarding: async () => {},
});

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<DatabaseStatus>('loading');
  const [error, setError] = useState<Error | null>(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [resumeAtCelebration, setResumeAtCelebration] = useState(false);
  const [latestBudget, setLatestBudget] = useState<Budget | null>(null);

  const reloadLatestBudget = useCallback(async () => {
    try {
      const db = await getDatabase();
      const result = await getLatestBudget(db);
      setLatestBudget(result);
    } catch (err) {
      console.error('Failed to reload latest budget:', err);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    getDatabase()
      .then(async (db) => {
        const completed = await hasCompletedOnboarding(db);
        const savedBudget = completed ? false : await hasSavedBudget(db);
        const budget = await getLatestBudget(db);
        if (!cancelled) {
          setOnboardingComplete(completed);
          setResumeAtCelebration(savedBudget);
          setLatestBudget(budget);
          setStatus('ready');
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setStatus('error');
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const saveBudget = useCallback(async (payload: BudgetPayload) => {
    const db = await getDatabase();
    const newBudget = await createBudget(db, payload);
    setResumeAtCelebration(true);
    setLatestBudget(newBudget);
  }, []);

  const finishOnboarding = useCallback(async () => {
    const db = await getDatabase();
    await markOnboardingComplete(db);
    setOnboardingComplete(true);
    setResumeAtCelebration(false);
    const budget = await getLatestBudget(db);
    setLatestBudget(budget);
  }, []);

  const catMood = useMemo(() => {
    return getCatMood(latestBudget, status === 'loading');
  }, [latestBudget, status]);

  const value = useMemo(
    () => ({
      status,
      error,
      onboardingComplete,
      resumeAtCelebration,
      latestBudget,
      catMood,
      reloadLatestBudget,
      saveBudget,
      finishOnboarding,
    }),
    [
      status,
      error,
      onboardingComplete,
      resumeAtCelebration,
      latestBudget,
      catMood,
      reloadLatestBudget,
      saveBudget,
      finishOnboarding,
    ],
  );

  return (
    <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>
  );
}

export function useDatabase() {
  return useContext(DatabaseContext);
}
