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
// import { Cliente } from "../../entities/mock-data"; // Removido mock
import apiClient from '../../services/api'; // Importa o apiClient configurado
import { Save, User } from "lucide-react";
// Idealmente, usar um sistema de notificações/toast mais robusto
// import { useToast } from "@/components/ui/use-toast";

export default function ClienteModal({ isOpen, onClose, cliente, onSuccess }) {
    // const { toast } = useToast(); // Para notificações
    const [formData, setFormData] = useState({
        nome_completo: '',
        cpf_cnpj: '',
        telefone: '',
        email: '',
        endereco: '',
        observacoes: ''
    });

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    // Efeito para resetar o formulário quando o modal é aberto para um novo cliente
    // ou para preencher com dados de um cliente existente
    useEffect(() => {
        if (isOpen) {
            if (cliente) {
                setFormData({
                    nome_completo: cliente.nome_completo || cliente.nomeCompleto || '',
                    cpf_cnpj: cliente.cpf_cnpj || cliente.cpfCnpj || '',
                    telefone: cliente.telefone || '',
                    email: cliente.email || '',
                    endereco: cliente.endereco || '',
                    observacoes: cliente.observacoes || ''
                });
            } else {
                setFormData({
                    nome_completo: '',
                    cpf_cnpj: '',
                    telefone: '',
                    email: '',
                    endereco: '',
                    observacoes: ''
                });
            }
            setError(null); // Limpa erros anteriores ao abrir/reabrir
        }
    }, [isOpen, cliente]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Limpa erro anterior

        if (!formData.nome_completo || !formData.telefone) {
            // alert("Preencha os campos obrigatórios: Nome Completo e Telefone.");
            setError("Preencha os campos obrigatórios: Nome Completo e Telefone.");
            // toast({ title: "Erro de Validação", description: "Nome Completo e Telefone são obrigatórios.", variant: "destructive" });
            return;
        }

        setIsSaving(true);

        try {
            let response;
            if (cliente && cliente.id) { // Se tem cliente com ID, é uma atualização
                // TODO: Implementar lógica de atualização (PUT /api/clientes/:id)
                // response = await apiClient.put(`/clientes/${cliente.id}`, formData);
                console.warn("Funcionalidade de editar cliente ainda não implementada com backend.");
                alert("Funcionalidade de editar cliente ainda não implementada com backend.");
                // Por enquanto, vamos simular sucesso para não quebrar o fluxo se alguém clicar em editar
                // throw new Error("Edição não implementada");
            } else { // Caso contrário, é criação
                response = await apiClient.post('/clientes', formData);
            }

            // Resetar o formulário no frontend
            // setFormData({
            //     nome_completo: '', cpf_cnpj: '', telefone: '', email: '',
            //     endereco: '', observacoes: ''
            // });

            onSuccess(response?.data); // Chama onSuccess com o cliente criado/atualizado
            // onClose(); // Fechar o modal é geralmente responsabilidade do onSuccess ou do componente pai

            // toast({ title: "Sucesso!", description: `Cliente ${cliente ? 'atualizado' : 'criado'} com sucesso.`, variant: "success" });

        } catch (err) {
            console.error("Erro ao salvar cliente:", err);
            const errorMessage = err.response?.data?.error || err.message || "Erro desconhecido ao salvar cliente.";
            setError(errorMessage);
            // toast({ title: "Erro ao Salvar", description: errorMessage, variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) onClose(); // Chama onClose quando o dialog tenta fechar
        }}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <User className="w-6 h-6" />
                        {cliente ? 'Editar Cliente' : 'Novo Cliente'}
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
                            <Label htmlFor="nome_completo">Nome Completo *</Label>
                            <Input
                                id="nome_completo"
                                value={formData.nome_completo}
                                onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
                                placeholder="Nome completo do cliente"
                                required
                                disabled={isSaving}
                            />
                        </div>

                        <div>
                            <Label htmlFor="cpf_cnpj">CPF/CNPJ</Label>
                            <Input
                                id="cpf_cnpj"
                                value={formData.cpf_cnpj}
                                onChange={(e) => setFormData({ ...formData, cpf_cnpj: e.target.value })}
                                placeholder="000.000.000-00"
                                disabled={isSaving}
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
                                disabled={isSaving}
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
                                disabled={isSaving}
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
                            disabled={isSaving}
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
                            disabled={isSaving}
                        />
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
                            <Save className="w-4 h-4 mr-2" />
                            {isSaving ? 'Salvando...' : cliente ? 'Atualizar' : 'Criar Cliente'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}