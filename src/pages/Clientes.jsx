import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, User, AlertCircle, RefreshCw } from "lucide-react";

// Importações atualizadas
import { useClientesData } from "../hooks/useClientesData";
import { ClienteCard, ClienteCardSkeleton } from "../components/clientes/ClienteCard";
import ClienteModal from "../components/clientes/ClienteModal";
import VeiculoModal from "../components/clientes/VeiculoModal";
import ClienteDetalhes from "../components/clientes/ClienteDetalhes";

// Componente de Erro com design refinado
const ErrorState = ({ error, onRetry }) => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-8">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-700 mb-2">Oops! Algo deu errado.</h2>
            <p className="text-slate-500 mb-6">Não foi possível carregar os dados. Tente novamente.</p>
            <Button onClick={onRetry} variant="destructive">
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar Novamente
            </Button>
        </div>
    </div>
);

// Componente de Estado Vazio com design refinado
const EmptyState = ({ onNewCliente, searchTerm }) => (
     <div className="text-center py-16 px-6 bg-white rounded-xl border border-slate-200">
        <User className="w-12 h-12 mx-auto mb-4 text-slate-400" />
        <h3 className="text-xl font-semibold text-slate-700 mb-2">Nenhum cliente encontrado</h3>
        <p className="text-slate-500 mb-6">
            {searchTerm ? 'Tente ajustar sua busca.' : 'Clique no botão abaixo para começar.'}
        </p>
        <Button onClick={onNewCliente}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Novo Cliente
        </Button>
    </div>
);


export default function Clientes() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [editingCliente, setEditingCliente] = useState(null);
    
    const [isClienteModalOpen, setClienteModalOpen] = useState(false);
    const [isVeiculoModalOpen, setVeiculoModalOpen] = useState(false);
    const [isDetalhesOpen, setDetalhesOpen] = useState(false);

    const { clientes, isLoading, error, loadData, getVeiculosByCliente, getServicosByCliente } = useClientesData();

    const filteredClientes = useMemo(() =>
        clientes.filter(cliente => {
            const termo = searchTerm.toLowerCase();
            return (
                cliente.nome?.toLowerCase().includes(termo) ||
                cliente.telefone?.includes(termo) ||
                cliente.email?.toLowerCase().includes(termo)
            );
        }), [clientes, searchTerm]);

    const handleClienteClick = (cliente) => {
        setSelectedCliente(cliente);
        setDetalhesOpen(true);
    };

    const handleNewCliente = () => {
        setEditingCliente(null);
        setClienteModalOpen(true);
    };

    const handleEditCliente = (cliente) => {
        setEditingCliente(cliente);
        setClienteModalOpen(true);
    };
    
    const handleAddVeiculo = () => {
        console.log("handleAddVeiculo called. selectedCliente:", selectedCliente); // Log para depuração
        setVeiculoModalOpen(true);
    }

    const handleClienteSuccess = () => {
        setClienteModalOpen(false);
        setEditingCliente(null);
        loadData();
    };

    const handleVeiculoSuccess = () => {
        setVeiculoModalOpen(false);
        loadData();
    };

    if (error) {
        return <div className="p-4 sm:p-6 lg:p-8"><ErrorState error={error} onRetry={loadData} /></div>;
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">Gestão de Clientes</h1>
                            <p className="text-slate-500 mt-1">Visualize, adicione e gerencie seus clientes.</p>
                        </div>
                        <Button onClick={handleNewCliente} size="lg">
                            <Plus className="w-5 h-5 mr-2" />
                            Novo Cliente
                        </Button>
                    </div>
                </header>

                {/* Search */}
                <div className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        <Input
                            placeholder="Buscar por nome, telefone ou email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 pr-4 py-3 text-base h-12 rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Lista de Clientes */}
                <main className="grid gap-4">
                    {isLoading ? (
                        Array(3).fill(0).map((_, i) => <ClienteCardSkeleton key={i} />)
                    ) : filteredClientes.length > 0 ? (
                        filteredClientes.map((cliente) => (
                            <ClienteCard
                                key={cliente.id}
                                cliente={cliente}
                                veiculos={getVeiculosByCliente(cliente.id)}
                                servicos={getServicosByCliente(cliente.id)}
                                onCardClick={handleClienteClick}
                                onEditClick={handleEditCliente}
                            />
                        ))
                    ) : (
                        <EmptyState onNewCliente={handleNewCliente} searchTerm={searchTerm} />
                    )}
                </main>
            </div>

            {/* Modals */}
            <ClienteModal isOpen={isClienteModalOpen} onClose={() => setClienteModalOpen(false)} cliente={editingCliente} onSuccess={handleClienteSuccess} />
            <VeiculoModal isOpen={isVeiculoModalOpen} onClose={() => setVeiculoModalOpen(false)} clienteId={selectedCliente?.id} onSuccess={handleVeiculoSuccess} />
            <ClienteDetalhes 
                isOpen={isDetalhesOpen} 
                onClose={() => setDetalhesOpen(false)} 
                cliente={selectedCliente} 
                veiculos={selectedCliente ? getVeiculosByCliente(selectedCliente.id) : []} 
                servicos={selectedCliente ? getServicosByCliente(selectedCliente.id) : []} 
                onEditCliente={handleEditCliente} 
                onAddVeiculo={handleAddVeiculo} 
            />
        </div>
    );
}