import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Loader2, AlertCircle } from "lucide-react";

const FormError = ({ message }) => (
    <div className="flex items-center gap-2 text-sm text-red-600 mt-1">
        <AlertCircle className="w-4 h-4" />
        <span>{message}</span>
    </div>
);

export default function PecaModal({ isOpen, onClose, peca, fornecedores, onSuccess }) {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData({
                nome: peca?.nome || '',
                sku: peca?.sku || '',
                fabricante: peca?.fabricante || '',
                fornecedor_id: peca?.fornecedor_id || null,
                preco_custo: peca?.preco_custo || 0,
                preco_venda: peca?.preco_venda || 0,
                quantidade: peca?.quantidade || 0,
                estoque_minimo: peca?.estoque_minimo || 1,
            });
            setErrors({});
        }
    }, [isOpen, peca]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: null }));
        }
    };

    const handleSelectChange = (id, value) => {
        setFormData(prev => ({ ...prev, [id]: value }));
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nome?.trim()) newErrors.nome = "O nome da peça é obrigatório.";
        if (!formData.sku?.trim()) newErrors.sku = "O SKU é obrigatório.";
        if (formData.preco_venda <= 0) newErrors.preco_venda = "O preço de venda deve ser positivo.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log("Salvando peça:", formData);
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Erro ao salvar peça:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-800">
                        {peca ? 'Editar Peça' : 'Nova Peça no Estoque'}
                    </DialogTitle>
                    <DialogDescription>
                        Preencha os detalhes da peça abaixo.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="nome">Nome da Peça *</Label>
                            <Input id="nome" value={formData.nome} onChange={handleInputChange} placeholder="Ex: Filtro de Óleo" className={errors.nome ? "border-red-500" : ""} />
                            {errors.nome && <FormError message={errors.nome} />}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="sku">SKU (Código) *</Label>
                            <Input id="sku" value={formData.sku} onChange={handleInputChange} placeholder="Ex: FO-123" className={errors.sku ? "border-red-500" : ""} />
                            {errors.sku && <FormError message={errors.sku} />}
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="fabricante">Fabricante</Label>
                            <Input id="fabricante" value={formData.fabricante} onChange={handleInputChange} placeholder="Ex: Fram" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="fornecedor_id">Fornecedor</Label>
                            <Select value={formData.fornecedor_id} onValueChange={(value) => handleSelectChange('fornecedor_id', value)}>
                                <SelectTrigger><SelectValue placeholder="Selecione um fornecedor" /></SelectTrigger>
                                <SelectContent>
                                    {fornecedores?.map(f => <SelectItem key={f.id} value={f.id}>{f.nome}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                         <div className="grid gap-2">
                            <Label htmlFor="preco_custo">Preço de Custo (R$)</Label>
                            <Input id="preco_custo" type="number" value={formData.preco_custo} onChange={handleInputChange} placeholder="0.00" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="preco_venda">Preço de Venda (R$) *</Label>
                            <Input id="preco_venda" type="number" value={formData.preco_venda} onChange={handleInputChange} placeholder="0.00" className={errors.preco_venda ? "border-red-500" : ""} />
                            {errors.preco_venda && <FormError message={errors.preco_venda} />}
                        </div>
                    </div>

                     <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="quantidade">Quantidade em Estoque</Label>
                            <Input id="quantidade" type="number" value={formData.quantidade} onChange={handleInputChange} placeholder="0" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="estoque_minimo">Estoque Mínimo</Label>
                            <Input id="estoque_minimo" type="number" value={formData.estoque_minimo} onChange={handleInputChange} placeholder="0" />
                        </div>
                    </div>
                </form>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>Cancelar</Button>
                    <Button type="submit" onClick={handleSubmit} disabled={isSaving}>
                        {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...</> : <><Save className="w-4 h-4 mr-2" /> Salvar</>}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
