import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, TrendingUp, TrendingDown } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function FinanceiroTable({ transacoes, servicos, onEdit, isLoading }) {

    const getServicoInfo = (servicoId) => {
        const servico = servicos.find(s => s.id === servicoId);
        return servico ? `OS #${servico.numero_os}` : 'N/A';
    };

    const getTypeBadge = (type) => {
        if (type === 'entrada') {
            return (
                <Badge variant="outline" className="text-green-600 border-green-600">
                    <TrendingUp className="w-3 h-3 mr-1" /> Entrada
                </Badge>
            );
        }
        return (
            <Badge variant="outline" className="text-red-600 border-red-600">
                <TrendingDown className="w-3 h-3 mr-1" /> Saída
            </Badge>
        );
    };

    if (isLoading) {
        return (
            <div className="space-y-2">
                {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Ações</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {transacoes.map((t) => (
                    <TableRow key={t.id}>
                        <TableCell className="font-medium">{t.descricao}</TableCell>
                        <TableCell className={t.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}>
                            R$ {t.valor.toFixed(2)}
                        </TableCell>
                        <TableCell>{getTypeBadge(t.tipo)}</TableCell>
                        <TableCell>
                            <Badge variant="secondary">{t.categoria.replace('_', ' ')}</Badge>
                        </TableCell>
                        <TableCell>{format(new Date(t.data_transacao), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                        <TableCell>{getServicoInfo(t.servico_id)}</TableCell>
                        <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => onEdit(t)}>
                                <Edit className="w-4 h-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}