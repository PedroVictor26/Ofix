import { useState, useEffect, useCallback } from 'react';
import { ProcedimentoPadrao, MensagemPadrao } from '../entities/mock-data'; // Ajuste o caminho

export function useConfiguracoesData() {
    const [procedimentos, setProcedimentos] = useState([]);
    const [mensagens, setMensagens] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [procedimentosData, mensagensData] = await Promise.all([
                ProcedimentoPadrao.list(),
                MensagemPadrao.list(),
            ]);
            setProcedimentos(procedimentosData || []);
            setMensagens(mensagensData || []);
        } catch (err) {
            console.error("Erro ao carregar dados de configurações:", err);
            setError(err.message || "Falha ao carregar dados.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return {
        procedimentos,
        mensagens,
        isLoading,
        error,
        reload: loadData,
    };
}
