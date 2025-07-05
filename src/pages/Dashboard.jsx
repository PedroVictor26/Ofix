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
import * as servicosService from '../services/servicos.service.js';

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
        useSensor(PointerSensor, {
            // Exige que o mouse se mova 8px antes de ativar o arrasto, evitando conflitos com o clique.
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        console.log("Drag End Event - active:", active); // Log para depuração
        console.log("Drag End Event - over:", over); // Log para depuração

        if (!over || over.data.current?.type !== 'column') {
            console.error("Solto fora de uma coluna válida ou tipo de destino incorreto:", over);
            return;
        }

        const activeId = active.id.toString();
        const newStatus = over.id.toString(); // over.id deve ser o ID da coluna (status key)
        const servicoArrastado = localServicos.find(s => s.id.toString() === activeId);

        // MAPA DE TRADUÇÃO: Converte o ID da coluna (frontend) para o valor do enum (backend)
        const statusMap = {
            'AGUARDANDO': 'AGUARDANDO',
            'EM_ANDAMENTO': 'EM_ANDAMENTO',
            'AGUARDANDO_PECAS': 'AGUARDANDO_PECAS',
            'AGUARDANDO_APROVACAO': 'AGUARDANDO_APROVACAO',
            'FINALIZADO': 'FINALIZADO',
            'CANCELADO': 'CANCELADO',
        };

        const newStatusEnum = statusMap[newStatus];

        if (!newStatusEnum) {
            console.error("Status de coluna inválido para tradução:", newStatus);
            return;
        }

        if (servicoArrastado && servicoArrastado.status !== newStatusEnum) {
            const originalServicos = [...localServicos];
            setLocalServicos(prev => prev.map(s => s.id.toString() === activeId ? { ...s, status: newStatusEnum } : s));

            try {
                await servicosService.updateServico(activeId, { status: newStatusEnum });
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
            <NewServiceModal
                isOpen={isNewServiceModalOpen}
                onClose={() => setNewServiceModalOpen(false)}
                onSuccess={reload}
                clientes={clientes}
                veiculos={veiculos}
            />
            <ServiceModal
                isOpen={isServiceModalOpen}
                onClose={() => setServiceModalOpen(false)}
                service={selectedService}
                onUpdate={reload}
                clientes={clientes}
                veiculos={veiculos}
            />
        </DndContext>
    );
}
