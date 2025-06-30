import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Car, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ServiceCard({ servico, cliente, veiculo, onClick, statusConfig }) {
    return (
        <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-200 border-0 bg-white/90 backdrop-blur-sm hover:bg-white group"
            onClick={onClick}
        >
            <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-1">OS #{servico.numero_os}</h4>
                        <Badge className={`${statusConfig.color} text-xs`}>
                            {statusConfig.title}
                        </Badge>
                    </div>
                    {servico.valor_total > 0 && (
                        <div className="text-right">
                            <div className="flex items-center gap-1 text-green-600">
                                <DollarSign className="w-3 h-3" />
                                <span className="text-sm font-medium">
                                    R$ {servico.valor_total?.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-2 text-sm text-slate-600">
                    {cliente && (
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-400" />
                            <span className="truncate">{cliente.nome_completo}</span>
                        </div>
                    )}

                    {veiculo && (
                        <div className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-slate-400" />
                            <span className="truncate">{veiculo.marca} {veiculo.modelo} - {veiculo.placa}</span>
                        </div>
                    )}

                    {servico.data_entrada && (
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span>{format(new Date(servico.data_entrada), "dd/MM/yyyy", { locale: ptBR })}</span>
                        </div>
                    )}
                </div>

                {servico.descricao_problema && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                        <p className="text-xs text-slate-500 line-clamp-2">
                            {servico.descricao_problema}
                        </p>
                    </div>
                )}

                {servico.checklist_servico && servico.checklist_servico.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">Progresso</span>
                            <span className="font-medium text-slate-700">
                                {servico.checklist_servico.filter(item => item.concluido).length}/
                                {servico.checklist_servico.length}
                            </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                            <div
                                className={`bg-gradient-to-r ${statusConfig.gradient} h-1.5 rounded-full transition-all duration-300`}
                                style={{
                                    width: `${(servico.checklist_servico.filter(item => item.concluido).length / servico.checklist_servico.length) * 100}%`
                                }}
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}