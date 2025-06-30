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
import { Servico } from "../../entities/mock-data";
import { Save, Plus } from "lucide-react";
import toast from 'react-hot-toast'; // Import toast

export default function NewServiceModal({ isOpen, onClose, onSuccess, clientes, veiculos }) {
    const [formData, setFormData] = useState({
        numero_os: '',
        cliente_id: '',
        veiculo_id: '',
        descricao_problema: '',
        data_entrada: new Date().toISOString().split('T')[0],
        data_previsao: '',
        valor_mao_obra: 0
    });

    const [isCreating, setIsCreating] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.numero_os || !formData.cliente_id || !formData.veiculo_id) {
            toast.error("Preencha os campos obrigatórios: Número da OS, Cliente e Veículo.");
            return;
        }

        setIsCreating(true);
        const toastId = toast.loading("Criando nova ordem de serviço...");

        try {
            // Simula a criação do serviço. No mock-data, Servico.create não existe,
            // então vamos apenas simular o sucesso.
            // Em uma implementação real: await Servico.create(...);
            console.log("Simulando criação de serviço:", {
                 ...formData,
                status: 'aguardando',
                responsavel_id: 'current_user', // Seria o ID do usuário atual
                // Mock-data não tem ID auto-gerado, então não podemos adicionar à lista facilmente sem mudar o mock
            });

            // Simular um pequeno delay da API
            await new Promise(resolve => setTimeout(resolve, 700));

            toast.success("Ordem de Serviço criada com sucesso!", { id: toastId });

            // Reset form
            setFormData({
                numero_os: '',
                cliente_id: '',
                veiculo_id: '',
                descricao_problema: '',
                data_entrada: new Date().toISOString().split('T')[0],
                data_previsao: '',
                valor_mao_obra: 0
            });

            onSuccess(); // Chama a função para fechar o modal e recarregar dados no Dashboard
        } catch (error) {
            console.error("Erro ao criar serviço:", error);
            toast.error("Falha ao criar Ordem de Serviço. Tente novamente.", { id: toastId });
        } finally {
            setIsCreating(false);
        }
    };

    // Ajuste para garantir que clientes e veiculos sejam arrays antes de usar filter/map
    const safeClientes = Array.isArray(clientes) ? clientes : Object.values(clientes || {});
    const safeVeiculos = Array.isArray(veiculos) ? veiculos : Object.values(veiculos || {});

    const clienteVeiculos = formData.cliente_id
        ? safeVeiculos.filter(v => v.cliente_id === formData.cliente_id)
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
                            <Label htmlFor="numero_os">Número da OS *</Label>
                            <Input
                                id="numero_os"
                                value={formData.numero_os}
                                onChange={(e) => setFormData({ ...formData, numero_os: e.target.value })}
                                placeholder="Ex: OS001"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="data_entrada">Data de Entrada</Label>
                            <Input
                                id="data_entrada"
                                type="date"
                                value={formData.data_entrada}
                                onChange={(e) => setFormData({ ...formData, data_entrada: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="cliente_id">Cliente *</Label>
                            <Select value={formData.cliente_id} onValueChange={(value) => setFormData({ ...formData, cliente_id: value, veiculo_id: '' })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o cliente" />
                                </SelectTrigger>
                                <SelectContent>
                                    {clientes.map((cliente) => (
                                        <SelectItem key={cliente.id} value={cliente.id}>
                                            {cliente.nome_completo}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="veiculo_id">Veículo *</Label>
                            <Select
                                value={formData.veiculo_id}
                                onValueChange={(value) => setFormData({ ...formData, veiculo_id: value })}
                                disabled={!formData.cliente_id}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o veículo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {clienteVeiculos.map((veiculo) => (
                                        <SelectItem key={veiculo.id} value={veiculo.id}>
                                            {veiculo.marca} {veiculo.modelo} - {veiculo.placa}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="data_previsao">Data de Previsão</Label>
                            <Input
                                id="data_previsao"
                                type="date"
                                value={formData.data_previsao}
                                onChange={(e) => setFormData({ ...formData, data_previsao: e.target.value })}
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

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={onClose}>
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