import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import KanbanColumn from './KanbanColumn';

export default function KanbanBoard({ servicos, clientes, veiculos, onServiceClick, statusConfig, isLoading }) {
    const getServicesByStatus = (status) => {
        return servicos.filter(servico => servico.status === status);
    };

    if (isLoading) {
        return (
            <div className="flex gap-6 overflow-x-auto pb-4">
                {Object.keys(statusConfig).map((status) => (
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

    return (
        <div className="flex gap-6 overflow-x-auto pb-4 min-h-[600px]">
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