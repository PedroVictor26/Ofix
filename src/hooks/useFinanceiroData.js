import { useState, useEffect, useMemo, useCallback } from 'react';
import { Financeiro, Servico } from '../entities/mock-data'; // Ajuste o caminho conforme necessário

export function useFinanceiroData() {
    const [transacoes, setTransacoes] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterPeriod, setFilterPeriod] = useState("month");

    const loadData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [transacoesData, servicosData] = await Promise.all([
                Financeiro.list(),
                Servico.list(),
            ]);
            setTransacoes(transacoesData || []);
            setServicos(servicosData || []);
        } catch (err) {
            console.error("Erro ao carregar dados financeiros:", err);
            setError(err.message || "Falha ao carregar dados.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredTransacoes = useMemo(() => {
        const now = new Date();
        let startDate;

        switch (filterPeriod) {
            case "week":
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case "month":
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case "year":
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default: // "all"
                return transacoes;
        }
        return transacoes.filter(t => new Date(t.data) >= startDate);
    }, [transacoes, filterPeriod]);

    const stats = useMemo(() => {
        const entradas = filteredTransacoes.filter(t => t.tipo === 'Entrada').reduce((sum, t) => sum + t.valor, 0);
        const saidas = filteredTransacoes.filter(t => t.tipo === 'Saída').reduce((sum, t) => sum + t.valor, 0);
        const saldo = entradas - saidas;
        return { entradas, saidas, saldo, totalTransacoes: filteredTransacoes.length };
    }, [filteredTransacoes]);

    return {
        transacoes: filteredTransacoes,
        servicos,
        stats,
        isLoading,
        error,
        filterPeriod,
        setFilterPeriod,
        reload: loadData,
    };
}
