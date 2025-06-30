import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import KanbanColumn from './KanbanColumn';

export default function KanbanBoard({ servicos, clientes, veiculos, onServiceClick, statusConfig, isLoading }) {
    const getServicesByStatus = (status) => {
        if (!servicos) return [];
        return servicos.filter(servico => servico.status === status);
    };

    // A verificação de isLoading já está aqui, o que é ótimo.
    if (isLoading) {
        return (
            <div className="flex gap-6 overflow-x-auto pb-4">
                {/* Se statusConfig pode ser nulo aqui, usamos um array padrão para os Skeletons */}
                {(statusConfig ? Object.keys(statusConfig) : ['A Fazer', 'Em Andamento', 'Finalizado']).map((status) => (
                    <div key={status} className="flex-shrink-0 w-80">
                        <Skeleton className="h-8 w-32 mb-4" />
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-32 w-full" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // NOVA VERIFICAÇÃO: Garante que não tentamos renderizar sem a configuração das colunas.
    if (!statusConfig) {
        return <p>Configuração do painel não encontrada.</p>; // Ou retorne o mesmo esqueleto de carregamento
    }

    return (
        <div className="flex gap-6 overflow-x-auto pb-4 min-h-[600px]">
            {/* Este código agora está seguro */}
            {Object.entries(statusConfig).map(([status, config]) => (
                <KanbanColumn
                    key={status}
                    status={status}
                    config={config}
                    servicos={getServicesByStatus(status)}
                    clientes={clientes}
                    veiculos={veiculos}
                    onServiceClick={onServiceClick}
                />
            ))}
        </div>
    );
}