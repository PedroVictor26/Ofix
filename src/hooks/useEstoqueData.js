import { useState, useEffect, useMemo, useCallback } from 'react';
import { Peca, Fornecedor } from '../entities/mock-data';

export function useEstoqueData() {
    const [pecas, setPecas] = useState([]);
    const [fornecedores, setFornecedores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [pecasData, fornecedoresData] = await Promise.all([
                Peca.list(),
                Fornecedor.list(),
            ]);
            setPecas(pecasData || []);
            setFornecedores(fornecedoresData || []);
        } catch (err) {
            console.error("Erro ao carregar dados de estoque:", err);
            setError(err.message || "Falha ao carregar dados.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const stats = useMemo(() => {
        const totalPecas = pecas.length;
        const valorTotalEstoque = pecas.reduce((total, peca) => total + (peca.quantidade * peca.preco_custo), 0);
        const pecasEstoqueBaixo = pecas.filter(p => p.quantidade <= p.estoque_minimo).length;
        const totalFornecedores = fornecedores.length;

        return {
            totalPecas,
            valorTotalEstoque,
            pecasEstoqueBaixo,
            totalFornecedores,
        };
    }, [pecas, fornecedores]);

    return {
        pecas,
        fornecedores,
        stats,
        isLoading,
        error,
        reload: loadData,
    };
}
