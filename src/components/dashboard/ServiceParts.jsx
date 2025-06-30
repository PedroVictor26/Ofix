import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ItemServico, Peca } from "../../entities/mock-data";
import { Search, Plus, Package, AlertCircle, Trash2 } from "lucide-react";

export default function ServiceParts({ service, pecas, onUpdate }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedQuantities, setSelectedQuantities] = useState({});
    const [isAdding, setIsAdding] = useState(false);

    const filteredPecas = pecas.filter(peca =>
        peca.nome_peca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        peca.codigo_sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddPart = async (peca) => {
        const quantidade = selectedQuantities[peca.id] || 1;

        if (quantidade > peca.quantidade_estoque) {
            alert("Quantidade insuficiente em estoque!");
            return;
        }

        setIsAdding(true);

        try {
            // Criar item de serviço
            await ItemServico.create({
                servico_id: service.id,
                peca_id: peca.id,
                quantidade_usada: quantidade,
                preco_unitario_venda: peca.preco_venda,
                subtotal: quantidade * peca.preco_venda
            });

            // Atualizar estoque da peça
            await Peca.update(peca.id, {
                quantidade_estoque: peca.quantidade_estoque - quantidade
            });

            // Resetar quantidade selecionada
            setSelectedQuantities({ ...selectedQuantities, [peca.id]: 1 });

            // Atualizar o serviço (trigger refresh)
            await onUpdate({});

        } catch (error) {
            console.error("Erro ao adicionar peça:", error);
        }

        setIsAdding(false);
    };

    const setQuantity = (pecaId, quantity) => {
        setSelectedQuantities({
            ...selectedQuantities,
            [pecaId]: Math.max(1, parseInt(quantity) || 1)
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Buscar peças..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {filteredPecas.map((peca) => (
                    <Card key={peca.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-lg font-semibold text-slate-900">
                                        {peca.nome_peca}
                                    </CardTitle>
                                    <p className="text-sm text-slate-500">SKU: {peca.codigo_sku}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        {peca.categoria && (
                                            <Badge variant="secondary">
                                                {peca.categoria.replace('_', ' ')}
                                            </Badge>
                                        )}
                                        <Badge
                                            variant={peca.quantidade_estoque <= peca.estoque_minimo ? "destructive" : "outline"}
                                            className="flex items-center gap-1"
                                        >
                                            <Package className="w-3 h-3" />
                                            {peca.quantidade_estoque} em estoque
                                        </Badge>
                                        {peca.quantidade_estoque <= peca.estoque_minimo && (
                                            <Badge variant="destructive" className="flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                Estoque baixo
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-green-600">
                                        R$ {peca.preco_venda?.toFixed(2)}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        Custo: R$ {peca.preco_custo?.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium">Quantidade:</label>
                                    <Input
                                        type="number"
                                        min="1"
                                        max={peca.quantidade_estoque}
                                        value={selectedQuantities[peca.id] || 1}
                                        onChange={(e) => setQuantity(peca.id, e.target.value)}
                                        className="w-20"
                                    />
                                </div>
                                <div className="text-sm text-slate-600">
                                    Subtotal: R$ {((selectedQuantities[peca.id] || 1) * peca.preco_venda).toFixed(2)}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleAddPart(peca)}
                                    disabled={isAdding || peca.quantidade_estoque === 0}
                                    className="ml-auto flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Adicionar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredPecas.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Nenhuma peça encontrada</p>
                    <p className="text-sm">Tente ajustar os termos de busca</p>
                </div>
            )}
        </div>
    );
}