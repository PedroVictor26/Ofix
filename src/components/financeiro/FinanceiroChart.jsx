import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

const processDataForChart = (transacoes) => {
    const groupedData = transacoes.reduce((acc, t) => {
        const transactionDate = new Date(t.data);
        if (isNaN(transactionDate.getTime())) { // Verifica se a data é válida
            console.warn("Data de transação inválida encontrada, ignorando:", t.data);
            return acc;
        }
        const date = format(transactionDate, 'dd/MM');
        if (!acc[date]) {
            acc[date] = { date, entrada: 0, saida: 0 };
        }
        if (t.tipo === 'entrada') {
            acc[date].entrada += t.valor;
        } else {
            acc[date].saida += t.valor;
        }
        return acc;
    }, {});

    return Object.values(groupedData).sort((a, b) => {
        const [dayA, monthA] = a.date.split('/');
        const [dayB, monthB] = b.date.split('/');
        const dateA = new Date(new Date().getFullYear(), monthA - 1, dayA);
        const dateB = new Date(new Date().getFullYear(), monthB - 1, dayB);
        return dateA.getTime() - dateB.getTime();
    });
};

export default function FinanceiroChart({ transacoes }) {
    const data = processDataForChart(transacoes);

    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <BarChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => `R$${value}`} />
                    <Tooltip formatter={(value) => `R$${value.toFixed(2)}`} />
                    <Legend />
                    <Bar dataKey="entrada" fill="#22c55e" name="Entradas" />
                    <Bar dataKey="saida" fill="#ef4444" name="Saídas" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}