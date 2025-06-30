import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Package, DollarSign, AlertTriangle, Building2 } from "lucide-react";
import { motion } from "framer-motion";

export default function EstoqueStats({ totalPecas, valorTotalEstoque, estoqueBaixo, totalFornecedores }) {
    const stats = [
        {
            title: "Total de Peças",
            value: totalPecas,
            icon: Package,
            gradient: "from-blue-500 to-blue-600"
        },
        {
            title: "Valor do Estoque",
            value: `R$ ${valorTotalEstoque.toFixed(2)}`,
            icon: DollarSign,
            gradient: "from-green-500 to-green-600"
        },
        {
            title: "Estoque Baixo",
            value: estoqueBaixo,
            icon: AlertTriangle,
            gradient: "from-orange-500 to-orange-600"
        },
        {
            title: "Fornecedores",
            value: totalFornecedores,
            icon: Building2,
            gradient: "from-purple-500 to-purple-600"
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                        <div className={`absolute top-0 right-0 w-20 h-20 transform translate-x-6 -translate-y-6 bg-gradient-to-r ${stat.gradient} rounded-full opacity-10`} />
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stat.title}</p>
                                    <p className="text-xl font-bold text-slate-900 mt-1">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} bg-opacity-20`}>
                                    <stat.icon className={`w-5 h-5 text-white`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}