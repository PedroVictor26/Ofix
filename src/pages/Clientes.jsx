// src/pages/Clientes.jsx

import React, { useState, useEffect } from "react";
// import { Cliente, Veiculo, Servico } from "../entities/mock-data"; // Removido mock data para Cliente
import { Veiculo, Servico } from "../entities/mock-data"; // Mantido para Veiculo e Servico por enquanto
import apiClient from "../services/api"; // Importado apiClient
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card"; // CardHeader, CardTitle removidos se não usados diretamente aqui
import { Badge } from "@/components/ui/badge";
import { Plus, Search, User, Car, Phone, Mail, MapPin } from "lucide-react";

// Importe os modais e componentes de detalhes
import ClienteModal from "../components/clientes/ClienteModal";
import VeiculoModal from "../components/clientes/VeiculoModal";
import ClienteDetalhes from "../components/clientes/ClienteDetalhes";

export default function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [veiculos, setVeiculos] = useState([]); // Ainda mockado, ajustar se necessário
    const [servicos, setServicos] = useState([]); // Ainda mockado, ajustar se necessário
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [showClienteModal, setShowClienteModal] = useState(false);
    const [showVeiculoModal, setShowVeiculoModal] = useState(false);
    const [showDetalhes, setShowDetalhes] = useState(false);
    const [editingCliente, setEditingCliente] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Busca clientes da API
            const clientesResponse = await apiClient.get('/clientes');
            setClientes(clientesResponse.data);

            // Mantém Veiculo e Servico do mock por enquanto
            // TODO: Implementar busca de veículos e serviços da API quando as rotas estiverem prontas
            const [veiculosData, servicosData] = await Promise.all([
                Veiculo.list(), // Mock
                Servico.list()  // Mock
            ]);
            setVeiculos(veiculosData);
            setServicos(servicosData);

        } catch (err) {
            console.error("Erro ao carregar dados:", err);
            setError(err.response?.data?.error || err.message || "Erro ao carregar dados. Tente novamente.");
            setClientes([]); // Limpa clientes em caso de erro para não mostrar dados antigos/inconsistentes
        }
        setIsLoading(false);
    };

    const filteredClientes = clientes.filter(cliente => {
        const termoBusca = searchTerm.toLowerCase();
        // Os nomes dos campos retornados pelo backend são nomeCompleto, cpfCnpj, etc.
        const nomeMatch = cliente.nomeCompleto ? cliente.nomeCompleto.toLowerCase().includes(termoBusca) : false;
        const telefoneMatch = cliente.telefone ? cliente.telefone.includes(termoBusca) : false;
        const emailMatch = cliente.email ? cliente.email.toLowerCase().includes(termoBusca) : false;
        const cpfCnpjMatch = cliente.cpfCnpj ? cliente.cpfCnpj.includes(termoBusca) : false;

        return nomeMatch || telefoneMatch || emailMatch || cpfCnpjMatch;
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
        // Passa os dados do cliente para o modal, que agora espera nomeCompleto, etc.
        setEditingCliente(cliente);
        setShowClienteModal(true);
    };

    const handleClienteSuccess = (novoOuAtualizadoCliente) => {
        // Em vez de recarregar tudo, podemos atualizar o estado local de forma otimizada
        // Se for um novo cliente (não tem ID antes, mas tem depois)
        if (editingCliente === null && novoOuAtualizadoCliente?.id) {
            setClientes(prevClientes => [novoOuAtualizadoCliente, ...prevClientes].sort((a, b) => a.nomeCompleto.localeCompare(b.nomeCompleto)));
        }
        // Se for uma atualização (tem ID antes e depois)
        else if (editingCliente?.id && novoOuAtualizadoCliente?.id) {
            setClientes(prevClientes =>
                prevClientes.map(c => (c.id === novoOuAtualizadoCliente.id ? novoOuAtualizadoCliente : c))
                            .sort((a, b) => a.nomeCompleto.localeCompare(b.nomeCompleto))
            );
        }
        // Fallback: recarregar todos os dados se a lógica acima não cobrir
        else {
            loadData();
        }
        setShowClienteModal(false);
        setEditingCliente(null);
    };

    const handleVeiculoSuccess = () => { // Manter como está por enquanto, focado em clientes
        loadData(); // Recarrega tudo, incluindo veículos mockados
        setShowVeiculoModal(false);
        if (selectedCliente) {
            // Para forçar re-render do ClienteDetalhes se ele depender de uma nova contagem de veículos,
            // precisamos garantir que os dados do selectedCliente sejam atualizados se a lista de veículos mudar.
            // Como veiculos ainda é mock, uma forma é recarregar o selectedCliente ou a lista de clientes.
            // A maneira mais simples, dado que `loadData` busca clientes da API:
            const clienteAtualizado = clientes.find(c => c.id === selectedCliente.id);
            if (clienteAtualizado) setSelectedCliente(clienteAtualizado);
        }
    };

    // Estas funções ainda usam 'veiculos' e 'servicos' do estado, que são mockados.
    // Precisarão ser ajustadas quando Veiculos e Servicos vierem da API.
    // O backend retorna `id` para cliente, `clienteId` para veículo/serviço.
    const getClienteVeiculos = (clienteId) => {
        return veiculos.filter(v => v.cliente_id === clienteId || v.clienteId === clienteId);
    };

    const getClienteServicos = (clienteId) => {
        return servicos.filter(s => s.cliente_id === clienteId || s.clienteId === clienteId);
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
                                placeholder="Buscar por nome, CPF/CNPJ, telefone ou email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 text-lg"
                            />
                        </div>
                    </CardContent>
                </Card>

                {error && (
                    <Card className="bg-red-100 border-red-400 text-red-700">
                        <CardContent className="p-4">
                            <p><span className="font-bold">Erro:</span> {error}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Lista de Clientes */}
                <div className="grid gap-6">
                    {isLoading ? (
                        Array(3).fill(0).map((_, i) => ( // Skeleton loader
                            <Card key={i} className="animate-pulse bg-white/50">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="w-16 h-16 bg-slate-200 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-slate-200 rounded w-1/3" />
                                        <div className="h-3 bg-slate-200 rounded w-full" />
                                        <div className="h-3 bg-slate-200 rounded w-2/3" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        filteredClientes.map((cliente) => {
                            // Veiculos e Servicos ainda são dos mocks
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
                                            <div className="flex items-center gap-4 flex-1 min-w-0"> {/* Adicionado min-w-0 para truncamento funcionar */}
                                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                                                    <User className="w-8 h-8 text-white" />
                                                </div>

                                                <div className="flex-1 min-w-0"> {/* Adicionado min-w-0 */}
                                                    <h3 className="text-xl font-bold text-slate-900 mb-2 truncate" title={cliente.nomeCompleto}>
                                                        {cliente.nomeCompleto}
                                                    </h3>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 text-sm text-slate-600">
                                                        {cliente.telefone && (
                                                            <div className="flex items-center gap-2 truncate" title={cliente.telefone}>
                                                                <Phone className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                                                <span className="truncate">{cliente.telefone}</span>
                                                            </div>
                                                        )}
                                                        {cliente.email && (
                                                            <div className="flex items-center gap-2 truncate" title={cliente.email}>
                                                                <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                                                <span className="truncate">{cliente.email}</span>
                                                            </div>
                                                        )}
                                                        {cliente.cpfCnpj && (
                                                            <div className="flex items-center gap-2 truncate" title={cliente.cpfCnpj}>
                                                                {/* Ícone pode ser ajustado ou um genérico */}
                                                                <User className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                                                <span className="truncate">{cliente.cpfCnpj}</span>
                                                            </div>
                                                        )}
                                                        {cliente.endereco && (
                                                            <div className="flex items-center gap-2 truncate md:col-span-2 lg:col-span-1" title={cliente.endereco}>
                                                                <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                                                <span className="truncate">{cliente.endereco}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right space-y-2 ml-4 flex-shrink-0">
                                                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3">
                                                    <Badge variant="outline" className="flex items-center gap-1 text-xs sm:text-sm">
                                                        <Car className="w-3 h-3" />
                                                        {clienteVeiculos.length} veículo{clienteVeiculos.length !== 1 ? 's' : ''}
                                                    </Badge>
                                                    <Badge variant="outline" className="flex items-center gap-1 text-xs sm:text-sm">
                                                        {/* Ícone para serviços pode ser adicionado */}
                                                        {clienteServicos.length} serviço{clienteServicos.length !== 1 ? 's' : ''}
                                                    </Badge>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={(e) => { e.stopPropagation(); handleEditCliente(cliente); }}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity mt-2"
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

                {filteredClientes.length === 0 && !isLoading && !error && (
                    <Card className="text-center py-12 bg-white/80 backdrop-blur-sm">
                        <CardContent>
                            <User className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">Nenhum cliente encontrado</h3>
                            <p className="text-slate-600 mb-4">
                                {searchTerm ? 'Tente ajustar os termos de busca ou verifique se há erros.' : 'Comece adicionando seu primeiro cliente.'}
                            </p>
                            {!searchTerm && <Button onClick={handleNewCliente}><Plus className="w-4 h-4 mr-2" />Adicionar Cliente</Button>}
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Modals */}
            {/* A prop `cliente` para ClienteModal agora espera os campos do backend (nomeCompleto, etc.) */}
            <ClienteModal isOpen={showClienteModal} onClose={() => setShowClienteModal(false)} cliente={editingCliente} onSuccess={handleClienteSuccess} />
            {/* VeiculoModal e ClienteDetalhes ainda podem usar dados mockados ou precisarão de adaptação quando suas fontes de dados mudarem */}
            <VeiculoModal isOpen={showVeiculoModal} onClose={() => setShowVeiculoModal(false)} clienteId={selectedCliente?.id} onSuccess={handleVeiculoSuccess} />
            <ClienteDetalhes
                isOpen={showDetalhes}
                onClose={() => setShowDetalhes(false)}
                cliente={selectedCliente}
                veiculos={selectedCliente ? getClienteVeiculos(selectedCliente.id) : []}
                servicos={selectedCliente ? getClienteServicos(selectedCliente.id) : []}
                onEditCliente={handleEditCliente}
                onAddVeiculo={() => setShowVeiculoModal(true)}
            />
        </div>
    );
}