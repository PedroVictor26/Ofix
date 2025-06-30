import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Servico, ProcedimentoPadrao, MensagemPadrao, Peca } from "../../entities/mock-data";
import { Wrench, MessageCircle, Package, FileText, Save } from "lucide-react";
import toast from 'react-hot-toast'; // Import toast

import ServiceDetails from './ServiceDetails';
import ServiceProcedures from './ServiceProcedures';
import ServiceMessages from './ServiceMessages';
import ServiceParts from './ServiceParts';

export default function ServiceModal({ isOpen, onClose, service, onUpdate, clientes, veiculos }) {
    const [activeTab, setActiveTab] = useState("details");
    const [procedimentos, setProcedimentos] = useState([]);
    const [mensagens, setMensagens] = useState([]);
    const [pecas, setPecas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && service) {
            loadData();
        }
    }, [isOpen, service]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [procedimentosData, mensagensData, pecasData] = await Promise.all([
                ProcedimentoPadrao.list(),
                MensagemPadrao.list(),
                Peca.list()
            ]);

            setProcedimentos(procedimentosData);
            setMensagens(mensagensData);
            setPecas(pecasData);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        }
        setIsLoading(false);
    };

    const handleServiceUpdate = async (updatedData) => {
        const toastId = toast.loading("Salvando alterações...");
        try {
            await Servico.update(service.id, updatedData); // Simula chamada à API
            toast.success("Serviço atualizado com sucesso!", { id: toastId });
            onUpdate(); // Chama a função passada por props para fechar modal e recarregar dados no Dashboard
        } catch (error) {
            console.error("Erro ao atualizar serviço:", error);
            toast.error("Falha ao atualizar serviço. Tente novamente.", { id: toastId });
        }
    };

    if (!service) return null;

    // Clientes e Veiculos agora são mapas/objetos
    const cliente = clientes[service.cliente_id];
    const veiculo = veiculos[service.veiculo_id];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-2xl font-bold text-slate-900">
                            Ordem de Serviço #{service.numero_os}
                        </DialogTitle>
                        <Badge variant="secondary" className="text-sm">
                            {service.status?.replace('_', ' ')}
                        </Badge>
                    </div>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="details" className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Detalhes
                        </TabsTrigger>
                        <TabsTrigger value="procedures" className="flex items-center gap-2">
                            <Wrench className="w-4 h-4" />
                            Procedimentos
                        </TabsTrigger>
                        <TabsTrigger value="parts" className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Peças
                        </TabsTrigger>
                        <TabsTrigger value="messages" className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            Mensagens
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="mt-6">
                        <ServiceDetails
                            service={service}
                            cliente={cliente}
                            veiculo={veiculo}
                            onUpdate={handleServiceUpdate}
                        />
                    </TabsContent>

                    <TabsContent value="procedures" className="mt-6">
                        <ServiceProcedures
                            service={service}
                            procedimentos={procedimentos}
                            onUpdate={handleServiceUpdate}
                        />
                    </TabsContent>

                    <TabsContent value="parts" className="mt-6">
                        <ServiceParts
                            service={service}
                            pecas={pecas}
                            onUpdate={handleServiceUpdate}
                        />
                    </TabsContent>

                    <TabsContent value="messages" className="mt-6">
                        <ServiceMessages
                            service={service}
                            cliente={cliente}
                            veiculo={veiculo}
                            mensagens={mensagens}
                        />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}