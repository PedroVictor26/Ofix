import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import ServiceCard from './ServiceCard';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useDroppable, useDndMonitor } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import DraggableServiceCard from './DraggableServiceCard'; // Criaremos este componente

export default function KanbanColumn({ status, config, servicos, serviceIds, clientes, veiculos, onServiceClick }) {
    const { setNodeRef, isOver } = useDroppable({
        id: status, // ID da coluna (ex: "aguardando", "em_andamento")
        data: {
            type: 'column', // Para identificar o tipo de droppable no handleDragEnd
            accepts: ['card'] // Que tipo de draggable ele aceita
        }
    });

    // Para feedback visual quando um card está sobre a coluna
    const columnStyle = isOver ? { outline: '2px dashed #2563eb' } : {};

    return (
        <div
            ref={setNodeRef}
            className="flex-shrink-0 w-80 p-1 rounded-lg" // Adicionado padding e rounded
            style={columnStyle} // Estilo para quando está "isOver"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <config.icon className={`w-5 h-5 ${config.textColor || 'text-slate-700'}`} />
                    <h3 className={`font-semibold ${config.textColor || 'text-slate-700'}`}>{config.title}</h3>
                </div>
                <Badge variant="secondary" className="text-sm">
                    {servicos?.length || 0}
                </Badge>
            </div>

            <ScrollArea className="h-[calc(100vh-280px)] pr-3">
                <SortableContext items={serviceIds || []} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                        <AnimatePresence mode="popLayout"> {/* Adicionado AnimatePresence */}
                            {servicos && servicos.length > 0 ? (
                                servicos.map((servico) => {
                                    const cliente = clientes[servico.cliente_id];
                                const veiculo = veiculos[servico.veiculo_id];
                                return (
                                    <DraggableServiceCard
                                        key={servico.id}
                                        id={servico.id.toString()} // ID para dnd-kit precisa ser string
                                        servico={servico}
                                        cliente={cliente}
                                        veiculo={veiculo}
                                        onClick={() => onServiceClick(servico)}
                                        statusConfig={config}
                                    />
                                );
                            })
                            ) : (
                                // Manter um placeholder visível para drop, mesmo que não animado pela AnimatePresence
                                // ou remover se a coluna vazia não precisar de feedback especial além do `isOver`
                                <></>
                            )}
                        </AnimatePresence>
                        {/* Placeholder para quando a coluna está vazia e não há itens para AnimatePresence */}
                        {(!servicos || servicos.length === 0) && (
                             <div className="text-center py-10 min-h-[100px]">
                                <p className="text-sm text-slate-500">Arraste cards para cá</p>
                            </div>
                        )}
                    </div>
                </SortableContext>
                <ScrollBar orientation="vertical" />
            </ScrollArea>
        </div>
    );
}