import { useState, useMemo, useEffect } from "react";
import { Plus, Wrench, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import useDashboardData from "@/hooks/useDashboardData";
import { statusConfig } from "@/constants/statusConfig";
import StatsCards, { StatsCardSkeleton } from "@/components/dashboard/StatsCards";
import KanbanBoard from "@/components/dashboard/KanbanBoard";
import ServiceModal from "@/components/dashboard/ServiceModal";
import NewServiceModal from "@/components/dashboard/NewServiceModal";

// Componente de Erro Refinado
const ErrorState = ({ error, onRetry }) => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-8">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-700 mb-2">Oops! Algo deu errado.</h2>
            <p className="text-slate-500 mb-6">Não foi possível carregar os dados do dashboard.</p>
            <Button onClick={onRetry} variant="destructive">
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar Novamente
            </Button>
        </div>
    </div>
);

export default function Dashboard() {
    const { servicos, clientes, veiculos, isLoading, error, reload } = useDashboardData();
    const [localServicos, setLocalServicos] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [isServiceModalOpen, setServiceModalOpen] = useState(false);
    const [isNewServiceModalOpen, setNewServiceModalOpen] = useState(false);

    useEffect(() => {
        setLocalServicos(servicos || []);
    }, [servicos]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id.toString();
        const newStatus = over.id.toString();
        const servicoArrastado = localServicos.find(s => s.id.toString() === activeId);

        if (servicoArrastado && servicoArrastado.status !== newStatus) {
            const originalServicos = [...localServicos];
            setLocalServicos(prev => prev.map(s => s.id.toString() === activeId ? { ...s, status: newStatus } : s));

            try {
                // Simulação de chamada à API
                await new Promise(resolve => setTimeout(resolve, 500));
                // await servicosService.updateServico(activeId, { status: newStatus });
            } catch (err) {
                console.error("Falha ao atualizar status:", err);
                setLocalServicos(originalServicos);
            }
        }
    };

    const stats = useMemo(() => ({
        total: localServicos.length,
        ...Object.keys(statusConfig).reduce((acc, key) => {
            acc[key] = localServicos.filter(s => s.status === key).length;
            return acc;
        }, {}),
    }), [localServicos]);

    if (error) {
        return <div className="p-4 sm:p-6 lg:p-8"><ErrorState error={error} onRetry={reload} /></div>;
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <div className="p-4 sm:p-6 lg:p-8 bg-slate-100 min-h-screen">
                <div className="max-w-full mx-auto">
                    {/* Header */}
                    <header className="mb-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800">Dashboard Operacional</h1>
                                <p className="text-slate-500 mt-1">Visualize e gerencie os serviços da sua oficina.</p>
                            </div>
                            <Button onClick={() => setNewServiceModalOpen(true)} size="lg">
                                <Plus className="w-5 h-5 mr-2" />
                                Nova Ordem de Serviço
                            </Button>
                        </div>
                    </header>

                    {/* Stats */}
                    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                        {isLoading ? (
                            Array(6).fill(0).map((_, i) => <StatsCardSkeleton key={i} />)
                        ) : (
                            <>
                                <StatsCards title="Total" value={stats.total} icon={Wrench} />
                                {Object.entries(statusConfig).map(([status, cfg]) => (
                                    <StatsCards key={status} title={cfg.title} value={stats[status]} icon={cfg.icon} color={cfg.color} bgColor={cfg.bgColor} />
                                ))}
                            </>
                        )}
                    </section>

                    {/* Kanban Board */}
                    <main>
                        <KanbanBoard
                            servicos={localServicos}
                            clientes={clientes}
                            veiculos={veiculos}
                            onServiceClick={(service) => {
                                setSelectedService(service);
                                setServiceModalOpen(true);
                            }}
                            statusConfig={statusConfig}
                            isLoading={isLoading}
                        />
                    </main>
                </div>
            </div>

            {/* Modals */}
            <ServiceModal
                isOpen={isServiceModalOpen}
                onClose={() => setServiceModalOpen(false)}
                service={selectedService}
                onUpdate={reload}
                clientes={clientes}
                veiculos={veiculos}
            />
            <NewServiceModal
                isOpen={isNewServiceModalOpen}
                onClose={() => setNewServiceModalOpen(false)}
                onSuccess={reload}
                clientes={clientes}
                veiculos={veiculos}
            />
        </DndContext>
    );
}
