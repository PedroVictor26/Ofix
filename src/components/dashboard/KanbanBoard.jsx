import { Skeleton } from "@/components/ui/skeleton";
import KanbanColumn from './KanbanColumn';

// Skeleton para o KanbanBoard
const KanbanBoardSkeleton = ({ statusConfig }) => (
    <div className="flex gap-6 overflow-x-auto pb-4">
        {Object.keys(statusConfig).map((status) => (
            <div key={status} className="flex-shrink-0 w-80">
                <div className="bg-slate-100 rounded-xl p-4 h-full">
                    <div className="flex items-center justify-between mb-4">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-8" />
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-24 w-full rounded-lg" />
                        <Skeleton className="h-24 w-full rounded-lg" />
                        <Skeleton className="h-24 w-full rounded-lg" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export default function KanbanBoard({ servicos, clientes, veiculos, onServiceClick, statusConfig, isLoading }) {
    const getServicesByStatus = (statusKey) => {
        if (!servicos) return [];
        return servicos.filter(servico => servico.status === statusKey);
    };

    if (isLoading) {
        return <KanbanBoardSkeleton statusConfig={statusConfig} />;
    }

    return (
        <div className="flex gap-6 overflow-x-auto pb-4">
            {Object.entries(statusConfig).map(([status, config]) => (
                <KanbanColumn
                    key={status}
                    status={status}
                    config={config}
                    servicos={getServicesByStatus(status)}
                    clientes={clientes}
                    veiculos={veiculos}
                    onServiceClick={onServiceClick}
                    serviceIds={getServicesByStatus(status).map(s => s.id.toString())}
                />
            ))}
        </div>
    );
}
