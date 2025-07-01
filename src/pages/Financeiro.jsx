import React, { useState, useEffect } from "react";
import { Financeiro, Servico } from "../entities/mock-data"; // Ajuste o caminho conforme necessário
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, TrendingDown, DollarSign, Calendar, AlertCircle, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import FinanceiroModal from "../components/financeiro/FinanceiroModal";
import FinanceiroStats from "../components/financeiro/FinanceiroStats";
import FinanceiroChart from "../components/financeiro/FinanceiroChart";
import FinanceiroTable from "../components/financeiro/FinanceiroTable";

export default function FinanceiroPage() {
    const [transacoes, setTransacoes] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingTransacao, setEditingTransacao] = useState(null);
    const [filterPeriod, setFilterPeriod] = useState("month");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [transacoesData, servicosData] = await Promise.all([
                Financeiro.list("-data_transacao"),
                Servico.list()
            ]);

            setTransacoes(transacoesData);
            setServicos(servicosData);
        } catch (err) {
            console.error("Erro ao carregar dados financeiros:", err);
            setError(err.message || "Falha ao carregar dados. Tente novamente.");
        }
        setIsLoading(false);
    };

    const handleNewTransacao = () => {
        setEditingTransacao(null);
        setShowModal(true);
    };

    const handleEditTransacao = (transacao) => {
        setEditingTransacao(transacao);
        setShowModal(true);
    };

    const handleTransacaoSuccess = () => {
        loadData();
        setShowModal(false);
        setEditingTransacao(null);
    };

    const getFilteredTransacoes = () => {
        const now = new Date();
        let startDate;

        switch (filterPeriod) {
            case "week":
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case "month":
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case "quarter":
                startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
                break;
            case "year":
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                return transacoes;
        }

        return transacoes.filter(t => new Date(t.data_transacao) >= startDate);
    };

    const filteredTransacoes = getFilteredTransacoes();

    const getStats = () => {
        const entradas = filteredTransacoes
            .filter(t => t.tipo === 'entrada')
            .reduce((sum, t) => sum + t.valor, 0);

        const saidas = filteredTransacoes
            .filter(t => t.tipo === 'saida')
            .reduce((sum, t) => sum + t.valor, 0);

        const saldo = entradas - saidas;

        return { entradas, saidas, saldo, total: filteredTransacoes.length };
    };

    const stats = getStats();

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
                <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-red-700 mb-2">Oops! Algo deu errado.</h2>
                    <p className="text-slate-600 mb-4">Não foi possível carregar os dados financeiros.</p>
                    <p className="text-sm text-slate-500 mb-6">Erro: {error}</p>
                    <Button onClick={loadData} className="bg-red-600 hover:bg-red-700">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Tentar Novamente
                    </Button>
                </div>
            </div>
        );
    }

    // Skeletons para o estado de carregamento inicial
    const PageLoadingSkeleton = () => (
        <>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <Skeleton className="h-10 w-80 mb-2" />
                    <Skeleton className="h-6 w-64" />
                </div>
                <div className="flex gap-3 items-center w-full lg:w-auto">
                    <Skeleton className="h-10 w-40" /> {/* Select período */}
                    <Skeleton className="h-12 w-52" /> {/* Botão Nova Transação */}
                </div>
            </div>
            <FinanceiroStats isLoading={true} />
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                        Fluxo de Caixa
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-64 w-full" />
                </CardContent>
            </Card>
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <DollarSign className="w-6 h-6 text-blue-600" />
                        Transações Recentes
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-40 w-full" /> {/* Placeholder para tabela */}
                </CardContent>
            </Card>
        </>
    );

    return (
        <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">
                {isLoading && !transacoes.length && !error ? <PageLoadingSkeleton /> : (
                <>
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900 mb-2">Gestão Financeira</h1>
                            <p className="text-slate-600 text-lg">Controle suas receitas e despesas</p>
                        </div>
                        <div className="flex gap-3 items-center w-full lg:w-auto">
                            <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                                <SelectTrigger className="w-full lg:w-auto">
                                    <SelectValue placeholder="Selecione o período" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="week">Última Semana</SelectItem>
                                    <SelectItem value="month">Este Mês</SelectItem>
                                    <SelectItem value="quarter">Este Trimestre</SelectItem>
                                    <SelectItem value="year">Este Ano</SelectItem>
                                    <SelectItem value="all">Todos os Períodos</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                onClick={handleNewTransacao}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3 w-full lg:w-auto"
                            size="lg"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Nova Transação
                        </Button>
                    </div>
                </div>

                    {/* Stats Cards */}
                    <FinanceiroStats
                        entradas={stats.entradas}
                        saidas={stats.saidas}
                        saldo={stats.saldo}
                        totalTransacoes={stats.total}
                        isLoading={isLoading && !transacoes.length && !error}
                    />

                    {/* Chart */}
                    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                                Fluxo de Caixa
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {(isLoading && !transacoes.length && !error) ? (
                                <Skeleton className="h-64 w-full" />
                            ) : (
                                <FinanceiroChart transacoes={filteredTransacoes} />
                            )}
                        </CardContent>
                    </Card>

                    {/* Tabela de Transações */}
                    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <DollarSign className="w-6 h-6 text-blue-600" />
                                Transações Recentes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {(isLoading && !transacoes.length && !error) ? (
                                <Skeleton className="h-40 w-full" />
                            ) : (
                                <>
                                    <FinanceiroTable
                                        transacoes={filteredTransacoes}
                                        servicos={servicos}
                                        onEdit={handleEditTransacao}
                                        isLoading={isLoading} // A tabela pode ter seu próprio skeleton interno
                                    />
                                    {filteredTransacoes.length === 0 && !isLoading && !error && (
                                        <div className="text-center py-12">
                                            <DollarSign className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                                            <h3 className="text-xl font-semibold text-slate-900 mb-2">Nenhuma transação encontrada</h3>
                                            <p className="text-slate-600 mb-4">
                                                {filterPeriod !== "all" ? 'Nenhuma transação para o período selecionado.' : 'Comece adicionando sua primeira transação.'}
                                            </p>
                                            <Button
                                                onClick={handleNewTransacao}
                                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Adicionar Transação
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </>
                )}
            </div>

            {/* Modal */}
            <FinanceiroModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                transacao={editingTransacao}
                servicos={servicos}
                onSuccess={handleTransacaoSuccess}
            />
        </div>
    );
}