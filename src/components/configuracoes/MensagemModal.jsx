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
import { Save, Loader2, AlertCircle, MessageCircle } from "lucide-react";
import { createMensagem, updateMensagem } from '@/services/mensagens.service';

const FormError = ({ message }) => (
    <div className="flex items-center gap-2 text-sm text-red-600 mt-1">
        <AlertCircle className="w-4 h-4" />
        <span>{message}</span>
    </div>
);

export default function MensagemModal({ isOpen, onClose, mensagem, onSuccess }) {
    const [formData, setFormData] = useState({
        nome: '',
        texto: '',
        categoria: 'status_update',
    });

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (mensagem) {
            setFormData({
                nome: mensagem?.nome || '',
                texto: mensagem?.template || '',
                categoria: mensagem?.categoria || 'status_update',
            });
        } else {
            setFormData({
                nome: '',
                texto: '',
                categoria: 'status_update',
            });
        }
    }, [mensagem, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nome || !formData.texto) {
            alert("Preencha os campos obrigatórios!");
            return;
        }

        setIsSaving(true);

        try {
            if (mensagem) {
                // Edição de mensagem existente
                await updateMensagem(mensagem.id, { nome: formData.nome, template: formData.texto, categoria: formData.categoria });
            } else {
                // Criação de nova mensagem
                await createMensagem({ nome: formData.nome, template: formData.texto, categoria: formData.categoria });
            }
            onSuccess();
        } catch (error) {
            console.error("Erro ao salvar mensagem:", error);
            // TODO: Adicionar feedback de erro para o usuário
        } finally {
            setIsSaving(false);
        }
    };

    const categorias = [
        { value: "status_update", label: "Atualização de Status" },
        { value: "orcamento", label: "Orçamento" },
        { value: "aprovacao", label: "Aprovação" },
        { value: "conclusao", label: "Conclusão" },
        { value: "agenda", label: "Agendamento" },
        { value: "cobranca", label: "Cobrança" },
        { value: "promocao", label: "Promoção" }
    ];

    const variaveisComuns = [
        '{cliente_nome}',
        '{veiculo_modelo}',
        '{veiculo_placa}',
        '{numero_os}',
        '{data_previsao}',
        '{valor_total}',
        '{status_servico}'
    ];

    const inserirVariavel = (variavel) => {
        const textarea = document.getElementById('texto_mensagem');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = formData.texto;
        const before = text.substring(0, start);
        const after = text.substring(end, text.length);

        setFormData({
            ...formData,
            texto: before + variavel + after
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <MessageCircle className="w-6 h-6" />
                        {mensagem ? 'Editar Mensagem' : 'Nova Mensagem'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="nome">Nome da Mensagem *</Label>
                            <Input
                                id="nome"
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                placeholder="Ex: Serviço Concluído"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="categoria">Categoria</Label>
                            <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {categorias.map((categoria) => (
                                        <SelectItem key={categoria.value} value={categoria.value}>
                                            {categoria.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="texto_mensagem">Texto da Mensagem *</Label>
                        <Textarea
                            id="texto_mensagem"
                            value={formData.texto}
                            onChange={(e) => setFormData({ ...formData, texto: e.target.value })}
                            placeholder="Olá {cliente_nome}, seu veículo {veiculo_modelo} está pronto..."
                            className="h-32"
                            required
                        />
                    </div>

                    <div>
                        <Label>Variáveis Disponíveis</Label>
                        <p className="text-sm text-slate-600 mb-2">Clique nas variáveis para inserir no texto:</p>
                        <div className="flex flex-wrap gap-2">
                            {variaveisComuns.map((variavel) => (
                                <Button
                                    key={variavel}
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => inserirVariavel(variavel)}
                                    className="text-xs"
                                >
                                    {variavel}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Preview da Mensagem:</h4>
                        <p className="text-sm text-blue-800">
                            {formData.texto
                                .replace(/{cliente_nome}/g, 'João Silva')
                                .replace(/{veiculo_modelo}/g, 'Honda Civic')
                                .replace(/{veiculo_placa}/g, 'ABC-1234')
                                .replace(/{numero_os}/g, 'OS001')
                                .replace(/{data_previsao}/g, '15/12/2024')
                                .replace(/{valor_total}/g, 'R$ 350,00')
                                .replace(/{status_servico}/g, 'Em Andamento')
                            }
                        </p>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isSaving ? 'Salvando...' : mensagem ? 'Atualizar' : 'Criar Mensagem'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}