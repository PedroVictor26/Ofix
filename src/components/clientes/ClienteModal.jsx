import React, { useState } from 'react';
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
import { Cliente } from "../../entities/mock-data";
import { Save, User } from "lucide-react";

export default function ClienteModal({ isOpen, onClose, cliente, onSuccess }) {
    const [formData, setFormData] = useState({
        nome_completo: cliente?.nome_completo || '',
        cpf_cnpj: cliente?.cpf_cnpj || '',
        telefone: cliente?.telefone || '',
        email: cliente?.email || '',
        endereco: cliente?.endereco || '',
        observacoes: cliente?.observacoes || ''
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nome_completo || !formData.telefone) {
            toast.error("Preencha os campos obrigatórios: Nome Completo e Telefone.");
            return;
        }

        setIsSaving(true);
        const toastId = toast.loading(cliente ? "Atualizando cliente..." : "Criando cliente...");

        try {
            if (cliente) {
                await Cliente.update(cliente.id, formData);
            } else {
                await Cliente.create(formData);
            }

            setFormData({
                nome_completo: '',
                cpf_cnpj: '',
                telefone: '',
                email: '',
                endereco: '',
                observacoes: ''
            });
            toast.success(cliente ? "Cliente atualizado com sucesso!" : "Cliente criado com sucesso!", { id: toastId });
            onSuccess();
        } catch (error) {
            console.error("Erro ao salvar cliente:", error);
            toast.error(`Erro ao salvar cliente: ${error.message || 'Erro desconhecido'}`, { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <User className="w-6 h-6" />
                        {cliente ? 'Editar Cliente' : 'Novo Cliente'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="nome_completo">Nome Completo *</Label>
                            <Input
                                id="nome_completo"
                                value={formData.nome_completo}
                                onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
                                placeholder="Nome completo do cliente"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="cpf_cnpj">CPF/CNPJ</Label>
                            <Input
                                id="cpf_cnpj"
                                value={formData.cpf_cnpj}
                                onChange={(e) => setFormData({ ...formData, cpf_cnpj: e.target.value })}
                                placeholder="000.000.000-00"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="telefone">Telefone *</Label>
                            <Input
                                id="telefone"
                                value={formData.telefone}
                                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                placeholder="(11) 99999-9999"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="cliente@email.com"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="endereco">Endereço</Label>
                        <Input
                            id="endereco"
                            value={formData.endereco}
                            onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                            placeholder="Endereço completo"
                        />
                    </div>

                    <div>
                        <Label htmlFor="observacoes">Observações</Label>
                        <Textarea
                            id="observacoes"
                            value={formData.observacoes}
                            onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                            placeholder="Observações sobre o cliente..."
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
                            {isSaving ? 'Salvando...' : cliente ? 'Atualizar' : 'Criar Cliente'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}