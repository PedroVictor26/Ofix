import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Wrench, Edit, Clock, CheckSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function ProcedimentosList({ procedimentos, onEdit, isLoading }) {
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
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
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => { e.stopPropagation(); onEdit(procedimento); }}
                            >
                                <Edit className="w-4 h-4" />
                            </Button>
                        </div>

                        {procedimento.checklist?.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Checklist:</p>
                                    <div className="space-y-1 max-h-20 overflow-y-auto">
                                        {procedimento.checklist.slice(0, 3).map((item, idx) => (
                                            <p key={idx} className="text-xs text-slate-600">
                                                • {item.item}
                                            </p>
                                        ))}
                                        {procedimento.checklist.length > 3 && (
                                            <p className="text-xs text-slate-500 italic">
                                                +{procedimento.checklist.length - 3} mais itens...
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </motion.div>
            ))}
        </div>
    );
}