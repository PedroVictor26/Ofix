// src/hooks/useDashboardData.js
import { useEffect, useState, useCallback } from "react";
import * as servicosService from '../services/servicos.service.js';
// Temporariamente, vamos manter mock para clientes e veículos ou usar dados vazios
// até que seus services sejam implementados.
import { Cliente as MockCliente, Veiculo as MockVeiculo } from "@/entities/mock-data"; // Para simular
import toast from "react-hot-toast";

export default function useDashboardData() {
    const [servicos, setServicos] = useState([]);
    const [clientes, setClientes] = useState({}); // Manter como mapa
    const [veiculos, setVeiculos] = useState({}); // Manter como mapa
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Buscar serviços da API
            const apiServicos = await servicosService.getAllServicos();
            setServicos(apiServicos || []);

            // Manter clientes e veículos mocados por enquanto, mas transformados em mapa
            // Em uma implementação completa, eles também viriam de uma API.
            const mockClientesArray = await MockCliente.list(); // Supondo que MockCliente.list() ainda exista
            const mockVeiculosArray = await MockVeiculo.list(); // Supondo que MockVeiculo.list() ainda exista

            const clientesMap = mockClientesArray.reduce((acc, cliente) => {
                acc[cliente.id] = cliente;
                return acc;
            }, {});
            const veiculosMap = mockVeiculosArray.reduce((acc, veiculo) => {
                acc[veiculo.id] = veiculo;
                return acc;
            }, {});
            setClientes(clientesMap);
            setVeiculos(veiculosMap);

        } catch (err) {
            console.error("Erro ao carregar dados do dashboard:", err);
            setError(err.message || "Falha ao carregar dados do dashboard.");
            toast.error(err.message || "Falha ao carregar dados do dashboard.");
            setServicos([]); // Limpa os serviços em caso de erro para não mostrar dados antigos
            // Poderia manter clientes/veículos mocados ou limpar também
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return {
        servicos,
        clientes,
        veiculos,
        isLoading,
        error,
        reload: loadData, // Função para recarregar os dados
    };
}
