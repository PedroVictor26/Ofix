import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createTransacao, updateTransacao } from '@/services/financeiro.service';
import { Save, Loader2, AlertCircle, TrendingUp, TrendingDown, CalendarDays } from "lucide-react";

export default function FinanceiroModal({ isOpen, onClose, transacao, onSuccess }) {
    const [formData, setFormData] = useState({
        valor: '',
        tipo: 'entrada', // 'entrada' ou 'saida'
        data: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
        descricao: '',
        servicoId: null,
        clienteId: null,
    });

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            if (transacao) {
                setFormData({
                    valor: transacao.valor || '',
                    tipo: transacao.tipo || 'entrada',
                    data: transacao.data ? new Date(transacao.data).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    descricao: transacao.descricao || '',
                    servicoId: transacao.servicoId || null,
                    clienteId: transacao.clienteId || null,
                });
            } else {
                setFormData({
                    valor: '',
                    tipo: 'entrada',
                    data: new Date().toISOString().split('T')[0],
                    descricao: '',
                    servicoId: null,
                    clienteId: null,
                });
            }
            setError(null);
        }
    }, [isOpen, transacao]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.valor || !formData.data || !formData.tipo) {
            setError("Preencha todos os campos obrigatórios: Valor, Data e Tipo.");
            return;
        }

        const dadosParaEnviar = {
            ...formData,
            valor: parseFloat(formData.valor),
            servicoId: formData.servicoId || null, // Garante que é ID ou null
            clienteId: formData.clienteId || null, // Garante que é ID ou null
        };

        setIsSaving(true);

        try {
            if (transacao) {
                await updateTransacao(transacao.id, dadosParaEnviar);
            } else {
                await createTransacao(dadosParaEnviar);
            }
            onSuccess();
        } catch (err) {
            console.error("Erro ao salvar transação:", err);
            setError(err.response?.data?.error || "Erro ao salvar transação.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-white shadow-lg z-50">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        {transacao ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                        {transacao ? 'Editar Transação' : 'Nova Transação'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Erro: </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="valor">Valor *</Label>
                            <Input
                                id="valor"
                                type="number"
                                step="0.01"
                                value={formData.valor}
                                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                                placeholder="0.00"
                                required
                                disabled={isSaving}
                            />
                        </div>

                        <div>
                            <Label htmlFor="tipo">Tipo *</Label>
                            <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })} disabled={isSaving}>
                                <SelectTrigger id="tipo">
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="entrada">Entrada</SelectItem>
                                    <SelectItem value="saida">Saída</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="data">Data *</Label>
                        <Input
                            id="data"
                            type="date"
                            value={formData.data}
                            onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                            required
                            disabled={isSaving}
                        />
                    </div>

                    <div>
                        <Label htmlFor="descricao">Descrição</Label>
                        <Textarea
                            id="descricao"
                            value={formData.descricao}
                            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                            placeholder="Descrição da transação (ex: Venda de peças, Pagamento de aluguel)"
                            className="h-20"
                            disabled={isSaving}
                        />
                    </div>

                    {/* Campos opcionais para vincular a serviço/cliente */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="servicoId">Vincular a Serviço (Opcional)</Label>
                            <Input
                                id="servicoId"
                                value={formData.servicoId || ''}
                                onChange={(e) => setFormData({ ...formData, servicoId: e.target.value || null })}
                                placeholder="ID do Serviço"
                                disabled={isSaving}
                            />
                        </div>
                        <div>
                            <Label htmlFor="clienteId">Vincular a Cliente (Opcional)</Label>
                            <Input
                                id="clienteId"
                                value={formData.clienteId || ''}
                                onChange={(e) => setFormData({ ...formData, clienteId: e.target.value || null })}
                                placeholder="ID do Cliente"
                                disabled={isSaving}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isSaving ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</>
                            ) : (
                                <><Save className="w-4 h-4 mr-2" /> {transacao ? 'Atualizar' : 'Criar Transação'}</>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}