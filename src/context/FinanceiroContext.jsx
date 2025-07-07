import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getFaturamentoHoje } from '../services/financeiro.service';

const FinanceiroContext = createContext(null);

export const useFinanceiroContext = () => {
  const context = useContext(FinanceiroContext);
  if (!context) {
    throw new Error('useFinanceiroContext must be used within a FinanceiroProvider');
  }
  return context;
};

export const FinanceiroProvider = ({ children }) => {
  const [faturamentoHoje, setFaturamentoHoje] = useState(0);
  const [isLoadingFaturamento, setIsLoadingFaturamento] = useState(true);
  const [errorFaturamento, setErrorFaturamento] = useState(null);

  const fetchFaturamentoHoje = useCallback(async () => {
    setIsLoadingFaturamento(true);
    setErrorFaturamento(null);
    try {
      const data = await getFaturamentoHoje();
      setFaturamentoHoje(data?.faturamentoHoje || 0);
    } catch (err) {
      console.error("Erro ao buscar faturamento hoje:", err);
      setErrorFaturamento(err.message || "Falha ao carregar faturamento hoje.");
    } finally {
      setIsLoadingFaturamento(false);
    }
  }, []);

  useEffect(() => {
    fetchFaturamentoHoje();
  }, [fetchFaturamentoHoje]);

  const value = {
    faturamentoHoje,
    setFaturamentoHoje: fetchFaturamentoHoje, // Expose the fetch function to allow manual refresh
    isLoadingFaturamento,
    errorFaturamento,
  };

  return (
    <FinanceiroContext.Provider value={value}>
      {children}
    </FinanceiroContext.Provider>
  );
};
