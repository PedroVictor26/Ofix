// src/hooks/useDashboardData.js
import { useEffect, useState, useCallback } from "react";
import * as servicosService from '../services/servicos.service.js';
import { getAllClientes, getAllVeiculos } from '../services/clientes.service.js'; // Importar getAllVeiculos
import toast from "react-hot-toast";

export default function useDashboardData() {
    const [servicos, setServicos] = useState([]);
    const [clientes, setClientes] = useState({}); 
    const [veiculos, setVeiculos] = useState({}); // Inicializar como objeto vazio para o mapa
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [apiServicos, apiClientes, apiVeiculos] = await Promise.all([
                servicosService.getAllServicos(),
                getAllClientes(),
                getAllVeiculos() // Buscar todos os veículos
            ]);

            setServicos(apiServicos || []);

            const clientesMap = apiClientes.reduce((acc, cliente) => {
                acc[cliente.id] = cliente;
                return acc;
            }, {});
            setClientes(clientesMap);

            const veiculosMap = apiVeiculos.reduce((acc, veiculo) => {
                acc[veiculo.id] = veiculo;
                return acc;
            }, {});
            setVeiculos(veiculosMap);

        } catch (err) {
            console.error("Erro ao carregar dados do dashboard:", err);
            setError(err.message || "Falha ao carregar dados do dashboard.");
            toast.error(err.message || "Falha ao carregar dados do dashboard.");
            setServicos([]); 
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
        veiculos: Object.values(veiculos), // Retornar como array para o componente
        isLoading,
        error,
        reload: loadData,
    };
}
