// src/pages/Clientes.jsx

import React, { useState, useEffect } from "react";
import { Cliente, Veiculo, Servico } from "../entities/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, User, Car, Phone, Mail, MapPin } from "lucide-react";

// Importe os modais e componentes de detalhes
import ClienteModal from "../components/clientes/ClienteModal";
import VeiculoModal from "../components/clientes/VeiculoModal";
import ClienteDetalhes from "../components/clientes/ClienteDetalhes";

export default function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [veiculos, setVeiculos] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [showClienteModal, setShowClienteModal] = useState(false);
    const [showVeiculoModal, setShowVeiculoModal] = useState(false);
    const [showDetalhes, setShowDetalhes] = useState(false);
    const [editingCliente, setEditingCliente] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            // CORREÇÃO: Removido o parâmetro da chamada `Cliente.list`
            const [clientesData, veiculosData, servicosData] = await Promise.all([
                Cliente.list(),
                Veiculo.list(),
                Servico.list()
            ]);

            setClientes(clientesData);
            setVeiculos(veiculosData);
            setServicos(servicosData);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        }
        setIsLoading(false);
    };

    // CORREÇÃO: Filtro robusto que verifica a existência das propriedades
    const filteredClientes = clientes.filter(cliente => {
        const termoBusca = searchTerm.toLowerCase();

        // Mapeia os campos do mock para os nomes corretos e verifica se existem
        const nomeMatch = cliente.nome ? cliente.nome.toLowerCase().includes(termoBusca) : false;
        const telefoneMatch = cliente.telefone ? cliente.telefone.includes(termoBusca) : false; // Telefone não precisa de toLowerCase
        const emailMatch = cliente.email ? cliente.email.toLowerCase().includes(termoBusca) : false;

        return nomeMatch || telefoneMatch || emailMatch;
    });

    const handleClienteClick = (cliente) => {
        setSelectedCliente(cliente);
        setShowDetalhes(true);
    };

    const handleNewCliente = () => {
        setEditingCliente(null);
        setShowClienteModal(true);
    };

    const handleEditCliente = (cliente) => {
        setEditingCliente(cliente);
        setShowClienteModal(true);
    };

    const handleClienteSuccess = () => {
        loadData();
        setShowClienteModal(false);
        setEditingCliente(null);
    };

    const handleVeiculoSuccess = () => {
        loadData();
        setShowVeiculoModal(false);
        // Se a view de detalhes estiver aberta, atualiza os dados dela também
        if (selectedCliente) {
            setSelectedCliente(prev => ({ ...prev })); // Truque para forçar re-renderização se necessário
        }
    };

    const getClienteVeiculos = (clienteId) => {
        return veiculos.filter(v => v.cliente_id === clienteId);
    };

    const getClienteServicos = (clienteId) => {
        return servicos.filter(s => s.cliente_id === clienteId);
    };

    return (
        <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Gestão de Clientes</h1>
                        <p className="text-slate-600 text-lg">Gerencie seus clientes e veículos</p>
                    </div>
                    <Button
                        onClick={handleNewCliente}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3"
                        size="lg"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Novo Cliente
                    </Button>
                </div>

                {/* Search */}
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                                placeholder="Buscar por nome, telefone ou email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 text-lg"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Lista de Clientes */}
                <div className="grid gap-6">
                    {isLoading ? (
                        Array(3).fill(0).map((_, i) => (
                            <Card key={i} className="animate-pulse">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="w-16 h-16 bg-slate-200 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-slate-200 rounded w-1/3" />
                                        <div className="h-3 bg-slate-200 rounded w-full" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        filteredClientes.map((cliente) => {
                            const clienteVeiculos = getClienteVeiculos(cliente.id);
                            const clienteServicos = getClienteServicos(cliente.id);

                            return (
                                <Card
                                    key={cliente.id}
                                    className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white group"
                                    onClick={() => handleClienteClick(cliente)}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                                                    <User className="w-8 h-8 text-white" />
                                                </div>

                                                <div className="flex-1">
                                                    {/* CORREÇÃO: Usando 'cliente.nome' */}
                                                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                                                        {cliente.nome}
                                                    </h3>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
                                                        {cliente.telefone && (
                                                            <div className="flex items-center gap-2">
                                                                <Phone className="w-4 h-4 text-blue-500" />
                                                                <span>{cliente.telefone}</span>
                                                            </div>
                                                        )}
                                                        {cliente.email && (
                                                            <div className="flex items-center gap-2">
                                                                <Mail className="w-4 h-4 text-blue-500" />
                                                                <span className="truncate">{cliente.email}</span>
                                                            </div>
                                                        )}
                                                        {cliente.endereco && (
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="w-4 h-4 text-blue-500" />
                                                                <span className="truncate">{cliente.endereco}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="outline" className="flex items-center gap-1">
                                                        <Car className="w-3 h-3" />
                                                        {clienteVeiculos.length} veículo{clienteVeiculos.length !== 1 ? 's' : ''}
                                                    </Badge>
                                                    <Badge variant="outline" className="flex items-center gap-1">
                                                        {clienteServicos.length} serviço{clienteServicos.length !== 1 ? 's' : ''}
                                                    </Badge>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={(e) => { e.stopPropagation(); handleEditCliente(cliente); }}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    Editar
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>

                {filteredClientes.length === 0 && !isLoading && (
                    <Card className="text-center py-12">
                        <CardContent>
                            <User className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">Nenhum cliente encontrado</h3>
                            <p className="text-slate-600 mb-4">
                                {searchTerm ? 'Tente ajustar os termos de busca' : 'Comece adicionando seu primeiro cliente'}
                            </p>
                            {!searchTerm && <Button onClick={handleNewCliente}><Plus className="w-4 h-4 mr-2" />Adicionar Cliente</Button>}
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Modals */}
            <ClienteModal isOpen={showClienteModal} onClose={() => setShowClienteModal(false)} cliente={editingCliente} onSuccess={handleClienteSuccess} />
            <VeiculoModal isOpen={showVeiculoModal} onClose={() => setShowVeiculoModal(false)} clienteId={selectedCliente?.id} onSuccess={handleVeiculoSuccess} />
            <ClienteDetalhes isOpen={showDetalhes} onClose={() => setShowDetalhes(false)} cliente={selectedCliente} veiculos={selectedCliente ? getClienteVeiculos(selectedCliente.id) : []} servicos={selectedCliente ? getClienteServicos(selectedCliente.id) : []} onEditCliente={handleEditCliente} onAddVeiculo={() => setShowVeiculoModal(true)} />
        </div>
    );
}