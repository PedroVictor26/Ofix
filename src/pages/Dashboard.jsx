import React, { useState, useMemo, useEffect } from "react"; // Import useMemo, useEffect
import { Plus, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import useDashboardData from "@/hooks/useDashboardData";
import { statusConfig } from "@/constants/statusConfig";
import StatsCards from "@/components/dashboard/StatsCards";
import KanbanBoard from "@/components/dashboard/KanbanBoard";
import ServiceModal from "@/components/dashboard/ServiceModal";
import NewServiceModal from "@/components/dashboard/NewServiceModal";
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';


export default function Dashboard() {
    const {
        servicos: initialServicos, // Renomeado para evitar conflito de nomes
        clientes,
        veiculos,
        isLoading: dataIsLoading, // Renomeado para evitar conflito com possível estado de loading do D&D
        reload
    } = useDashboardData();

    const [localServicos, setLocalServicos] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [showNewServiceModal, setShowNewServiceModal] = useState(false);

    const openService = (service) => {
        setSelectedService(service);
        setShowServiceModal(true);
    };

    const closeService = () => {
        setSelectedService(null);
        setShowServiceModal(false);
        reload();
    };

    const closeNewService = () => {
        setShowNewServiceModal(false);
        reload();
    };

    useEffect(() => {
        if (initialServicos && initialServicos.length > 0) {
            setLocalServicos(initialServicos);
        } else if (!dataIsLoading && initialServicos && initialServicos.length === 0) {
            // Caso não esteja carregando e initialServicos seja um array vazio (mock pode retornar vazio)
            setLocalServicos([]);
        }
    }, [initialServicos, dataIsLoading]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return; // Sai se não soltou sobre uma coluna válida

        const activeId = active.id; // ID do serviço (card)
        const overId = over.id;     // ID da coluna ou do card sobre o qual foi solto

        // Identificar se 'over' é uma coluna ou um card
        // No nosso caso, `over.id` será o id da coluna se usarmos `useDroppable` nela
        // ou o id de um card se estivermos apenas reordenando dentro de uma SortableContext.
        // Para mover entre colunas, `over.data.current.sortable.containerId` pode ser o ID da coluna.

        const servicoArrastado = localServicos.find(s => s.id === activeId);

        // A coluna de destino é o `id` do `Droppable` (KanbanColumn)
        // ou o `containerId` se estivermos usando `SortableContext` por coluna.
        // Vamos assumir que `over.id` é o status da coluna de destino.
        let novoStatus = overId;

        // Se `over.data.current.type === 'column'`, então `over.id` é o ID da coluna.
        // Se estivermos soltando sobre um card, `over.data.current.sortable.containerId` é o ID da coluna.
        if (over.data.current?.type === 'column') {
            novoStatus = over.id;
        } else if (over.data.current?.sortable?.containerId) {
            novoStatus = over.data.current.sortable.containerId;
        }


        if (servicoArrastado && servicoArrastado.status !== novoStatus) {
            setLocalServicos(prevServicos =>
                prevServicos.map(s =>
                    s.id === activeId ? { ...s, status: novoStatus } : s
                )
            );
            console.log(`Serviço ${activeId} movido para ${novoStatus}`);
            // Futuramente: await updateServiceStatus(activeId, novoStatus); reload();
        }
    };

    const stats = useMemo(() => {
        return {
            total: localServicos.length,
            ...Object.keys(statusConfig).reduce((acc, key) => {
                acc[key] = localServicos.filter((s) => s.status === key).length;
                return acc;
            }, {}),
        };
    }, [localServicos, statusConfig]);

    // Se ainda estiver carregando os dados iniciais, mostramos o skeleton do KanbanBoard
    // O KanbanBoard em si também tem lógica de isLoading, mas aqui é para o DndContext não montar sem dados.
    if (dataIsLoading && localServicos.length === 0) {
        // Pode-se retornar um loader geral para a página ou um skeleton mais completo
        return (
            <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
                 <div className="max-w-7xl mx-auto space-y-8">
                    <Skeleton className="h-12 w-1/2 mb-4" />
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[...Array(6)].map((_,i) => <Skeleton key={i} className="h-24 w-full" />)}
                    </div>
                    <Skeleton className="h-[600px] w-full" />
                </div>
            </div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
        >
            <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">
                            Dashboard Operacional
                        </h1>
                        <p className="text-slate-600 text-lg">
                            Gerencie todos os serviços da sua oficina
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowNewServiceModal(true)}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3"
                        size="lg"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Nova Ordem de Serviço
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <StatsCards
                        title="Total de Serviços"
                        value={stats.total}
                        icon={Wrench}
                        gradient="from-slate-500 to-slate-600"
                    />
                    {Object.entries(statusConfig).map(([status, cfg]) => (
                        <StatsCards
                            key={status}
                            title={cfg.title}
                            value={stats[status]}
                            icon={cfg.icon}
                            gradient={cfg.gradient}
                        />
                    ))}
                </div>

                {/* Kanban */}
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Wrench className="w-6 h-6 text-blue-600" />
                            Quadro de Serviços
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <KanbanBoard
                            servicos={localServicos} // Usar localServicos
                            clientes={clientes}
                            veiculos={veiculos}
                            onServiceClick={openService}
                            statusConfig={statusConfig}
                            isLoading={dataIsLoading && localServicos.length === 0} // KanbanBoard ainda pode ter seu próprio skeleton interno
                            // handleUpdateStatus={handleUpdateStatus} // Passar a função de atualização
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Modais */}
            <ServiceModal
                isOpen={showServiceModal}
                onClose={() => setShowServiceModal(false)}
                service={selectedService}
                onUpdate={closeService}
                clientes={clientes}
                veiculos={veiculos}
            />

            <NewServiceModal
                isOpen={showNewServiceModal}
                onClose={() => setShowNewServiceModal(false)}
                onSuccess={closeNewService}
                clientes={clientes}
                veiculos={veiculos}
            />
        </div>
    </DndContext>
    );
}