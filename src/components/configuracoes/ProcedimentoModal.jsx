import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
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
import { ProcedimentoPadrao } from "../../entities/mock-data";
import { Save, Wrench, Plus, X } from "lucide-react";

export default function ProcedimentoModal({ isOpen, onClose, procedimento, onSuccess }) {
    const [formData, setFormData] = useState({
        nome_procedimento: '',
        descricao_padrao: '',
        checklist_padrao: [],
        tempo_estimado: 0,
        categoria: 'manutencao_preventiva'
    });

    const [checklistItem, setChecklistItem] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (procedimento) {
            setFormData({
                nome_procedimento: procedimento.nome_procedimento || '',
                descricao_padrao: procedimento.descricao_padrao || '',
                checklist_padrao: procedimento.checklist_padrao || [],
                tempo_estimado: procedimento.tempo_estimado || 0,
                categoria: procedimento.categoria || 'manutencao_preventiva'
            });
        } else {
            setFormData({
                nome_procedimento: '',
                descricao_padrao: '',
                checklist_padrao: [],
                tempo_estimado: 0,
                categoria: 'manutencao_preventiva'
            });
        }
    }, [procedimento, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nome_procedimento || !formData.descricao_padrao) {
            toast.error("Preencha os campos obrigatórios: Nome do Procedimento e Descrição Padrão.");
            return;
        }

        setIsSaving(true);
        const toastId = toast.loading(procedimento ? "Atualizando procedimento..." : "Criando procedimento...");

        try {
            if (procedimento) {
                await ProcedimentoPadrao.update(procedimento.id, formData);
            } else {
                await ProcedimentoPadrao.create(formData);
            }
            toast.success(procedimento ? "Procedimento atualizado com sucesso!" : "Procedimento criado com sucesso!", { id: toastId });
            onSuccess();
        } catch (error) {
            console.error("Erro ao salvar procedimento:", error);
            toast.error(`Erro ao salvar procedimento: ${error.message || 'Erro desconhecido'}`, { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    const addChecklistItem = () => {
        if (checklistItem.trim()) {
            setFormData({
                ...formData,
                checklist_padrao: [
                    ...formData.checklist_padrao,
                    {
                        item: checklistItem.trim(),
                        obrigatorio: false,
                        ordem: formData.checklist_padrao.length + 1
                    }
                ]
            });
            setChecklistItem('');
        }
    };

    const removeChecklistItem = (index) => {
        const updatedChecklist = formData.checklist_padrao.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            checklist_padrao: updatedChecklist
        });
    };

    const categorias = [
        { value: "motor", label: "Motor" },
        { value: "suspensao", label: "Suspensão" },
        { value: "freios", label: "Freios" },
        { value: "eletrica", label: "Elétrica" },
        { value: "transmissao", label: "Transmissão" },
        { value: "carroceria", label: "Carroceria" },
        { value: "revisao", label: "Revisão" },
        { value: "manutencao_preventiva", label: "Manutenção Preventiva" }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Wrench className="w-6 h-6" />
                        {procedimento ? 'Editar Procedimento' : 'Novo Procedimento'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="nome_procedimento">Nome do Procedimento *</Label>
                            <Input
                                id="nome_procedimento"
                                value={formData.nome_procedimento}
                                onChange={(e) => setFormData({ ...formData, nome_procedimento: e.target.value })}
                                placeholder="Ex: Troca de Óleo"
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
                        <Label htmlFor="tempo_estimado">Tempo Estimado (horas)</Label>
                        <Input
                            id="tempo_estimado"
                            type="number"
                            step="0.5"
                            value={formData.tempo_estimado}
                            onChange={(e) => setFormData({ ...formData, tempo_estimado: parseFloat(e.target.value) || 0 })}
                            placeholder="1.5"
                        />
                    </div>

                    <div>
                        <Label htmlFor="descricao_padrao">Descrição Padrão *</Label>
                        <Textarea
                            id="descricao_padrao"
                            value={formData.descricao_padrao}
                            onChange={(e) => setFormData({ ...formData, descricao_padrao: e.target.value })}
                            placeholder="Descreva o procedimento detalhadamente..."
                            className="h-24"
                            required
                        />
                    </div>

                    <div>
                        <Label>Checklist Padrão</Label>
                        <div className="flex gap-2 mb-3">
                            <Input
                                value={checklistItem}
                                onChange={(e) => setChecklistItem(e.target.value)}
                                placeholder="Adicionar item ao checklist..."
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addChecklistItem())}
                            />
                            <Button type="button" onClick={addChecklistItem} variant="outline">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>

                        {formData.checklist_padrao.length > 0 && (
                            <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                                {formData.checklist_padrao.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded">
                                        <span className="flex-1">{item.item}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeChecklistItem(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
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
                            {isSaving ? 'Salvando...' : procedimento ? 'Atualizar' : 'Criar Procedimento'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}