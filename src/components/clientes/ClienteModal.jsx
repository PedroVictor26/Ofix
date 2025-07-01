// CÓDIGO CORRIGIDO E FINAL PARA ClienteModal.jsx

import React, { useState, useEffect } from 'react'; // Adicionado useEffect para mais robustez
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
    
    // ============================ CORREÇÃO 1: Usar 'nome' em vez de 'nome_completo' ============================
    const [formData, setFormData] = useState({
        nome: '', // CORRIGIDO
        cpf_cnpj: '',
        telefone: '',
        email: '',
        endereco: '',
        observacoes: ''
    });

    const [isSaving, setIsSaving] = useState(false);

    // Este useEffect garante que o formulário carregue os dados corretos para edição e limpe para criação
    useEffect(() => {
        if (cliente) {
            setFormData({
                nome: cliente.nome || '', // CORRIGIDO (Lendo a propriedade correta)
                cpf_cnpj: cliente.cpf_cnpj || '',
                telefone: cliente.telefone || '',
                email: cliente.email || '',
                endereco: cliente.endereco || '',
                observacoes: cliente.observacoes || ''
            });
        } else {
            // Limpa o formulário se for um novo cliente
            setFormData({
                nome: '',
                cpf_cnpj: '',
                telefone: '',
                email: '',
                endereco: '',
                observacoes: ''
            });
        }
    }, [cliente, isOpen]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        // ============================ CORREÇÃO 2: Validar o campo 'nome' ============================
        if (!formData.nome || !formData.telefone) { // CORRIGIDO
            alert("Preencha os campos obrigatórios!");
            return;
        }

        setIsSaving(true);

        try {
            if (cliente) {
                await Cliente.update(cliente.id, formData);
            } else {
                await Cliente.create(formData);
            }
            onSuccess(); // Chama a função para fechar o modal e atualizar a lista
        } catch (error) {
            console.error("Erro ao salvar cliente:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {/* Mantivemos o fundo branco que você já tinha e gostava */}
            <DialogContent className="bg-white border shadow-xl max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <User className="w-6 h-6" />
                        {cliente ? 'Editar Cliente' : 'Novo Cliente'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            {/* ============================ CORREÇÃO 3: Atualizar o Input do nome ============================ */}
                            <Label htmlFor="nome">Nome Completo *</Label>
                            <Input
                                id="nome" // CORRIGIDO
                                value={formData.nome} // CORRIGIDO
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })} // CORRIGIDO
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

                    {/* O resto do formulário continua igual */}
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