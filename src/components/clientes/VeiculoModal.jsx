import { useState, useEffect } from 'react';
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
import { createVeiculo } from "../../services/clientes.service";
import { Save, Car } from "lucide-react";

export default function VeiculoModal({ isOpen, onClose, clienteId, onSuccess }) {
    const [formData, setFormData] = useState({
        placa: '',
        marca: '',
        modelo: '',
        ano: new Date().getFullYear(),
        cor: '',
        observacoes: ''
    });

    const [isSaving, setIsSaving] = useState(false);

    // Adicionado para depuração: loga clienteId quando o modal abre
    useEffect(() => {
        console.log("VeiculoModal aberto. clienteId:", clienteId);
        // Reseta o formulário quando o modal abre
        if (isOpen) {
            setFormData({
                placa: '',
                marca: '',
                modelo: '',
                ano: new Date().getFullYear(),
                cor: '',
                observacoes: ''
            });
        }
    }, [isOpen, clienteId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.placa || !formData.marca || !formData.modelo) {
            toast.error("Preencha os campos obrigatórios: Placa, Marca e Modelo.");
            return;
        }

        // Adicionado para depuração: loga os dados antes de enviar
        console.log("Enviando dados do veículo. clienteId:", clienteId, "formData:", formData);

        setIsSaving(true);
        const toastId = toast.loading("Salvando veículo...");

        try {
            await createVeiculo(clienteId, formData);

            setFormData({
                placa: '',
                marca: '',
                modelo: '',
                ano: new Date().getFullYear(),
                cor: '',
                observacoes: ''
            });
            toast.success("Veículo salvo com sucesso! 🎉", { id: toastId });
            onSuccess();
        } catch (error) {
            console.error("Erro ao salvar veículo:", error);
            const errorMessage = error.response?.data?.error?.message || "Falha ao salvar o veículo.";
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black dark:bg-white dark:text-black p-6 rounded-xl shadow-xl max-w-3xl" aria-describedby="veiculo-modal-description">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Car className="w-6 h-6" />
                        Novo Veículo
                    </DialogTitle>
                    <p id="veiculo-modal-description" className="sr-only">
                        Preencha as informações do novo veículo.
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="placa">Placa *</Label>
                            <Input
                                id="placa"
                                value={formData.placa}
                                onChange={(e) => setFormData({ ...formData, placa: e.target.value.toUpperCase() })}
                                placeholder="ABC-1234"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="ano">Ano</Label>
                            <Input
                                id="ano"
                                type="number"
                                min="1900"
                                max={new Date().getFullYear() + 1}
                                value={formData.ano}
                                onChange={(e) => setFormData({ ...formData, ano: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="marca">Marca *</Label>
                            <Input
                                id="marca"
                                value={formData.marca}
                                onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                                placeholder="Toyota, Honda, Ford..."
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="modelo">Modelo *</Label>
                            <Input
                                id="modelo"
                                value={formData.modelo}
                                onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                                placeholder="Corolla, Civic, Fiesta..."
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="cor">Cor</Label>
                        <Input
                            id="cor"
                            value={formData.cor}
                            onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                            placeholder="Branco, Prata, Preto..."
                        />
                    </div>

                    <div>
                        <Label htmlFor="observacoes">Observações</Label>
                        <Textarea
                            id="observacoes"
                            value={formData.observacoes}
                            onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                            placeholder="Observações sobre o veículo..."
                            className="h-20"
                        />
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
                            {isSaving ? 'Salvando...' : 'Adicionar Veículo'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}