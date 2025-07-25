import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Search, MessageCircle, ExternalLink, Copy } from "lucide-react";

export default function ServiceMessages({ service, cliente, veiculo, mensagens }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [customMessage, setCustomMessage] = useState("");

    const filteredMensagens = mensagens.filter(msg =>
        msg.nome_mensagem.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const replaceVariables = (texto) => {
        return texto
            .replace(/{cliente_nome}/g, cliente?.nome_completo || '')
            .replace(/{veiculo_marca}/g, veiculo?.marca || '')
            .replace(/{veiculo_modelo}/g, veiculo?.modelo || '')
            .replace(/{veiculo_placa}/g, veiculo?.placa || '')
            .replace(/{numero_os}/g, service?.numero_os || '')
            .replace(/{status}/g, service?.status?.replace('_', ' ') || '');
    };

    const sendWhatsApp = (mensagem) => {
        const texto = replaceVariables(mensagem.texto_mensagem);
        const telefone = cliente?.telefone?.replace(/\D/g, '');
        const url = `https://wa.me/${telefone}?text=${encodeURIComponent(texto)}`;
        window.open(url, '_blank');
    };

    const copyToClipboard = (texto) => {
        navigator.clipboard.writeText(replaceVariables(texto));
    };

    const sendCustomMessage = () => {
        if (!customMessage.trim()) return;

        const telefone = cliente?.telefone?.replace(/\D/g, '');
        const url = `https://wa.me/${telefone}?text=${encodeURIComponent(customMessage)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Buscar templates de mensagem..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Mensagem Personalizada */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        Mensagem Personalizada
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        placeholder="Digite sua mensagem personalizada..."
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        className="h-24"
                    />
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={sendCustomMessage}
                            disabled={!customMessage.trim()}
                            className="flex items-center gap-2"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Enviar WhatsApp
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(customMessage)}
                            disabled={!customMessage.trim()}
                            className="flex items-center gap-2"
                        >
                            <Copy className="w-4 h-4" />
                            Copiar
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Templates de Mensagem */}
            <div className="grid gap-4">
                {filteredMensagens.map((mensagem) => (
                    <Card key={mensagem.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-lg font-semibold text-slate-900">
                                        {mensagem.nome_mensagem}
                                    </CardTitle>
                                    <Badge variant="secondary" className="mt-2">
                                        {mensagem.categoria.replace('_', ' ')}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-slate-50 p-4 rounded-lg">
                                <p className="text-sm text-slate-700 whitespace-pre-wrap">
                                    {replaceVariables(mensagem.texto_mensagem)}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => sendWhatsApp(mensagem)}
                                    className="flex items-center gap-2"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Enviar WhatsApp
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => copyToClipboard(mensagem.texto_mensagem)}
                                    className="flex items-center gap-2"
                                >
                                    <Copy className="w-4 h-4" />
                                    Copiar
                                </Button>
                            </div>

                            {mensagem.variaveis_disponiveis && mensagem.variaveis_disponiveis.length > 0 && (
                                <div className="pt-2 border-t">
                                    <p className="text-xs text-slate-500 mb-2">Variáveis disponíveis:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {mensagem.variaveis_disponiveis.map((variavel, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                                {variavel}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredMensagens.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Nenhum template encontrado</p>
                    <p className="text-sm">Tente ajustar os termos de busca</p>
                </div>
            )}
        </div>
    );
}