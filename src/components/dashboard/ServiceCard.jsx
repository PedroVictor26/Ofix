import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Car } from "lucide-react";

export default function ServiceCard({ servico, cliente, veiculo, onClick }) {
    return (
        <Card
            onClick={onClick}
            className="mb-4 bg-white rounded-lg shadow-sm border border-slate-200 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
        >
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-slate-800 text-sm truncate pr-2">{servico.problema}</p>
                    <Badge variant="outline" className="text-xs font-mono">#{servico.id}</Badge>
                </div>
                
                <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{cliente?.nome || "Cliente não encontrado"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Car className="w-3.5 h-3.5 text-slate-400" />
                        <span>{veiculo?.modelo || "Veículo não encontrado"}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
