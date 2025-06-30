import React, { useState, useMemo, useEffect } from "react";
import { Plus, Wrench, AlertCircle, RefreshCw } from "lucide-react"; // Adicionado AlertCircle, RefreshCw
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Adicionado Skeleton
import toast from 'react-hot-toast'; // Adicionado toast se não estiver
import * as servicosService from '../services/servicos.service.js'; // Adicionado se não estiver

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
        isLoading: dataIsLoading,
        error: dataError, // Novo estado de erro do hook
        reload
    } = useDashboardData();

    const [localServicos, setLocalServicos] = useState([]);
    const [activeDraggedItem, setActiveDraggedItem] = useState(null); // Para o overlay do drag
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

    const handleDragStart = (event) => {
        const { active } = event;
        const servico = localServicos.find(s => s.id === active.id);
        if (servico) {
            const cliente = clientes[servico.cliente_id];
            const veiculo = veiculos[servico.veiculo_id];
            setActiveDraggedItem({ ...servico, cliente, veiculo });
        }
    };

    const handleDragEnd = async (event) => {
        setActiveDraggedItem(null);
        const { active, over } = event;

        if (!over) return;

        const activeId = active.id.toString();
        let novoStatus = over.id.toString(); // ID da coluna de destino (status)

        // Se soltar sobre um card, o ID da coluna é `over.data.current.sortable.containerId`
        if (over.data.current?.type !== 'column' && over.data.current?.sortable?.containerId) {
            novoStatus = over.data.current.sortable.containerId.toString();
        }

        const servicoArrastado = localServicos.find(s => s.id.toString() === activeId);

        if (servicoArrastado && servicoArrastado.status !== novoStatus) {
            // Atualização Otimista: Atualiza o estado local imediatamente
            const servicosAnteriores = [...localServicos];
            setLocalServicos(prevServicos =>
                prevServicos.map(s =>
                    s.id.toString() === activeId ? { ...s, status: novoStatus } : s
                )
            );

            try {
                // Chama a API para atualizar o status
                await servicosService.updateServico(activeId, { status: novoStatus });
                toast.success(`Serviço #${servicoArrastado.numeroOs} movido para ${statusConfig[novoStatus]?.title || novoStatus}.`);
                // Opcional: Chamar reload() se quiser garantir consistência total com o backend,
                // mas a atualização otimista já melhora a UX.
                // reload();
            } catch (error) {
                console.error("Falha ao atualizar status do serviço:", error);
                toast.error(error.message || "Falha ao mover serviço.");
                // Reverte para o estado anterior em caso de erro
                setLocalServicos(servicosAnteriores);
            }
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

    // 1. Tratar o estado de erro primeiro
    if (dataError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
                <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-red-700 mb-2">Oops! Algo deu errado.</h2>
                    <p className="text-slate-600 mb-4">Não foi possível carregar os dados do dashboard.</p>
                    <p className="text-sm text-slate-500 mb-6">Erro: {typeof dataError === 'string' ? dataError : dataError.message || JSON.stringify(dataError)}</p>
                    <Button onClick={reload} className="bg-red-600 hover:bg-red-700">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Tentar Novamente
                    </Button>
                </div>
            </div>
        );
    }

    // 2. Tratar o estado de carregamento inicial (antes do DndContext para evitar problemas)
    // O KanbanBoard em si também tem lógica de isLoading, mas aqui é para o DndContext não montar sem dados.
    if (dataIsLoading && localServicos.length === 0 && !activeDraggedItem) {
        // Pode-se retornar um loader geral para a página ou um skeleton mais completo
        // Usando o Skeleton importado de "@/components/ui/skeleton"
        return (
            <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
                 <div className="max-w-7xl mx-auto space-y-8">
                    {/* Skeleton para o Header do Dashboard */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div>
                            <Skeleton className="h-10 w-72 mb-2" /> {/* Título */}
                            <Skeleton className="h-6 w-96" />      {/* Subtítulo */}
                        </div>
                        <Skeleton className="h-12 w-56" /> {/* Botão Nova OS */}
                    </div>
                     {/* Skeleton para StatsCards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[...Array(6)].map((_,i) => <Skeleton key={i} className="h-28 w-full rounded-lg" />)}
                    </div>
                    {/* Skeleton para o KanbanBoard */}
                    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                            <Skeleton className="h-8 w-1/3" />
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="flex gap-6 overflow-x-auto pb-4">
                                {['col1', 'col2', 'col3', 'col4'].map((statusKey) => (
                                    <div key={statusKey} className="flex-shrink-0 w-80">
                                        <Skeleton className="h-8 w-32 mb-4" />
                                        <div className="space-y-3">
                                            {[1, 2, 3].map((i) => (
                                                <Skeleton key={i} className="h-32 w-full rounded-md" />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
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