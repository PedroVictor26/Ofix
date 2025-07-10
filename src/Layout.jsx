import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Package,
    DollarSign,
    Settings,
    Menu,
    X,
    Wrench,
    Bell,
    Search,
    LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "./context/AuthContext.jsx";
import { useFinanceiroContext } from "./context/FinanceiroContext.jsx";
import { Input } from "@/components/ui/input";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";


const navigationItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        description: "Visão geral operacional"
    },
    {
        title: "Clientes",
        url: "/clientes",
        icon: Users,
        description: "Gestão de clientes"
    },
    {
        title: "Estoque",
        url: "/estoque",
        icon: Package,
        description: "Controle de peças"
    },
    {
        title: "Financeiro",
        url: "/financeiro",
        icon: DollarSign,
        description: "Gestão financeira"
    },
    {
        title: "Configurações",
        url: "/configuracoes",
        icon: Settings,
        description: "Base de conhecimento"
    },
];

export default function Layout() {
    const location = useLocation();
    const { user, logout, isAuthenticated, isLoadingAuth } = useAuth(); // Use o hook useAuth
    const { faturamentoHoje } = useFinanceiroContext();
    const [searchTerm, setSearchTerm] = useState("");
    // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Parece não estar sendo usado

    // Função para filtrar itens de navegação baseado na busca
    const filteredNavigationItems = navigationItems.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <SidebarProvider>
            
            <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
                {/* Estilos CSS customizados */}
                <style>
                    {`
                        :root {
                            --primary-blue: #2563eb;
                            --primary-blue-light: #3b82f6;
                            --primary-blue-dark: #1d4ed8;
                            --accent-orange: #f59e0b;
                            --background-gradient: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
                            --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                            --card-shadow-hover: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                        }
                        
                        .sidebar-transition {
                            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        }
                        
                        .nav-item-active {
                            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
                            border-left: 4px solid #2563eb;
                            box-shadow: 0 2px 4px rgba(37, 99, 235, 0.1);
                        }
                        
                        .nav-item-hover:hover {
                            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                            transform: translateX(2px);
                        }
                        
                        .status-badge {
                            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                        }
                        
                        @keyframes pulse {
                            0%, 100% {
                                opacity: 1;
                            }
                            50% {
                                opacity: .8;
                            }
                        }
                    `}
                </style>

                {/* Sidebar fixa */}
                <Sidebar className="border-r border-slate-200/60 bg-white/95 backdrop-blur-md shadow-xl z-20 fixed h-full w-64">
                    {/* Header da Sidebar */}
                    <SidebarHeader className="border-b border-slate-200/60 p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-200">
                                    <img src="/logo.png" alt="OFIX Logo" className="w-full h-full object-contain" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center shadow-sm status-badge">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                            </div>
                            <div>
                                <h2 className="font-bold text-2xl text-slate-900 tracking-tight">OFIX</h2>
                                <p className="text-xs text-slate-600 font-medium uppercase tracking-wider">Sistema Operacional</p>
                            </div>
                        </div>
                    </SidebarHeader>

                    {/* Conteúdo da Sidebar */}
                    <SidebarContent className="p-4">
                        {/* Barra de Busca */}
                        <div className="mb-6">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <Input
                                    placeholder="Buscar funcionalidades..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-slate-50/80 border-slate-200 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 rounded-xl"
                                />
                            </div>
                        </div>

                        {/* Menu de Navegação */}
                        <SidebarGroup>
                            <SidebarGroupLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 py-2 flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                Navegação Principal
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu className="space-y-2">
                                    {filteredNavigationItems.map((item) => {
                                        const isActive = location.pathname === item.url;
                                        return (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton
                                                    asChild
                                                    className={`sidebar-transition rounded-xl group ${
                                                        isActive
                                                            ? 'nav-item-active text-blue-700'
                                                            : 'text-slate-600 nav-item-hover hover:text-slate-900'
                                                    }`}
                                                >
                                                    <Link to={item.url} className="flex items-center gap-4 px-4 py-3">
                                                        <div className={`p-2 rounded-lg transition-all duration-200 ${
                                                            isActive 
                                                                ? 'bg-blue-500 text-white shadow-lg' 
                                                                : 'bg-slate-100 group-hover:bg-slate-200'
                                                        }`}>
                                                            <item.icon className="w-4 h-4" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className={`font-semibold text-sm ${isActive ? 'text-blue-700' : ''}`}>
                                                                {item.title}
                                                            </div>
                                                            <div className="text-xs text-slate-500 truncate">
                                                                {item.description}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>

                        {/* Status Rápido */}
                        <SidebarGroup className="mt-8">
                            <SidebarGroupLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 py-2 flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full status-badge"></div>
                                Status do Sistema
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <div className="px-3 py-2 space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                                        <div>
                                            <span className="text-sm font-medium text-slate-700">Serviços Ativos</span>
                                            <div className="text-xs text-slate-500">Em andamento</div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="font-bold text-blue-600 bg-blue-200 px-3 py-1 rounded-full text-sm">0</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                                        <div>
                                            <span className="text-sm font-medium text-slate-700">Estoque Baixo</span>
                                            <div className="text-xs text-slate-500">Requer atenção</div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="font-bold text-orange-600 bg-orange-200 px-3 py-1 rounded-full text-sm">0</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                                        <div>
                                            <span className="text-sm font-medium text-slate-700">Faturamento Hoje</span>
                                            <div className="text-xs text-slate-500">Receita atual</div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="font-bold text-green-600 text-sm">{faturamentoHoje.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                        </div>
                                    </div>
                                </div>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>

                    {/* Footer da Sidebar */}
                    <SidebarFooter className="border-t border-slate-200/60 p-4 bg-gradient-to-r from-slate-50 to-gray-50">
                        <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center shadow-md">
                                    {/* Exibe a inicial do nome do usuário ou 'U' como fallback */}
                                    <span className="text-white font-semibold text-sm">
                                        {user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
                                    </span>
                                </div>
                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${isAuthenticated ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-900 text-sm truncate">
                                    {isLoadingAuth ? "Carregando..." : (isAuthenticated && user?.nome ? user.nome : "Visitante")}
                                </p>
                                <p className="text-xs text-slate-500 truncate">
                                    {isAuthenticated && user?.role ? user.role.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) : "Não autenticado"}
                                </p>
                            </div>
                            {isAuthenticated && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={logout}
                                    className="text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200"
                                    title="Sair"
                                >
                                    <LogOut className="w-5 h-5" />
                                </Button>
                            )}
                            {/* O botão de sino pode ser mantido ou removido se não houver funcionalidade de notificação */}
                            <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
                                title="Notificações"
                            >
                                <Bell className="w-5 h-5" />
                            </Button>
                        </div>
                    </SidebarFooter>
                </Sidebar>

                {/* Conteúdo Principal */}
                <main className="flex-1 flex flex-col overflow-hidden ml-64">
                    {/* Header fixo */}
                    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/60 px-6 py-4 sticky top-0 z-10 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="hidden md:flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                        <img src="/logo.png" alt="OFIX Logo" className="w-full h-full object-contain" />
                                    </div>
                                    <h1 className="text-xl font-bold text-slate-900">OFIX - Sistema Operacional</h1>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600">
                                <Bell className="w-4 h-4" />
                            </Button>
                        </div>
                    </header>

                    {/* Header Mobile */}
                    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/60 px-6 py-4 md:hidden shadow-sm sticky top-0 z-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                        <img src="/logo.png" alt="OFIX Logo" className="w-full h-full object-contain" />
                                    </div>
                                    <h1 className="text-xl font-bold text-slate-900">OFIX</h1>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600">
                                <Bell className="w-4 h-4" />
                            </Button>
                        </div>
                    </header>

                    {/* Área de Conteúdo */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}