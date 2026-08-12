import React, { createContext, useContext, useState, useCallback } from 'react';

type SheetStackContextType = {
  stack: string[];
  pushSheet: (id: string) => void;
  popSheet: () => void;
  dismissAll: () => void;
  isStacked: (id: string) => boolean;
  isOpen: (id: string) => boolean;
};

const SheetStackContext = createContext<SheetStackContextType | undefined>(undefined);

type SheetStackProviderProps = {
  children: React.ReactNode;
  onDismissAll?: () => void;
};

export function SheetStackProvider({ children, onDismissAll }: SheetStackProviderProps) {
  const [stack, setStack] = useState<string[]>([]);

  const pushSheet = useCallback((id: string) => {
    setStack((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  }, []);

  const popSheet = useCallback(() => {
    setStack((prev) => {
      if (prev.length === 0) return prev;
      return prev.slice(0, -1);
    });
  }, []);

  const dismissAll = useCallback(() => {
    setStack([]);
    if (onDismissAll) {
      onDismissAll();
    }
  }, [onDismissAll]);

  const isStacked = useCallback(
    (id: string) => {
      const index = stack.indexOf(id);
      return index !== -1 && index < stack.length - 1;
    },
    [stack]
  );

  const isOpen = useCallback(
    (id: string) => {
      return stack.includes(id);
    },
    [stack]
  );

  return (
    <SheetStackContext.Provider
      value={{
        stack,
        pushSheet,
        popSheet,
        dismissAll,
        isStacked,
        isOpen,
      }}
    >
      {children}
    </SheetStackContext.Provider>
  );
}

export function useSheetStack() {
  const context = useContext(SheetStackContext);
  if (!context) {
    throw new Error('useSheetStack must be used within a SheetStackProvider');
  }
  return context;
}
