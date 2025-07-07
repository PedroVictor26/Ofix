import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Wrench, Edit, Clock, CheckSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function ProcedimentosList({ procedimentos, onEdit, isLoading }) {
    const getCategoriaColor = (categoria) => {
        const colors = {
            motor: "bg-red-100 text-red-800",
            suspensao: "bg-blue-100 text-blue-800",
            freios: "bg-orange-100 text-orange-800",
            eletrica: "bg-yellow-100 text-yellow-800",
            transmissao: "bg-purple-100 text-purple-800",
            carroceria: "bg-green-100 text-green-800",
            revisao: "bg-indigo-100 text-indigo-800",
            manutencao_preventiva: "bg-slate-100 text-slate-800"
        };
        return colors[categoria] || "bg-slate-100 text-slate-800";
    };

    if (isLoading) {
        return (
            <div className="grid gap-4">
                {Array(6).fill(0).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <Skeleton className="w-12 h-12 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-3 w-2/3" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (procedimentos.length === 0) {
        return (
            <Card className="text-center py-12">
                <CardContent>
                    <Wrench className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Nenhum procedimento encontrado</h3>
                    <p className="text-slate-600">Comece criando seu primeiro procedimento padrão</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-4">
            {procedimentos.map((procedimento, index) => (
                <motion.div
                    key={procedimento.id}
<<<<<<< Updated upstream
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                    <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white group">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <Wrench className="w-6 h-6 text-white" />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-start gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-slate-900">
                                                {procedimento.nome_procedimento}
                                            </h3>
                                            <Badge className={getCategoriaColor(procedimento.categoria)}>
                                                {procedimento.categoria?.replace('_', ' ')}
                                            </Badge>
                                        </div>

                                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                            {procedimento.descricao_padrao}
                                        </p>

                                        <div className="flex items-center gap-4 text-xs text-slate-500">
                                            {procedimento.tempo_estimado > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{procedimento.tempo_estimado}h</span>
                                                </div>
                                            )}

                                            {procedimento.checklist_padrao?.length > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <CheckSquare className="w-3 h-3" />
                                                    <span>{procedimento.checklist_padrao.length} itens</span>
                                                </div>
                                            )}
                                        </div>
=======
                    className="bg-white border border-slate-200 shadow-sm rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group"
                    onClick={() => onEdit(procedimento)}
                >
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                                    <Wrench className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-300 flex items-center gap-2">
                                        {procedimento.nome}
                                        {procedimento.checklist?.length > 0 && (
                                            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 text-xs font-medium px-2 py-0.5 rounded-full">
                                                {procedimento.checklist.length} itens
                                            </Badge>
                                        )}
                                    </h3>
                                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                                        {procedimento.descricao}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                                        {procedimento.tempo_estimado > 0 && (
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>{procedimento.tempo_estimado}h</span>
                                            </div>
                                        )}
                                        {procedimento.checklist?.length > 0 && (
                                            <div className="flex items-center gap-1">
                                                <CheckSquare className="w-3 h-3" />
                                                <span>{procedimento.checklist.length} itens</span>
                                            </div>
                                        )}
>>>>>>> Stashed changes
                                    </div>
                                </div>

                                <Button
<<<<<<< Updated upstream
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onEdit(procedimento)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
=======
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
>>>>>>> Stashed changes
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Editar
                                </Button>
                            </div>

                            {procedimento.checklist_padrao?.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Checklist:</p>
                                        <div className="space-y-1 max-h-20 overflow-y-auto">
                                            {procedimento.checklist_padrao.slice(0, 3).map((item, idx) => (
                                                <p key={idx} className="text-xs text-slate-600">
                                                    • {item.item}
                                                </p>
                                            ))}
                                            {procedimento.checklist_padrao.length > 3 && (
                                                <p className="text-xs text-slate-500 italic">
                                                    +{procedimento.checklist_padrao.length - 3} mais itens...
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}