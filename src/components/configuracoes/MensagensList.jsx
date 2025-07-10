import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, Edit, Hash } from "lucide-react";
import { motion } from "framer-motion";

export default function MensagensList({ mensagens, onEdit, isLoading }) {
    console.log("Mensagens recebidas no MensagensList:", mensagens);
    const getCategoriaColor = (categoria) => {
        const colors = {
            status_update: "bg-blue-100 text-blue-800",
            orcamento: "bg-green-100 text-green-800",
            aprovacao: "bg-yellow-100 text-yellow-800",
            conclusao: "bg-purple-100 text-purple-800",
            agenda: "bg-indigo-100 text-indigo-800",
            cobranca: "bg-red-100 text-red-800",
            promocao: "bg-pink-100 text-pink-800"
        };
        return colors[categoria] || "bg-slate-100 text-slate-800";
    };

    const getCategoriaLabel = (categoria) => {
        const labels = {
            status_update: "Atualização de Status",
            orcamento: "Orçamento",
            aprovacao: "Aprovação",
            conclusao: "Conclusão",
            agenda: "Agendamento",
            cobranca: "Cobrança",
            promocao: "Promoção"
        };
        return labels[categoria] || categoria;
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

    if (mensagens.length === 0) {
        return (
            <Card className="text-center py-12">
                <CardContent>
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Nenhuma mensagem encontrada</h3>
                    <p className="text-slate-600">Comece criando seu primeiro template de mensagem</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-4">
            {mensagens.map((mensagem, index) => (
                <motion.div
                    key={mensagem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                    <Card 
                        className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white group"
                        onClick={() => onEdit(mensagem)}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <MessageCircle className="w-6 h-6 text-white" />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-start gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-slate-900">
                                                {mensagem.nome}
                                            </h3>
                                            <Badge className={getCategoriaColor(mensagem.categoria)}>
                                                {getCategoriaLabel(mensagem.categoria)}
                                            </Badge>
                                        </div>

                                        <p className="text-sm text-slate-600 mb-3 line-clamp-3">
                                            {mensagem.template}
                                        </p>

                                        {/* Removido variaveis_disponiveis pois não está no modelo atual */}
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => e.stopPropagation()} // Adicionado stopPropagation
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Editar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}