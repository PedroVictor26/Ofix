import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as servicosService from '../../services/servicos.service.js';
import { Save, Plus } from "lucide-react";
import toast from 'react-hot-toast';

// Objeto com os dados iniciais do formulário. Definido fora do componente.
const initialFormData = {
    numeroOs: '',
    clienteId: '',
    veiculoId: '',
    descricaoProblema: '',
    dataEntrada: new Date().toISOString().split('T')[0],
    kmEntrada: '',
    valorTotalEstimado: '',
};

export default function NewServiceModal({ isOpen, onClose, onSuccess: reloadDashboard, clientes, veiculos }) {
    
    // CORREÇÃO: Inicializa o estado com a constante definida acima.
    const [formData, setFormData] = useState(initialFormData);
    const [isCreating, setIsCreating] = useState(false);

    // FUNÇÃO FALTANTE: Lida com a mudança de valores nos inputs.
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.numeroOs || !formData.clienteId || !formData.veiculoId) {
            toast.error("Preencha os campos obrigatórios: Número da OS, Cliente e Veículo.");
            return;
        }

        setIsCreating(true);
        const toastId = toast.loading("Criando nova ordem de serviço...");

        try {
            const dataToSend = {
                ...formData,
                // Converte campos que devem ser numéricos antes de enviar
                kmEntrada: formData.kmEntrada ? parseInt(formData.kmEntrada, 10) : null,
                valorTotalEstimado: formData.valorTotalEstimado ? parseFloat(formData.valorTotalEstimado) : null,
            };

            await servicosService.createServico(dataToSend);
            toast.success("Ordem de Serviço criada com sucesso!", { id: toastId });
            
            setFormData(initialFormData); // Reseta o formulário para o estado inicial
            reloadDashboard(); // Recarrega os dados do dashboard
            onClose(); // Fecha o modal
        } catch (error) {
            console.error("Erro ao criar serviço:", error);
            const errorMessage = error.response?.data?.message || error.message || "Falha ao criar Ordem de Serviço.";
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsCreating(false);
        }
    };

    // A lógica para filtrar as opções continua ótima.
    const clienteOptions = Object.values(clientes || {});
    const veiculoOptions = formData.clienteId
        ? (veiculos || []).filter(v => v.clienteId === formData.clienteId)
        : [];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black dark:bg-white dark:text-black p-6 rounded-xl shadow-xl max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Plus className="w-6 h-6" />
                        Nova Ordem de Serviço
                    </DialogTitle>
                    <DialogDescription>
                        Numero da OS
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
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
                                required
                            >
                                <SelectTrigger>
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
                                value={formData.veiculoId}
                                onValueChange={(value) => setFormData({ ...formData, veiculoId: value })}
                                disabled={!formData.clienteId || veiculoOptions.length === 0}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={!formData.clienteId ? "Selecione um cliente primeiro" : "Selecione o veículo"} />
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="kmEntrada">KM de Entrada</Label>
                            <Input id="kmEntrada" type="number" value={formData.kmEntrada} onChange={handleChange} />
                        </div>
                        <div>
                            <Label htmlFor="valorTotalEstimado">Valor Estimado (R$)</Label>
                            <Input id="valorTotalEstimado" type="number" step="0.01" value={formData.valorTotalEstimado} onChange={handleChange} placeholder="0.00"/>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="descricaoProblema">Descrição do Problema</Label>
                        <Textarea
                            id="descricaoProblema"
                            value={formData.descricaoProblema}
                            onChange={handleChange}
                            placeholder="Descreva o problema relatado pelo cliente..."
                            className="h-24"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
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