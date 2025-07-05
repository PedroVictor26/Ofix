import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import DraggableServiceCard from './DraggableServiceCard';

export default function KanbanColumn({ status, config, servicos, serviceIds, clientes, veiculos, onServiceClick }) {
    const { setNodeRef, isOver } = useDroppable({
        id: status,
        data: {
            type: 'column',
        }
    });

    return (
        <div className="flex-shrink-0 w-80">
            <div className="bg-slate-100 rounded-xl p-4">
                {/* Cabeçalho da Coluna */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <config.icon className={`w-5 h-5 ${config.color}`} />
                        <h3 className={`font-semibold text-slate-700`}>{config.title}</h3>
                    </div>
                    <Badge variant="secondary" className="text-sm font-semibold">
                        {servicos?.length || 0}
                    </Badge>
                </div>

                {/* Área dos Cards */}
                <ScrollArea
                    ref={setNodeRef}
                    className={`h-[calc(100vh-280px)] rounded-md transition-colors duration-200 ${isOver ? 'bg-blue-50' : ''}`}
                >
                    <SortableContext items={serviceIds || []} strategy={verticalListSortingStrategy}>
                        <div className="space-y-3 p-1">
                            {servicos && servicos.length > 0 ? (
                                servicos.map((servico) => {
                                    const cliente = clientes[servico.clienteId];
                                    const veiculo = veiculos.find(v =>
                                        v.id === servico.veiculoId ||
                                        v.id === servico.veiculo?.id
                                    );
                                    return (
                                        <DraggableServiceCard
                                            key={servico.id}
                                            id={servico.id.toString()}
                                            servico={servico}
                                            cliente={cliente}
                                            veiculo={veiculo}
                                            onClick={() => {
                                                console.log("Service passed to onClick in KanbanColumn:", servico); // Adicionado para depuração
                                                onServiceClick(servico);
                                            }}
                                        />
                                    );
                                })
                            ) : (
                                <div className="text-center py-10 min-h-[100px] flex items-center justify-center">
                                    <p className="text-sm text-slate-500">Arraste os cards para cá</p>
                                </div>
                            )}
                        </div>
                    </SortableContext>
                </ScrollArea>
            </div>
        </div>
    );
}
