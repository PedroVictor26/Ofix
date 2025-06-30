import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, Calendar, User, Car, DollarSign } from "lucide-react";
import { format } from "date-fns";

export default function ServiceDetails({ service, cliente, veiculo, onUpdate }) {
    const [formData, setFormData] = useState({
        status: service.status || 'aguardando',
        descricao_problema: service.descricao_problema || '',
        diagnostico_tecnico: service.diagnostico_tecnico || '',
        valor_mao_obra: service.valor_mao_obra || 0,
        data_previsao: service.data_previsao || '',
        checklist_servico: service.checklist_servico || []
    });

    const [isUpdating, setIsUpdating] = useState(false);

    const handleSave = async () => {
        setIsUpdating(true);
        await onUpdate(formData);
        setIsUpdating(false);
    };

    const updateChecklistItem = (index, field, value) => {
        const newChecklist = [...formData.checklist_servico];
        newChecklist[index] = { ...newChecklist[index], [field]: value };
        setFormData({ ...formData, checklist_servico: newChecklist });
    };

    const addChecklistItem = () => {
        setFormData({
            ...formData,
            checklist_servico: [
                ...formData.checklist_servico,
                { item: '', concluido: false, observacao: '' }
            ]
        });
    };

    return (
        <div className="space-y-6">
            {/* Informações do Serviço */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                            <User className="w-4 h-4" />
                            Cliente
                        </div>
                        <p className="font-semibold">{cliente?.nome_completo}</p>
                        <p className="text-sm text-slate-500">{cliente?.telefone}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                            <Car className="w-4 h-4" />
                            Veículo
                        </div>
                        <p className="font-semibold">{veiculo?.marca} {veiculo?.modelo}</p>
                        <p className="text-sm text-slate-500">{veiculo?.placa} - {veiculo?.ano}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                            <Calendar className="w-4 h-4" />
                            Data de Entrada
                        </div>
                        <p className="font-semibold">
                            {service.data_entrada ? format(new Date(service.data_entrada), "dd/MM/yyyy") : 'Não informado'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Formulário de Edição */}
            <Card>
                <CardHeader>
                    <CardTitle>Detalhes do Serviço</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="aguardando">Aguardando</SelectItem>
                                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                                    <SelectItem value="aguardando_pecas">Aguardando Peças</SelectItem>
                                    <SelectItem value="aguardando_aprovacao">Aguardando Aprovação</SelectItem>
                                    <SelectItem value="finalizado">Finalizado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="data_previsao">Data de Previsão</Label>
                            <Input
                                id="data_previsao"
                                type="date"
                                value={formData.data_previsao}
                                onChange={(e) => setFormData({ ...formData, data_previsao: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="descricao_problema">Descrição do Problema</Label>
                        <Textarea
                            id="descricao_problema"
                            value={formData.descricao_problema}
                            onChange={(e) => setFormData({ ...formData, descricao_problema: e.target.value })}
                            placeholder="Descreva o problema relatado pelo cliente..."
                            className="h-24"
                        />
                    </div>

                    <div>
                        <Label htmlFor="diagnostico_tecnico">Diagnóstico Técnico</Label>
                        <Textarea
                            id="diagnostico_tecnico"
                            value={formData.diagnostico_tecnico}
                            onChange={(e) => setFormData({ ...formData, diagnostico_tecnico: e.target.value })}
                            placeholder="Diagnóstico técnico detalhado..."
                            className="h-24"
                        />
                    </div>

                    <div>
                        <Label htmlFor="valor_mao_obra">Valor da Mão de Obra</Label>
                        <Input
                            id="valor_mao_obra"
                            type="number"
                            step="0.01"
                            value={formData.valor_mao_obra}
                            onChange={(e) => setFormData({ ...formData, valor_mao_obra: parseFloat(e.target.value) || 0 })}
                            placeholder="0,00"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Checklist */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Checklist do Serviço</CardTitle>
                    <Button variant="outline" size="sm" onClick={addChecklistItem}>
                        Adicionar Item
                    </Button>
                </CardHeader>
                <CardContent>
                    {formData.checklist_servico.length === 0 ? (
                        <p className="text-slate-500 text-center py-4">Nenhum item no checklist</p>
                    ) : (
                        <div className="space-y-3">
                            {formData.checklist_servico.map((item, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                                    <Checkbox
                                        checked={item.concluido}
                                        onCheckedChange={(checked) => updateChecklistItem(index, 'concluido', checked)}
                                    />
                                    <div className="flex-1 space-y-2">
                                        <Input
                                            value={item.item}
                                            onChange={(e) => updateChecklistItem(index, 'item', e.target.value)}
                                            placeholder="Descrição da tarefa..."
                                        />
                                        <Input
                                            value={item.observacao || ''}
                                            onChange={(e) => updateChecklistItem(index, 'observacao', e.target.value)}
                                            placeholder="Observações..."
                                            className="text-sm"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Botão Salvar */}
            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="bg-green-600 hover:bg-green-700"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
            </div>
        </div>
    );
}