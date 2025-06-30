import React, { useState } from "react";
import { Plus, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import useDashboardData from "@/hooks/useDashboardData";
import { statusConfig } from "@/constants/statusConfig";
import StatsCards from "@/components/dashboard/StatsCards";
import KanbanBoard from "@/components/dashboard/KanbanBoard";
import ServiceModal from "@/components/dashboard/ServiceModal";
import NewServiceModal from "@/components/dashboard/NewServiceModal";

export default function Dashboard() {
    const { servicos, clientes, veiculos, isLoading, reload } = useDashboardData();

    const [selectedService, setSelectedService] = useState(null);
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [showNewServiceModal, setShowNewServiceModal] = useState(false);

    const openService = (service) => {
        setSelectedService(service);
        setShowServiceModal(true);
    };

    const closeService = () => {
        setSelectedService(null);
        setShowServiceModal(false);
        reload();
    };

    const closeNewService = () => {
        setShowNewServiceModal(false);
        reload();
    };

    const stats = {
        total: servicos.length,
        ...Object.keys(statusConfig).reduce((acc, key) => {
            acc[key] = servicos.filter((s) => s.status === key).length;
            return acc;
        }, {}),
    };

    return (
        <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">
                            Dashboard Operacional
                        </h1>
                        <p className="text-slate-600 text-lg">
                            Gerencie todos os serviços da sua oficina
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowNewServiceModal(true)}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3"
                        size="lg"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Nova Ordem de Serviço
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <StatsCards
                        title="Total de Serviços"
                        value={stats.total}
                        icon={Wrench}
                        gradient="from-slate-500 to-slate-600"
                    />
                    {Object.entries(statusConfig).map(([status, cfg]) => (
                        <StatsCards
                            key={status}
                            title={cfg.title}
                            value={stats[status]}
                            icon={cfg.icon}
                            gradient={cfg.gradient}
                        />
                    ))}
                </div>

                {/* Kanban */}
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Wrench className="w-6 h-6 text-blue-600" />
                            Quadro de Serviços
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <KanbanBoard
                            servicos={servicos}
                            clientes={clientes}
                            veiculos={veiculos}
                            onServiceClick={openService}
                            statusConfig={statusConfig}
                            isLoading={isLoading}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Modais */}
            <ServiceModal
                isOpen={showServiceModal}
                onClose={() => setShowServiceModal(false)}
                service={selectedService}
                onUpdate={closeService}
                clientes={clientes}
                veiculos={veiculos}
            />

            <NewServiceModal
                isOpen={showNewServiceModal}
                onClose={() => setShowNewServiceModal(false)}
                onSuccess={closeNewService}
                clientes={clientes}
                veiculos={veiculos}
            />
        </div>
    );
}



// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Servico, Cliente, Veiculo } from "../entities/mock-data";
// import { Card, CardContent, CardHeader, CardTitle }a from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Plus, Calendar, AlertCircle, CheckCircle2, Clock, Wrench } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// import KanbanBoard from "../components/dashboard/KanbanBoard";
// import ServiceModal from "../components/dashboard/ServiceModal";
// import NewServiceModal from "../components/dashboard/NewServiceModal";
// import StatsCards from "../components/dashboard/StatsCards";

// const statusConfig = {
//     aguardando: {
//         title: "Aguardando",
//         color: "bg-slate-100 text-slate-700",
//         icon: Clock,
//         gradient: "from-slate-500 to-slate-600"
//     },
//     em_andamento: {
//         title: "Em Andamento",
//         color: "bg-blue-100 text-blue-700",
//         icon: Wrench,
//         gradient: "from-blue-500 to-blue-600"
//     },
//     aguardando_pecas: {
//         title: "Aguardando Peças",
//         color: "bg-orange-100 text-orange-700",
//         icon: AlertCircle,
//         gradient: "from-orange-500 to-orange-600"
//     },
//     aguardando_aprovacao: {
//         title: "Aguardando Aprovação",
//         color: "bg-purple-100 text-purple-700",
//         icon: Calendar,
//         gradient: "from-purple-500 to-purple-600"
//     },
//     finalizado: {
//         title: "Finalizado",
//         color: "bg-green-100 text-green-700",
//         icon: CheckCircle2,
//         gradient: "from-green-500 to-green-600"
//     }
// };

