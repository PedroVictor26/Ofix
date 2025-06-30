import React, { useState, useEffect } from "react";
import { Financeiro, Servico } from "../entities/mock-data"; // Ajuste o caminho conforme necessário
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";

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

    return (
        <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
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