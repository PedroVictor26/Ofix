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
// TODO: Criar entidade TransacaoFinanceira em mock-data.js ou integrar com API real
// import { TransacaoFinanceira } from "../../entities/mock-data";
import { Save, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


// Mock temporário até a entidade ser criada
const TransacaoFinanceira = {
    create: async (data) => {
        console.log("Mock TransacaoFinanceira.create chamada com:", data);
        // Simular um delay de API
        await new Promise(resolve => setTimeout(resolve, 500));
        // Simular sucesso ou falha aleatoriamente para teste
        // if (Math.random() > 0.8) throw new Error("Falha simulada ao criar transação");
        return { id: Date.now(), ...data };
    }
};


export default function FinanceiroModal({ isOpen, onClose, onSuccess, transacao }) {
    const [formData, setFormData] = useState({
        descricao: transacao?.descricao || '',
        valor: transacao?.valor || 0,
        tipo: transacao?.tipo || 'receita', // 'receita' ou 'despesa'
        data: transacao?.data || new Date().toISOString().split('T')[0],
        categoria: transacao?.categoria || '',
        observacoes: transacao?.observacoes || ''
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.descricao || !formData.valor || !formData.data) {
            toast.error("Preencha os campos obrigatórios: Descrição, Valor e Data.");
            return;
        }
        if (formData.valor <= 0) {
            toast.error("O valor da transação deve ser positivo.");
            return;
        }

        setIsSaving(true);
        const toastId = toast.loading(transacao ? "Atualizando transação..." : "Criando transação...");

        try {
            // TODO: Implementar update se 'transacao' for passado como prop (para edição)
            // if (transacao) {
            //     await TransacaoFinanceira.update(transacao.id, formData);
            // } else {
            await TransacaoFinanceira.create(formData);
            // }

            setFormData({
                descricao: '',
                valor: 0,
                tipo: 'receita',
                data: new Date().toISOString().split('T')[0],
                categoria: '',
                observacoes: ''
            });
            toast.success(transacao ? "Transação atualizada com sucesso!" : "Transação criada com sucesso!", { id: toastId });
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Erro ao salvar transação:", error);
            toast.error(`Erro ao salvar transação: ${error.message || 'Erro desconhecido'}`, { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    const Icon = formData.tipo === 'receita' ? TrendingUp : TrendingDown;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Icon className="w-6 h-6" />
                        {transacao ? 'Editar Transação' : 'Nova Transação Financeira'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="descricao">Descrição *</Label>
                        <Input
                            id="descricao"
                            value={formData.descricao}
                            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                            placeholder="Ex: Pagamento de fornecedor, Receita de serviço"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="valor">Valor (R$) *</Label>
                            <Input
                                id="valor"
                                type="number"
                                step="0.01"
                                value={formData.valor}
                                onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) || 0 })}
                                placeholder="0,00"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="tipo">Tipo *</Label>
                            <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })} required>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="receita">
                                        <span className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-600" /> Receita</span>
                                    </SelectItem>
                                    <SelectItem value="despesa">
                                        <span className="flex items-center gap-2"><TrendingDown className="w-4 h-4 text-red-600" /> Despesa</span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="data">Data *</Label>
                            <Input
                                id="data"
                                type="date"
                                value={formData.data}
                                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="categoria">Categoria</Label>
                        <Input
                            id="categoria"
                            value={formData.categoria}
                            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                            placeholder="Ex: Material de escritório, Venda de peças"
                        />
                    </div>

                    <div>
                        <Label htmlFor="observacoes">Observações</Label>
                        <Textarea
                            id="observacoes"
                            value={formData.observacoes}
                            onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                            placeholder="Detalhes adicionais sobre a transação..."
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
                            className={formData.tipo === 'receita' ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isSaving ? 'Salvando...' : transacao ? 'Atualizar' : 'Criar Transação'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}