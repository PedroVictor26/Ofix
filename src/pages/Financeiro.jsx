<<<<<<< Updated upstream
import React, { useState, useEffect } from "react";
import { Financeiro, Servico } from "../entities/mock-data"; // Ajuste o caminho conforme necessário
=======
import { useState, useEffect } from "react";
>>>>>>> Stashed changes
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";

<<<<<<< Updated upstream
import FinanceiroModal from "../components/financeiro/FinanceiroModal";
import FinanceiroStats from "../components/financeiro/FinanceiroStats";
import FinanceiroChart from "../components/financeiro/FinanceiroChart";
import FinanceiroTable from "../components/financeiro/FinanceiroTable";

export default function FinanceiroPage() {
    const [transacoes, setTransacoes] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [showModal, setShowModal] = useState(false);
=======
import { useFinanceiroData } from "@/hooks/useFinanceiroData";
import FinanceiroChart from "@/components/financeiro/FinanceiroChart";
import FinanceiroStats from "@/components/financeiro/FinanceiroStats";
import FinanceiroTable from "@/components/financeiro/FinanceiroTable";
import FinanceiroModal from "@/components/financeiro/FinanceiroModal";
import { useFinanceiroContext } from "@/context/FinanceiroContext";

export default function FinanceiroPage() {
    const {
        allTransacoes,
        transacoes,
        stats,
        isLoading,
        error,
        filterPeriod,
        setFilterPeriod,
        reload,
    } = useFinanceiroData();

    

    const [isModalOpen, setModalOpen] = useState(false);
>>>>>>> Stashed changes
    const [editingTransacao, setEditingTransacao] = useState(null);
    const [filterPeriod, setFilterPeriod] = useState("month");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [transacoesData, servicosData] = await Promise.all([
                Financeiro.list("-data_transacao"),
                Servico.list()
            ]);

            setTransacoes(transacoesData);
            setServicos(servicosData);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
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

<<<<<<< Updated upstream
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
=======
    if (error) {
        return (
            <div className="p-8 text-center text-red-600">
                <h1 className="text-2xl font-bold">Ocorreu um Erro</h1>
                <p>{error}</p>
                <Button onClick={reload} className="mt-4">Tentar Novamente</Button>
            </div>
        );
    }
>>>>>>> Stashed changes

    return (
        <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
<<<<<<< Updated upstream
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Gestão Financeira</h1>
                        <p className="text-slate-600 text-lg">Controle suas receitas e despesas</p>
                    </div>
                    <div className="flex gap-3 items-center">
                        <select
                            value={filterPeriod}
                            onChange={(e) => setFilterPeriod(e.target.value)}
                            className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="week">Última Semana</option>
                            <option value="month">Este Mês</option>
                            <option value="quarter">Este Trimestre</option>
                            <option value="year">Este Ano</option>
                            <option value="all">Todos os Períodos</option>
                        </select>
                        <Button
                            onClick={handleNewTransacao}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3"
                            size="lg"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Nova Transação
                        </Button>
=======
                <header className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">Gestão Financeira</h1>
                            <p className="text-slate-500 mt-1">Acompanhe as entradas e saídas da sua oficina.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="today">Hoje</SelectItem>
                                    <SelectItem value="week">Últimos 7 dias</SelectItem>
                                    <SelectItem value="month">Este Mês</SelectItem>
                                    <SelectItem value="year">Este Ano</SelectItem>
                                    <SelectItem value="all">Tudo</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={handleNewTransacao}>
                                <Plus className="w-4 h-4 mr-2" />
                                Nova Transação
                            </Button>
                        </div>
                    </div>
                </header>

                <section className="mb-8">
                    <FinanceiroStats stats={stats} isLoading={isLoading} filterPeriod={filterPeriod} />
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                    {/* Gráfico */}
                    <div className="lg:col-span-2">
                        <Card className="bg-white shadow-sm border-slate-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
                                    <BarChart2 className="w-5 h-5" />
                                    Fluxo de Caixa
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FinanceiroChart transacoes={transacoes} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabela de Transações Recentes */}
                    <div className="lg:col-span-1">
                        <Card className="bg-white shadow-sm border-slate-200">
                             <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
                                    <TrendingUp className="w-5 h-5" />
                                    Transações Recentes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FinanceiroTable 
                                    transacoes={allTransacoes.sort((a, b) => new Date(b.data) - new Date(a.data))}
                                    onEditTransacao={handleEditTransacao} 
                                />
                            </CardContent>
                        </Card>
>>>>>>> Stashed changes
                    </div>
                </div>

                {/* Stats Cards */}
                <FinanceiroStats
                    entradas={stats.entradas}
                    saidas={stats.saidas}
                    saldo={stats.saldo}
                    totalTransacoes={stats.total}
                    isLoading={isLoading}
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
                        <FinanceiroChart transacoes={filteredTransacoes} />
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
                        <FinanceiroTable
                            transacoes={filteredTransacoes}
                            servicos={servicos}
                            onEdit={handleEditTransacao}
                            isLoading={isLoading}
                        />
                    </CardContent>
                </Card>
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