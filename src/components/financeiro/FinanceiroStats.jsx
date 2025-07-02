import { TrendingUp, TrendingDown, DollarSign, Scale } from "lucide-react";
import StatsCards, { StatsCardSkeleton } from "@/components/dashboard/StatsCards"; // Reutilizando o StatsCards

export default function FinanceiroStats({ stats, isLoading }) {
    const { entradas, saidas, saldo } = stats;

    const statItems = [
        {
            title: "Total de Entradas",
            value: `R$ ${entradas.toFixed(2)}`,
            icon: TrendingUp,
            color: "text-green-600",
            bgColor: "bg-green-100",
        },
        {
            title: "Total de Saídas",
            value: `R$ ${saidas.toFixed(2)}`,
            icon: TrendingDown,
            color: "text-red-600",
            bgColor: "bg-red-100",
        },
        {
            title: "Saldo Líquido",
            value: `R$ ${saldo.toFixed(2)}`,
            icon: Scale,
            color: saldo >= 0 ? "text-blue-600" : "text-red-600",
            bgColor: saldo >= 0 ? "bg-blue-100" : "bg-red-100",
        },
    ];

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array(3).fill(0).map((_, i) => <StatsCardSkeleton key={i} />)}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {statItems.map((stat) => (
                <StatsCards
                    key={stat.title}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    color={stat.color}
                    bgColor={stat.bgColor}
                />
            ))}
        </div>
    );
}
