import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Car, Wrench, Phone, Mail, MapPin, Plus, Edit } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ClienteDetalhes({
    isOpen,
    onClose,
    cliente,
    veiculos,
    servicos,
    onEditCliente,
    onAddVeiculo
}) {
    if (!cliente) return null;

    const getStatusColor = (status) => {
        const colors = {
            aguardando: "bg-slate-100 text-slate-700",
            em_andamento: "bg-blue-100 text-blue-700",
            aguardando_pecas: "bg-orange-100 text-orange-700",
            aguardando_aprovacao: "bg-purple-100 text-purple-700",
            finalizado: "bg-green-100 text-green-700"
        };
        return colors[status] || "bg-slate-100 text-slate-700";
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <User className="w-6 h-6" />
                            {cliente.nome_completo}
                        </DialogTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEditCliente(cliente)}
                            className="flex items-center gap-2"
                        >
                            <Edit className="w-4 h-4" />
                            Editar
                        </Button>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Informações do Cliente */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Informações do Cliente
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {cliente.telefone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-blue-500" />
                                        <span>{cliente.telefone}</span>
                                    </div>
                                )}

                                {cliente.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-blue-500" />
                                        <span>{cliente.email}</span>
                                    </div>
                                )}

                                {cliente.cpf_cnpj && (
                                    <div>
                                        <span className="font-medium">CPF/CNPJ:</span> {cliente.cpf_cnpj}
                                    </div>
                                )}

                                {cliente.endereco && (
                                    <div className="flex items-start gap-2 md:col-span-2">
                                        <MapPin className="w-4 h-4 text-blue-500 mt-0.5" />
                                        <span>{cliente.endereco}</span>
                                    </div>
                                )}
                            </div>

                            {cliente.observacoes && (
                                <div className="mt-4 pt-4 border-t">
                                    <p className="text-sm text-slate-600">{cliente.observacoes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Tabs */}
                    <Tabs defaultValue="veiculos" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="veiculos" className="flex items-center gap-2">
                                <Car className="w-4 h-4" />
                                Veículos ({veiculos.length})
                            </TabsTrigger>
                            <TabsTrigger value="servicos" className="flex items-center gap-2">
                                <Wrench className="w-4 h-4" />
                                Histórico ({servicos.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="veiculos" className="mt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Veículos</h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onAddVeiculo}
                                    className="flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Adicionar Veículo
                                </Button>
                            </div>

                            {veiculos.length === 0 ? (
                                <Card className="text-center py-8">
                                    <CardContent>
                                        <Car className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                                        <p className="text-slate-600 mb-4">Nenhum veículo cadastrado</p>
                                        <Button onClick={onAddVeiculo} size="sm">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Adicionar Primeiro Veículo
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid gap-4">
                                    {veiculos.map((veiculo) => (
                                        <Card key={veiculo.id}>
                                            <CardContent className="pt-6">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="font-semibold text-lg">
                                                            {veiculo.marca} {veiculo.modelo}
                                                        </h4>
                                                        <div className="text-sm text-slate-600 space-y-1 mt-2">
                                                            <div><span className="font-medium">Placa:</span> {veiculo.placa}</div>
                                                            <div><span className="font-medium">Ano:</span> {veiculo.ano}</div>
                                                            {veiculo.cor && (
                                                                <div><span className="font-medium">Cor:</span> {veiculo.cor}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                {veiculo.observacoes && (
                                                    <div className="mt-3 pt-3 border-t">
                                                        <p className="text-sm text-slate-600">{veiculo.observacoes}</p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="servicos" className="mt-6">
                            <h3 className="text-lg font-semibold mb-4">Histórico de Serviços</h3>

                            {servicos.length === 0 ? (
                                <Card className="text-center py-8">
                                    <CardContent>
                                        <Wrench className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                                        <p className="text-slate-600">Nenhum serviço realizado ainda</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {servicos.map((servico) => {
                                        const veiculo = veiculos.find(v => v.id === servico.veiculo_id);
                                        return (
                                            <Card key={servico.id}>
                                                <CardContent className="pt-6">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <h4 className="font-semibold">OS #{servico.numero_os}</h4>
                                                            {veiculo && (
                                                                <p className="text-sm text-slate-600">
                                                                    {veiculo.marca} {veiculo.modelo} - {veiculo.placa}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <Badge className={getStatusColor(servico.status)}>
                                                            {servico.status?.replace('_', ' ')}
                                                        </Badge>
                                                    </div>

                                                    {servico.descricao_problema && (
                                                        <p className="text-sm text-slate-600 mb-2">
                                                            {servico.descricao_problema}
                                                        </p>
                                                    )}

                                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                                        <span>
                                                            {servico.data_entrada &&
                                                                format(new Date(servico.data_entrada), "dd/MM/yyyy", { locale: ptBR })
                                                            }
                                                        </span>
                                                        {servico.valor_total > 0 && (
                                                            <span className="font-medium text-green-600">
                                                                R$ {servico.valor_total.toFixed(2)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}