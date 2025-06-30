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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Peca } from "../../entities/mock-data";
import { Save, Package } from "lucide-react";

export default function PecaModal({ isOpen, onClose, peca, fornecedores, onSuccess }) {
    const [formData, setFormData] = useState({
        nome_peca: peca?.nome_peca || '',
        codigo_sku: peca?.codigo_sku || '',
        fabricante: peca?.fabricante || '',
        fornecedor_id: peca?.fornecedor_id || '',
        preco_custo: peca?.preco_custo || 0,
        preco_venda: peca?.preco_venda || 0,
        quantidade_estoque: peca?.quantidade_estoque || 0,
        estoque_minimo: peca?.estoque_minimo || 1,
        categoria: peca?.categoria || 'outros'
    });

    const [isSaving, setIsSaving] = useState(false);

    const categorias = [
        { value: "motor", label: "Motor" },
        { value: "suspensao", label: "Suspensão" },
        { value: "freios", label: "Freios" },
        { value: "eletrica", label: "Elétrica" },
        { value: "transmissao", label: "Transmissão" },
        { value: "carroceria", label: "Carroceria" },
        { value: "pneus", label: "Pneus" },
        { value: "filtros", label: "Filtros" },
        { value: "fluidos", label: "Fluidos" },
        { value: "outros", label: "Outros" }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nome_peca || !formData.codigo_sku) {
            alert("Preencha os campos obrigatórios!");
            return;
        }

        setIsSaving(true);

        try {
            if (peca) {
                await Peca.update(peca.id, formData);
            } else {
                await Peca.create(formData);
            }

            setFormData({
                nome_peca: '',
                codigo_sku: '',
                fabricante: '',
                fornecedor_id: '',
                preco_custo: 0,
                preco_venda: 0,
                quantidade_estoque: 0,
                estoque_minimo: 1,
                categoria: 'outros'
            });

            onSuccess();
        } catch (error) {
            console.error("Erro ao salvar peça:", error);
        }

        setIsSaving(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Package className="w-6 h-6" />
                        {peca ? 'Editar Peça' : 'Nova Peça'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="nome_peca">Nome da Peça *</Label>
                            <Input
                                id="nome_peca"
                                value={formData.nome_peca}
                                onChange={(e) => setFormData({ ...formData, nome_peca: e.target.value })}
                                placeholder="Nome da peça"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="codigo_sku">Código SKU *</Label>
                            <Input
                                id="codigo_sku"
                                value={formData.codigo_sku}
                                onChange={(e) => setFormData({ ...formData, codigo_sku: e.target.value })}
                                placeholder="SKU123"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="fabricante">Fabricante</Label>
                            <Input
                                id="fabricante"
                                value={formData.fabricante}
                                onChange={(e) => setFormData({ ...formData, fabricante: e.target.value })}
                                placeholder="Nome do fabricante"
                            />
                        </div>

                        <div>
                            <Label htmlFor="fornecedor_id">Fornecedor</Label>
                            <Select value={formData.fornecedor_id} onValueChange={(value) => setFormData({ ...formData, fornecedor_id: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o fornecedor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {fornecedores.map((fornecedor) => (
                                        <SelectItem key={fornecedor.id} value={fornecedor.id}>
                                            {fornecedor.nome_fornecedor}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="preco_custo">Preço de Custo</Label>
                            <Input
                                id="preco_custo"
                                type="number"
                                step="0.01"
                                value={formData.preco_custo}
                                onChange={(e) => setFormData({ ...formData, preco_custo: parseFloat(e.target.value) || 0 })}
                                placeholder="0,00"
                            />
                        </div>

                        <div>
                            <Label htmlFor="preco_venda">Preço de Venda</Label>
                            <Input
                                id="preco_venda"
                                type="number"
                                step="0.01"
                                value={formData.preco_venda}
                                onChange={(e) => setFormData({ ...formData, preco_venda: parseFloat(e.target.value) || 0 })}
                                placeholder="0,00"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="quantidade_estoque">Quantidade em Estoque</Label>
                            <Input
                                id="quantidade_estoque"
                                type="number"
                                min="0"
                                value={formData.quantidade_estoque}
                                onChange={(e) => setFormData({ ...formData, quantidade_estoque: parseInt(e.target.value) || 0 })}
                            />
                        </div>

                        <div>
                            <Label htmlFor="estoque_minimo">Estoque Mínimo</Label>
                            <Input
                                id="estoque_minimo"
                                type="number"
                                min="0"
                                value={formData.estoque_minimo}
                                onChange={(e) => setFormData({ ...formData, estoque_minimo: parseInt(e.target.value) || 1 })}
                            />
                        </div>

                        <div>
                            <Label htmlFor="categoria">Categoria</Label>
                            <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {categorias.map((categoria) => (
                                        <SelectItem key={categoria.value} value={categoria.value}>
                                            {categoria.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
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
                            {isSaving ? 'Salvando...' : peca ? 'Atualizar' : 'Criar Peça'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}