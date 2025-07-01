import React, { useState, useEffect } from "react";
// DEPOIS (O CÓDIGO CORRIGIDO)
import { ProcedimentoPadrao, MensagemPadrao } from "../entities/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Wrench, MessageCircle, Plus } from "lucide-react";

import ProcedimentoModal from "../components/configuracoes/ProcedimentoModal";
import MensagemModal from "../components/configuracoes/MensagemModal";
import ProcedimentosList from "../components/configuracoes/ProcedimentosList";
import MensagensList from "../components/configuracoes/MensagensList";

export default function Configuracoes() {
    const [procedimentos, setProcedimentos] = useState([]);
    const [mensagens, setMensagens] = useState([]);
    const [showProcedimentoModal, setShowProcedimentoModal] = useState(false);
    const [showMensagemModal, setShowMensagemModal] = useState(false);
    const [editingProcedimento, setEditingProcedimento] = useState(null);
    const [editingMensagem, setEditingMensagem] = useState(null);
    const [activeTab, setActiveTab] = useState("procedimentos");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [procedimentosData, mensagensData] = await Promise.all([
                ProcedimentoPadrao.list("-created_date"),
                MensagemPadrao.list("-created_date")
            ]);

            setProcedimentos(procedimentosData);
            setMensagens(mensagensData);
        } catch (err) {
            console.error("Erro ao carregar dados de configurações:", err);
            setError(err.message || "Falha ao carregar dados. Tente novamente.");
        }
        setIsLoading(false);
    };

    const handleNewProcedimento = () => {
        setEditingProcedimento(null);
        setShowProcedimentoModal(true);
    };

    const handleEditProcedimento = (procedimento) => {
        setEditingProcedimento(procedimento);
        setShowProcedimentoModal(true);
    };

    const handleProcedimentoSuccess = () => {
        loadData();
        setShowProcedimentoModal(false);
        setEditingProcedimento(null);
    };

    const handleNewMensagem = () => {
        setEditingMensagem(null);
        setShowMensagemModal(true);
    };

    const handleEditMensagem = (mensagem) => {
        setEditingMensagem(mensagem);
        setShowMensagemModal(true);
    };

    const handleMensagemSuccess = () => {
        loadData();
        setShowMensagemModal(false);
        setEditingMensagem(null);
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
                <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-red-700 mb-2">Oops! Algo deu errado.</h2>
                    <p className="text-slate-600 mb-4">Não foi possível carregar os dados de configurações.</p>
                    <p className="text-sm text-slate-500 mb-6">Erro: {error}</p>
                    <Button onClick={loadData} className="bg-red-600 hover:bg-red-700">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Tentar Novamente
                    </Button>
                </div>
            </div>
        );
    }

    const ListSkeleton = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <Skeleton className="h-7 w-64 mb-1" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-10 w-44" />
            </div>
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
        </div>
    );

    return (
        <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        {isLoading && !procedimentos.length && !mensagens.length ? (
                            <>
                                <Skeleton className="h-10 w-96 mb-2" />
                                <Skeleton className="h-6 w-80" />
                            </>
                        ) : (
                            <>
                                <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                                    <Settings className="w-10 h-10 text-blue-600" />
                                    Base de Conhecimento
                                </h1>
                                <p className="text-slate-600 text-lg">Configure procedimentos e mensagens padrão</p>
                            </>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                    <CardContent className="p-0">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <div className="border-b border-slate-200">
                                <TabsList className="w-full justify-start bg-transparent p-0 h-auto">
                                    <TabsTrigger
                                        value="procedimentos"
                                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6 py-4 text-base"
                                    >
                                        <Wrench className="w-5 h-5 mr-2" />
                                        Procedimentos Padrão
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="mensagens"
                                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6 py-4 text-base"
                                    >
                                        <MessageCircle className="w-5 h-5 mr-2" />
                                        Templates de Mensagem
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="procedimentos" className="p-6 space-y-6">
                                {isLoading && !procedimentos.length && !error ? <ListSkeleton /> : (
                                    <>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900">Procedimentos Padrão</h3>
                                                <p className="text-slate-600">Crie procedimentos que podem ser aplicados rapidamente aos serviços</p>
                                            </div>
                                            <Button
                                                onClick={handleNewProcedimento}
                                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Novo Procedimento
                                            </Button>
                                        </div>

                                        <ProcedimentosList
                                            procedimentos={procedimentos}
                                            onEdit={handleEditProcedimento}
                                            isLoading={isLoading} // A lista pode ter seu próprio skeleton interno
                                        />
                                        {procedimentos.length === 0 && !isLoading && !error && (
                                            <Card className="text-center py-12">
                                                <CardContent>
                                                    <Wrench className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Nenhum procedimento cadastrado</h3>
                                                    <p className="text-slate-600 mb-4">Crie seu primeiro procedimento padrão.</p>
                                                    <Button onClick={handleNewProcedimento}><Plus className="w-4 h-4 mr-2" />Novo Procedimento</Button>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </>
                                )}
                            </TabsContent>

                            <TabsContent value="mensagens" className="p-6 space-y-6">
                                {isLoading && !mensagens.length && !error ? <ListSkeleton /> : (
                                    <>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900">Templates de Mensagem</h3>
                                                <p className="text-slate-600">Crie templates de mensagem para comunicação com clientes</p>
                                            </div>
                                            <Button
                                                onClick={handleNewMensagem}
                                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Nova Mensagem
                                            </Button>
                                        </div>

                                        <MensagensList
                                            mensagens={mensagens}
                                            onEdit={handleEditMensagem}
                                            isLoading={isLoading} // A lista pode ter seu próprio skeleton interno
                                        />
                                        {mensagens.length === 0 && !isLoading && !error && (
                                            <Card className="text-center py-12">
                                                <CardContent>
                                                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Nenhum template de mensagem cadastrado</h3>
                                                    <p className="text-slate-600 mb-4">Crie seu primeiro template de mensagem.</p>
                                                    <Button onClick={handleNewMensagem}><Plus className="w-4 h-4 mr-2" />Nova Mensagem</Button>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            {/* Modals */}
            <ProcedimentoModal
                isOpen={showProcedimentoModal}
                onClose={() => setShowProcedimentoModal(false)}
                procedimento={editingProcedimento}
                onSuccess={handleProcedimentoSuccess}
            />

            <MensagemModal
                isOpen={showMensagemModal}
                onClose={() => setShowMensagemModal(false)}
                mensagem={editingMensagem}
                onSuccess={handleMensagemSuccess}
            />
        </div>
    );
}