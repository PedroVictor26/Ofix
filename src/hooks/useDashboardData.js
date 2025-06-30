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
            const [s, cArray, vArray] = await Promise.all([
                Servico.list(),
                Cliente.list(),
                Veiculo.list()
            ]);
            setServicos(s);
            const clientesMap = cArray.reduce((acc, cliente) => {
                acc[cliente.id] = cliente;
                return acc;
            }, {});
            const veiculosMap = vArray.reduce((acc, veiculo) => {
                acc[veiculo.id] = veiculo;
                return acc;
            }, {});
            setClientes(clientesMap);
            setVeiculos(veiculosMap);
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
