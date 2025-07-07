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
<<<<<<< Updated upstream
import { Textarea } from "@/components/ui/textarea";
import { Fornecedor } from "../../entities/mock-data";
import { Save, Building2 } from "lucide-react";
=======
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createTransacao, updateTransacao } from '@/services/financeiro.service';
import { Save, Loader2, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
>>>>>>> Stashed changes

export default function FornecedorModal({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        nome_fornecedor: '',
        contato: '',
        cnpj: '',
        email: '',
        endereco: '',
        observacoes: ''
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nome_fornecedor || !formData.contato) {
            alert("Preencha os campos obrigatórios!");
            return;
        }

        setIsSaving(true);

        try {
<<<<<<< Updated upstream
            await Fornecedor.create(formData);

            setFormData({
                nome_fornecedor: '',
                contato: '',
                cnpj: '',
                email: '',
                endereco: '',
                observacoes: ''
            });

=======
            const dadosTransacao = { ...formData, valor: parseFloat(formData.valor) };
            if (transacao) {
                await updateTransacao(transacao.id, dadosTransacao);
            } else {
                await createTransacao(dadosTransacao);
            }
>>>>>>> Stashed changes
            onSuccess();
        } catch (error) {
<<<<<<< Updated upstream
            console.error("Erro ao salvar fornecedor:", error);
=======
            console.error("Erro ao salvar transação:", error);
            // Opcional: Adicionar um estado para exibir uma mensagem de erro no modal
        } finally {
            setIsSaving(false);
>>>>>>> Stashed changes
        }

        setIsSaving(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Building2 className="w-6 h-6" />
                        Novo Fornecedor
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="nome_fornecedor">Nome do Fornecedor *</Label>
                            <Input
                                id="nome_fornecedor"
                                value={formData.nome_fornecedor}
                                onChange={(e) => setFormData({ ...formData, nome_fornecedor: e.target.value })}
                                placeholder="Nome da empresa"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="contato">Contato *</Label>
                            <Input
                                id="contato"
                                value={formData.contato}
                                onChange={(e) => setFormData({ ...formData, contato: e.target.value })}
                                placeholder="(11) 99999-9999"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="cnpj">CNPJ</Label>
                            <Input
                                id="cnpj"
                                value={formData.cnpj}
                                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                                placeholder="00.000.000/0001-00"
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="contato@fornecedor.com"
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
                            placeholder="Observações sobre o fornecedor..."
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
                            {isSaving ? 'Salvando...' : 'Criar Fornecedor'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}