import React, { useState, useEffect } from "react";
// DEPOIS (O CÓDIGO CORRIGIDO)
import { Peca, Fornecedor } from "../entities/mock-data";import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Package, AlertTriangle, TrendingDown, DollarSign } from "lucide-react";

import PecaModal from "../components/estoque/PecaModal";
import FornecedorModal from "../components/estoque/FornecedorModal";
import EstoqueStats from "../components/estoque/EstoqueStats";

export default function Estoque() {
    const [pecas, setPecas] = useState([]);
    const [fornecedores, setFornecedores] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [showPecaModal, setShowPecaModal] = useState(false);
    const [showFornecedorModal, setShowFornecedorModal] = useState(false);
    const [editingPeca, setEditingPeca] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [pecasData, fornecedoresData] = await Promise.all([
                Peca.list("-created_date"),
                Fornecedor.list()
            ]);

            setPecas(pecasData);
            setFornecedores(fornecedoresData);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        }
        setIsLoading(false);
    };

    const filteredPecas = pecas.filter(peca => {
        const matchesSearch = peca.nome_peca.toLowerCase().includes(searchTerm.toLowerCase()) ||
            peca.codigo_sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            peca.fabricante?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = filterCategory === "all" || peca.categoria === filterCategory;

        return matchesSearch && matchesCategory;
    });

    const handleNewPeca = () => {
        setEditingPeca(null);
        setShowPecaModal(true);
    };

    const handleEditPeca = (peca) => {
        setEditingPeca(peca);
        setShowPecaModal(true);
    };

    const handlePecaSuccess = () => {
        loadData();
        setShowPecaModal(false);
        setEditingPeca(null);
    };

    const handleFornecedorSuccess = () => {
        loadData();
        setShowFornecedorModal(false);
    };

    const getEstoqueBaixo = () => {
        return pecas.filter(peca => peca.quantidade_estoque <= peca.estoque_minimo);
    };

    const getValorTotalEstoque = () => {
        return pecas.reduce((total, peca) => total + (peca.quantidade_estoque * peca.preco_custo), 0);
    };

    const categorias = [
        { value: "all", label: "Todas as Categorias" },
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

    return (
        <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Controle de Estoque</h1>
                        <p className="text-slate-600 text-lg">Gerencie suas peças e fornecedores</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={() => setShowFornecedorModal(true)}
                            variant="outline"
                            className="px-6 py-3"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Novo Fornecedor
                        </Button>
                        <Button
                            onClick={handleNewPeca}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3"
                            size="lg"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Nova Peça
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <EstoqueStats
                    totalPecas={pecas.length}
                    valorTotalEstoque={getValorTotalEstoque()}
                    estoqueBaixo={getEstoqueBaixo().length}
                    totalFornecedores={fornecedores.length}
                />

                {/* Filtros */}
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    placeholder="Buscar por nome, SKU ou fabricante..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-12 text-lg"
                                />
                            </div>

                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {categorias.map(categoria => (
                                    <option key={categoria.value} value={categoria.value}>
                                        {categoria.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Lista de Peças */}
                <div className="grid gap-6">
                    {isLoading ? (
                        Array(8).fill(0).map((_, i) => (
                            <Card key={i} className="animate-pulse">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-slate-200 rounded-lg" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-slate-200 rounded w-1/3" />
                                            <div className="h-3 bg-slate-200 rounded w-1/4" />
                                            <div className="h-3 bg-slate-200 rounded w-1/2" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        filteredPecas.map((peca) => {
                            const isEstoqueBaixo = peca.quantidade_estoque <= peca.estoque_minimo;
                            const fornecedor = fornecedores.find(f => f.id === peca.fornecedor_id);

                            return (
                                <Card
                                    key={peca.id}
                                    className={`cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white group ${isEstoqueBaixo ? 'border-l-4 border-l-red-500' : ''
                                        }`}
                                    onClick={() => handleEditPeca(peca)}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className={`w-16 h-16 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform ${isEstoqueBaixo
                                                        ? 'bg-gradient-to-r from-red-500 to-red-600'
                                                        : 'bg-gradient-to-r from-blue-500 to-blue-600'
                                                    }`}>
                                                    <Package className="w-8 h-8 text-white" />
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-start gap-3 mb-2">
                                                        <h3 className="text-xl font-bold text-slate-900">
                                                            {peca.nome_peca}
                                                        </h3>
                                                        {isEstoqueBaixo && (
                                                            <Badge variant="destructive" className="flex items-center gap-1">
                                                                <AlertTriangle className="w-3 h-3" />
                                                                Estoque Baixo
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-slate-600">
                                                        <div>
                                                            <span className="font-medium">SKU:</span> {peca.codigo_sku}
                                                        </div>

                                                        {peca.fabricante && (
                                                            <div>
                                                                <span className="font-medium">Fabricante:</span> {peca.fabricante}
                                                            </div>
                                                        )}

                                                        {fornecedor && (
                                                            <div>
                                                                <span className="font-medium">Fornecedor:</span> {fornecedor.nome_fornecedor}
                                                            </div>
                                                        )}

                                                        {peca.categoria && (
                                                            <div>
                                                                <Badge variant="secondary">
                                                                    {peca.categoria.replace('_', ' ')}
                                                                </Badge>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right space-y-2">
                                                <div className="space-y-1">
                                                    <div className={`text-2xl font-bold ${isEstoqueBaixo ? 'text-red-600' : 'text-slate-900'
                                                        }`}>
                                                        {peca.quantidade_estoque} un
                                                    </div>
                                                    <div className="text-sm text-slate-500">
                                                        Mín: {peca.estoque_minimo}
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1 text-green-600">
                                                        <DollarSign className="w-4 h-4" />
                                                        <span className="font-medium">R$ {peca.preco_venda?.toFixed(2)}</span>
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        Custo: R$ {peca.preco_custo?.toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>

                {filteredPecas.length === 0 && !isLoading && (
                    <Card className="text-center py-12">
                        <CardContent>
                            <Package className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">Nenhuma peça encontrada</h3>
                            <p className="text-slate-600 mb-4">
                                {searchTerm || filterCategory !== "all"
                                    ? 'Tente ajustar os filtros de busca'
                                    : 'Comece adicionando suas primeiras peças ao estoque'
                                }
                            </p>
                            {!searchTerm && filterCategory === "all" && (
                                <Button onClick={handleNewPeca}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Adicionar Peça
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Modals */}
            <PecaModal
                isOpen={showPecaModal}
                onClose={() => setShowPecaModal(false)}
                peca={editingPeca}
                fornecedores={fornecedores}
                onSuccess={handlePecaSuccess}
            />

            <FornecedorModal
                isOpen={showFornecedorModal}
                onClose={() => setShowFornecedorModal(false)}
                onSuccess={handleFornecedorSuccess}
            />
        </div>
    );
}