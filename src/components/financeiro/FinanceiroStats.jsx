import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, DollarSign, List } from "lucide-react";
import { motion } from "framer-motion";

const StatCard = ({ title, value, icon: Icon, gradient, isLoading }) => {
    const formattedValue = typeof value === 'number' ? `R$ ${value.toFixed(2)}` : value;

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-4">
                    <Skeleton className="h-6 w-24 mb-2" />
                    <Skeleton className="h-8 w-32" />
                </CardContent>
            </Card>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <div className={`absolute top-0 right-0 w-20 h-20 transform translate-x-6 -translate-y-6 bg-gradient-to-r ${gradient} rounded-full opacity-10`} />
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</p>
                            <p className="text-xl font-bold text-slate-900 mt-1">{formattedValue}</p>
                        </div>
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} bg-opacity-20`}>
                            <Icon className="w-5 h-5 text-white" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default function FinanceiroStats({ entradas, saidas, saldo, totalTransacoes, isLoading }) {
    const stats = [
        { title: "Receitas", value: entradas, icon: TrendingUp, gradient: "from-green-500 to-green-600" },
        { title: "Despesas", value: saidas, icon: TrendingDown, gradient: "from-red-500 to-red-600" },
        { title: "Saldo", value: saldo, icon: DollarSign, gradient: "from-blue-500 to-blue-600" },
        { title: "Transações", value: totalTransacoes, icon: List, gradient: "from-purple-500 to-purple-600" },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(stat => (
                <StatCard key={stat.title} {...stat} isLoading={isLoading} />
            ))}
        </div>
    );
}