// export default function Dashboard() {
//     const [servicos, setServicos] = useState([]);
//     const [clientes, setClientes] = useState([]);
//     const [veiculos, setVeiculos] = useState([]);
//     const [selectedService, setSelectedService] = useState(null);
//     const [showServiceModal, setShowServiceModal] = useState(false);
//     const [showNewServiceModal, setShowNewServiceModal] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         loadData();
//     }, []);

//     const loadData = async () => {
//         setIsLoading(true);
//         try {
//             const [servicosData, clientesData, veiculosData] = await Promise.all([
//                 Servico.list(),
//                 Cliente.list(),
//                 Veiculo.list()
//             ]);

//             setServicos(servicosData);
//             setClientes(clientesData);
//             setVeiculos(veiculosData);
//         } catch (error) {
//             console.error("Erro ao carregar dados:", error);
//         }
//         setIsLoading(false);
//     };

//     const handleServiceClick = (service) => {
//         setSelectedService(service);
//         setShowServiceModal(true);
//     };

//     const handleServiceUpdate = () => {
//         loadData();
//         setShowServiceModal(false);
//         setSelectedService(null);
//     };

//     const handleNewService = () => {
//         loadData();
//         setShowNewServiceModal(false);
//     };

//     const getServiceStats = () => {
//         const stats = {
//             total: servicos.length,
//             aguardando: servicos.filter(s => s.status === 'aguardando').length,
//             em_andamento: servicos.filter(s => s.status === 'em_andamento').length,
//             aguardando_pecas: servicos.filter(s => s.status === 'aguardando_pecas').length,
//             aguardando_aprovacao: servicos.filter(s => s.status === 'aguardando_aprovacao').length,
//             finalizado: servicos.filter(s => s.status === 'finalizado').length,
//         };
//         return stats;
//     };

//     const stats = getServiceStats();

//     return (
//         <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
//             <div className="max-w-7xl mx-auto space-y-8">
//                 {/* Header */}
//                 <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
//                     <div>
//                         <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard Operacional</h1>
//                         <p className="text-slate-600 text-lg">Gerencie todos os serviços da sua oficina</p>
//                     </div>
//                     <Button
//                         onClick={() => setShowNewServiceModal(true)}
//                         className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3"
//                         size="lg"
//                     >
//                         <Plus className="w-5 h-5 mr-2" />
//                         Nova Ordem de Serviço
//                     </Button>
//                 </div>

//                 {/* Stats Cards */}
//                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//                     <StatsCards
//                         title="Total de Serviços"
//                         value={stats.total}
//                         icon={Wrench}
//                         gradient="from-slate-500 to-slate-600"
//                     />
//                     {Object.entries(statusConfig).map(([status, config]) => (
//                         <StatsCards
//                             key={status}
//                             title={config.title}
//                             value={stats[status]}
//                             icon={config.icon}
//                             gradient={config.gradient}
//                         />
//                     ))}
//                 </div>

//                 {/* Kanban Board */}
//                 <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
//                     <CardHeader className="pb-4">
//                         <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
//                             <Wrench className="w-6 h-6 text-blue-600" />
//                             Quadro de Serviços
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent className="pl-2"> {/* Adicionei a classe do seu código anterior para consistência */}
//                         <KanbanBoard
//                             servicos={servicos}
//                             clientes={clientes}
//                             veiculos={veiculos}
//                             onServiceClick={handleServiceClick}
//                             statusConfig={statusConfig} // <-- A LINHA QUE FALTAVA!
//                             isLoading={isLoading}
//                         />
//                     </CardContent>
//                 </Card>
//             </div>

//             {/* Modals */}
//             <ServiceModal
//                 isOpen={showServiceModal}
//                 onClose={() => setShowServiceModal(false)}
//                 service={selectedService}
//                 onUpdate={handleServiceUpdate}
//                 clientes={clientes}
//                 veiculos={veiculos}
//             />

//             <NewServiceModal
//                 isOpen={showNewServiceModal}
//                 onClose={() => setShowNewServiceModal(false)}
//                 onSuccess={handleNewService}
//                 clientes={clientes}
//                 veiculos={veiculos}
//             />
//         </div>
//     );
// }