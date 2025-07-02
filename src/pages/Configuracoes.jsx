import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Wrench, MessageCircle, Plus } from "lucide-react";

import { useConfiguracoesData } from "@/hooks/useConfiguracoesData";
import ProcedimentoModal from "@/components/configuracoes/ProcedimentoModal";
import MensagemModal from "@/components/configuracoes/MensagemModal";
import ProcedimentosList from "@/components/configuracoes/ProcedimentosList";
import MensagensList from "@/components/configuracoes/MensagensList";

export default function Configuracoes() {
    const { procedimentos, mensagens, isLoading, error, reload } = useConfiguracoesData();
    const [activeTab, setActiveTab] = useState("procedimentos");
    const [showProcedimentoModal, setShowProcedimentoModal] = useState(false);
    const [editingProcedimento, setEditingProcedimento] = useState(null);
    const [showMensagemModal, setShowMensagemModal] = useState(false);
    const [editingMensagem, setEditingMensagem] = useState(null);

    const handleNewProcedimento = () => {
        setEditingProcedimento(null);
        setShowProcedimentoModal(true);
    };

    const handleEditProcedimento = (procedimento) => {
        setEditingProcedimento(procedimento);
        setShowProcedimentoModal(true);
    };

    const handleProcedimentoSuccess = () => {
        reload();
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
        reload();
        setShowMensagemModal(false);
        setEditingMensagem(null);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">Base de Conhecimento</h1>
                            <p className="text-slate-500 mt-1">Gerencie procedimentos e templates de mensagem padrão.</p>
                        </div>
                    </div>
                </header>

                {/* Tabs */}
                <Card className="bg-white shadow-sm border-slate-200">
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
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-slate-800">Lista de Procedimentos</h3>
                                    <Button onClick={handleNewProcedimento}>
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
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-slate-800">Lista de Templates</h3>
                                    <Button onClick={handleNewMensagem}>
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
