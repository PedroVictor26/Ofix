import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const processDataForChart = (transacoes) => {
    const groupedData = transacoes.reduce((acc, t) => {
        const date = format(new Date(t.data_transacao), 'dd/MM');
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

    return Object.values(groupedData).sort((a, b) => new Date(a.date.split('/').reverse().join('-')) - new Date(b.date.split('/').reverse().join('-')));
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