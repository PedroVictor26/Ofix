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

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [procedimentosData, mensagensData] = await Promise.all([
                ProcedimentoPadrao.list("-created_date"),
                MensagemPadrao.list("-created_date")
            ]);

            setProcedimentos(procedimentosData);
            setMensagens(mensagensData);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
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

    return (
        <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                            <Settings className="w-10 h-10 text-blue-600" />
                            Base de Conhecimento
                        </h1>
                        <p className="text-slate-600 text-lg">Configure procedimentos e mensagens padrão</p>
                    </div>
                </div>

                {/* Tabs */}
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-0">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <div className="border-b border-slate-200">
                                <TabsList className="w-full justify-start bg-transparent p-0 h-auto">
                                    <TabsTrigger
                                        value="procedimentos"
                                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6 py-4"
                                    >
                                        <Wrench className="w-5 h-5 mr-2" />
                                        Procedimentos Padrão
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="mensagens"
                                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6 py-4"
                                    >
                                        <MessageCircle className="w-5 h-5 mr-2" />
                                        Templates de Mensagem
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="procedimentos" className="p-6 space-y-6">
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
                                    isLoading={isLoading}
                                />
                            </TabsContent>

                            <TabsContent value="mensagens" className="p-6 space-y-6">
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
                                    isLoading={isLoading}
                                />
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