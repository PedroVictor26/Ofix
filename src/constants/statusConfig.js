// src/constants/statusConfig.js
import {
    Clock,
    Wrench,
    AlertCircle,
    Calendar,
    CheckCircle2,
} from "lucide-react";

export const statusConfig = {
    AGUARDANDO: {
        title: "Aguardando",
        color: "bg-slate-100 text-slate-700",
        icon: Clock,
        gradient: "from-slate-500 to-slate-600",
    },
    EM_ANDAMENTO: {
        title: "Em Andamento",
        color: "bg-blue-100 text-blue-700",
        icon: Wrench,
        gradient: "from-blue-500 to-blue-600",
    },
    AGUARDANDO_PECAS: {
        title: "Aguardando Peças",
        color: "bg-orange-100 text-orange-700",
        icon: AlertCircle,
        gradient: "from-orange-500 to-orange-600",
    },
    AGUARDANDO_APROVACAO: {
        title: "Aguardando Aprovação",
        color: "bg-purple-100 text-purple-700",
        icon: Calendar,
        gradient: "from-purple-500 to-purple-600",
    },
    FINALIZADO: {
        title: "Finalizado",
        color: "bg-green-100 text-green-700",
        icon: CheckCircle2,
        gradient: "from-green-500 to-green-600",
    },
    CANCELADO: {
        title: "Cancelado",
        color: "bg-red-100 text-red-700",
        icon: AlertCircle,
        gradient: "from-red-500 to-red-600",
    },
};
