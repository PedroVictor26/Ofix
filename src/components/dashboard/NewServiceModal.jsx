import React, { useState } from 'react';
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
// Servico (mock) não é mais usado diretamente para criação, usaremos o service
import * as servicosService from '../../services/servicos.service.js'; // Importar o service
import { Save, Plus } from "lucide-react";
import toast from 'react-hot-toast';

// onSuccess agora será a função reload do useDashboardData
export default function NewServiceModal({ isOpen, onClose, onSuccess: reloadDashboard, clientes, veiculos }) {
    const initialFormData = {
        numeroOs: '', // Backend espera numeroOs
        clienteId: '', // Backend espera clienteId
        veiculoId: '', // Backend espera veiculoId
        descricaoProblema: '', // Backend espera descricaoProblema
        dataEntrada: new Date().toISOString().split('T')[0],
        // Adicionar outros campos que o backend espera, conforme schema.prisma
        // status: 'AGUARDANDO', // O backend pode definir um status padrão
        // responsavelId: null, // Pode ser definido depois
    };
    const [formData, setFormData] = useState(initialFormData);
        veiculo_id: '',
        descricao_problema: '',
        data_entrada: new Date().toISOString().split('T')[0],
        data_previsao: '',
        valor_mao_obra: 0
    });

    const [isCreating, setIsCreating] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Ajustar nomes dos campos para o que o backend espera
        if (!formData.numeroOs || !formData.clienteId || !formData.veiculoId) {
            toast.error("Preencha os campos obrigatórios: Número da OS, Cliente e Veículo.");
            return;
        }

        setIsCreating(true);
        const toastId = toast.loading("Criando nova ordem de serviço...");

        try {
            // Prepara os dados para enviar, garantindo que campos numéricos sejam números
            const dataToSend = {
                ...formData,
                kmEntrada: formData.kmEntrada ? parseInt(formData.kmEntrada, 10) : undefined,
                valorTotalEstimado: formData.valorTotalEstimado ? parseFloat(formData.valorTotalEstimado) : undefined,
                // Adicionar outros campos conforme necessário
            };

            await servicosService.createServico(dataToSend);
            toast.success("Ordem de Serviço criada com sucesso!", { id: toastId });
            setFormData(initialFormData); // Reset form
            reloadDashboard(); // Recarrega os dados do dashboard
            onClose(); // Fecha o modal
        } catch (error) {
            console.error("Erro ao criar serviço:", error);
            toast.error(error.message || "Falha ao criar Ordem de Serviço.", { id: toastId });
        } finally {
            setIsCreating(false);
        }
    };

    // Clientes e Veiculos são mapas passados como props
    const clienteOptions = Object.values(clientes || {});
    const veiculoOptions = formData.clienteId
        ? Object.values(veiculos || {}).filter(v => v.clienteId === formData.clienteId)
        : [];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Plus className="w-6 h-6" />
                        Nova Ordem de Serviço
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="numeroOs">Número da OS *</Label>
                            <Input
                                id="numeroOs"
                                value={formData.numeroOs}
                                onChange={handleChange}
                                placeholder="Ex: OS2024-001"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="dataEntrada">Data de Entrada</Label>
                            <Input
                                id="dataEntrada"
                                type="date"
                                value={formData.dataEntrada}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="clienteId">Cliente *</Label>
                            <Select
                                value={formData.clienteId}
                                onValueChange={(value) => setFormData({ ...formData, clienteId: value, veiculoId: '' })}
                            >
                                <SelectTrigger id="clienteIdSelectTrigger">
                                    <SelectValue placeholder="Selecione o cliente" />
                                </SelectTrigger>
                                <SelectContent>
                                    {clienteOptions.map((cliente) => (
                                        <SelectItem key={cliente.id} value={cliente.id.toString()}>
                                            {cliente.nomeCompleto}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="veiculoId">Veículo *</Label>
                            <Select
                                value={formData.veiculoId} // Campo ajustado
                                onValueChange={(value) => setFormData({ ...formData, veiculoId: value })}
                                disabled={!formData.clienteId}
                            >
                                <SelectTrigger id="veiculoIdSelectTrigger">
                                    <SelectValue placeholder="Selecione o veículo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {veiculoOptions.map((veiculo) => (
                                        <SelectItem key={veiculo.id} value={veiculo.id.toString()}>
                                            {veiculo.marca} {veiculo.modelo} - {veiculo.placa}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Adicionar campos kmEntrada e valorTotalEstimado se desejar */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="kmEntrada">KM de Entrada</Label>
                            <Input id="kmEntrada" type="number" value={formData.kmEntrada || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <Label htmlFor="valorTotalEstimado">Valor Estimado (R$)</Label>
                            <Input id="valorTotalEstimado" type="number" step="0.01" value={formData.valorTotalEstimado || ''} onChange={handleChange} placeholder="0.00"/>
                        </div>
                    </div>


                    <div>
                        <Label htmlFor="descricaoProblema">Descrição do Problema</Label>
                        <Textarea
                            id="descricaoProblema" // Campo ajustado
                            value={formData.descricaoProblema}
                            onChange={handleChange}
                            placeholder="Descreva o problema relatado pelo cliente..."
                            className="h-24"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => { setFormData(initialFormData); onClose();}}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isCreating}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isCreating ? 'Criando...' : 'Criar Ordem de Serviço'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}