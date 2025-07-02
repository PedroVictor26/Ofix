import { useState, useEffect, useCallback } from 'react';
import { Cliente, Veiculo, Servico } from '../entities/mock-data';

export function useClientesData() {
    const [clientes, setClientes] = useState([]);
    const [veiculos, setVeiculos] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Usando Promise.all para carregar dados em paralelo para melhor performance
            const [clientesData, veiculosData, servicosData] = await Promise.all([
                Cliente.list(),
                Veiculo.list(),
                Servico.list()
            ]);

            setClientes(clientesData);
            setVeiculos(veiculosData);
            setServicos(servicosData);
        } catch (err) {
            console.error("Erro ao carregar dados:", err);
            setError(err.message || "Falha ao carregar dados. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    }, []); // useCallback garante que a função não seja recriada a cada renderização

    useEffect(() => {
        loadData();
    }, [loadData]); // O hook executa a busca de dados na montagem do componente

    const getVeiculosByCliente = (clienteId) => {
        return veiculos.filter(v => v.cliente_id === clienteId);
    };

    const getServicosByCliente = (clienteId) => {
        return servicos.filter(s => s.cliente_id === clienteId);
    };

    return {
        clientes,
        isLoading,
        error,
        loadData,
        getVeiculosByCliente,
        getServicosByCliente
    };
}
