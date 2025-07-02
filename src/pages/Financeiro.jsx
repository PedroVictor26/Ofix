import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, TrendingUp, BarChart2 } from "lucide-react";

import { useFinanceiroData } from "@/hooks/useFinanceiroData";
import FinanceiroStats from "@/components/financeiro/FinanceiroStats";
import FinanceiroChart from "@/components/financeiro/FinanceiroChart";
import FinanceiroTable from "@/components/financeiro/FinanceiroTable";
import FinanceiroModal from "@/components/financeiro/FinanceiroModal";

export default function FinanceiroPage() {
    const {
        transacoes,
        stats,
        isLoading,
        error,
        filterPeriod,
        setFilterPeriod,
        reload,
    } = useFinanceiroData();

    const [isModalOpen, setModalOpen] = useState(false);
    const [editingTransacao, setEditingTransacao] = useState(null);

    const handleNewTransacao = () => {
        setEditingTransacao(null);
        setModalOpen(true);
    };

    const handleEditTransacao = (transacao) => {
        setEditingTransacao(transacao);
        setModalOpen(true);
    };

    const handleModalSuccess = () => {
        reload();
        setModalOpen(false);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
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

                {/* Stats */}
                <section className="mb-8">
                    <FinanceiroStats stats={stats} isLoading={isLoading} />
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                                    transacoes={transacoes.slice(0, 5)} // Mostra apenas as 5 mais recentes
                                    onEditTransacao={handleEditTransacao} 
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <FinanceiroModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                transacao={editingTransacao}
                onSuccess={handleModalSuccess}
            />
        </div>
    );
}
