import React, { createContext, useContext, useEffect, useState } from 'react';

export type Payable = {
  id: string;
  label: string;
  amount: number;
  dueDate: string;
};

export type Receivable = {
  id: string;
  label: string;
  amount: number;
  dueDate: string;
};

export type PayablesReceivablesContextType = {
  payables: Payable[];
  receivables: Receivable[];
  addPayable: (payable: Payable) => void;
  editPayable: (payable: Payable) => void;
  deletePayable: (id: string) => void;
  addReceivable: (receivable: Receivable) => void;
  editReceivable: (receivable: Receivable) => void;
  deleteReceivable: (id: string) => void;
};

const PayablesReceivablesContext = createContext<PayablesReceivablesContextType | undefined>(undefined);

const PAYABLES_KEY = 'payables_v0';
const RECEIVABLES_KEY = 'receivables_v0';

export const PayablesReceivablesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [payables, setPayables] = useState<Payable[]>([]);
  const [receivables, setReceivables] = useState<Receivable[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const storedPayables = localStorage.getItem(PAYABLES_KEY);
    const storedReceivables = localStorage.getItem(RECEIVABLES_KEY);
    if (storedPayables) setPayables(JSON.parse(storedPayables));
    if (storedReceivables) setReceivables(JSON.parse(storedReceivables));
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(PAYABLES_KEY, JSON.stringify(payables));
  }, [payables]);
  useEffect(() => {
    localStorage.setItem(RECEIVABLES_KEY, JSON.stringify(receivables));
  }, [receivables]);

  // CRUD functions
  const addPayable = (payable: Payable) => setPayables(prev => [...prev, payable]);
  const editPayable = (payable: Payable) => setPayables(prev => prev.map(p => p.id === payable.id ? payable : p));
  const deletePayable = (id: string) => setPayables(prev => prev.filter(p => p.id !== id));

  const addReceivable = (receivable: Receivable) => setReceivables(prev => [...prev, receivable]);
  const editReceivable = (receivable: Receivable) => setReceivables(prev => prev.map(r => r.id === receivable.id ? receivable : r));
  const deleteReceivable = (id: string) => setReceivables(prev => prev.filter(r => r.id !== id));

  return (
    <PayablesReceivablesContext.Provider value={{
      payables,
      receivables,
      addPayable,
      editPayable,
      deletePayable,
      addReceivable,
      editReceivable,
      deleteReceivable,
    }}>
      {children}
    </PayablesReceivablesContext.Provider>
  );
};

export const usePayablesReceivables = () => {
  const context = useContext(PayablesReceivablesContext);
  if (!context) throw new Error('usePayablesReceivables must be used within PayablesReceivablesProvider');
  return context;
};
