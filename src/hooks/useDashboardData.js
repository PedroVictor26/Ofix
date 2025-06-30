// src/hooks/useDashboardData.js
import { useEffect, useState } from "react";
import { Cliente, Servico, Veiculo } from "@/entities/mock-data";

export default function useDashboardData() {
    const [servicos, setServicos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [veiculos, setVeiculos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [s, c, v] = await Promise.all([
                Servico.list(),
                Cliente.list(),
                Veiculo.list()
            ]);
            setServicos(s);
            setClientes(c);
            setVeiculos(v);
        } catch (err) {
            console.error("Erro ao carregar dados:", err);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    return {
        servicos,
        clientes,
        veiculos,
        isLoading,
        reload: loadData,
    };
}
