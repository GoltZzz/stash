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
  hasCompletedOnboarding,
  hasSavedBudget,
  markOnboardingComplete,
} from '@/features/budgets/repository';
import type { BudgetPayload } from '@/features/budgets/types';

type DatabaseStatus = 'loading' | 'ready' | 'error';

type DatabaseContextValue = {
  status: DatabaseStatus;
  error: Error | null;
  onboardingComplete: boolean;
  resumeAtCelebration: boolean;
  saveBudget: (payload: BudgetPayload) => Promise<void>;
  finishOnboarding: () => Promise<void>;
};

const DatabaseContext = createContext<DatabaseContextValue>({
  status: 'loading',
  error: null,
  onboardingComplete: false,
  resumeAtCelebration: false,
  saveBudget: async () => {},
  finishOnboarding: async () => {},
});

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<DatabaseStatus>('loading');
  const [error, setError] = useState<Error | null>(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [resumeAtCelebration, setResumeAtCelebration] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getDatabase()
      .then(async (db) => {
        const completed = await hasCompletedOnboarding(db);
        const savedBudget = completed ? false : await hasSavedBudget(db);
        if (!cancelled) {
          setOnboardingComplete(completed);
          setResumeAtCelebration(savedBudget);
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
    await createBudget(db, payload);
    setResumeAtCelebration(true);
  }, []);

  const finishOnboarding = useCallback(async () => {
    const db = await getDatabase();
    await markOnboardingComplete(db);
    setOnboardingComplete(true);
    setResumeAtCelebration(false);
  }, []);

  const value = useMemo(
    () => ({
      status,
      error,
      onboardingComplete,
      resumeAtCelebration,
      saveBudget,
      finishOnboarding,
    }),
    [
      status,
      error,
      onboardingComplete,
      resumeAtCelebration,
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
