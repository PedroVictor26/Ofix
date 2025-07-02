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
import { Textarea } from "@/components/ui/textarea";
import { Save, Loader2, AlertCircle } from "lucide-react";

// Um componente de erro reutilizável para os campos do formulário
const FormError = ({ message }) => (
    <div className="flex items-center gap-2 text-sm text-red-600 mt-1">
        <AlertCircle className="w-4 h-4" />
        <span>{message}</span>
    </div>
);

export default function ClienteModal({ isOpen, onClose, cliente, onSuccess }) {
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({});

    // Efeito para inicializar ou resetar o formulário quando o cliente ou o estado de abertura mudam
    useEffect(() => {
        if (isOpen) {
            setFormData({
                nome: cliente?.nome || '',
                telefone: cliente?.telefone || '',
                email: cliente?.email || '',
                endereco: cliente?.endereco || '',
                // Adicione outros campos que possam existir no objeto cliente
            });
            setErrors({}); // Limpa os erros ao abrir o modal
        }
    }, [isOpen, cliente]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        // Limpa o erro do campo quando o usuário começa a digitar
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nome?.trim()) {
            newErrors.nome = "O nome do cliente é obrigatório.";
        }
        if (!formData.telefone?.trim()) {
            newErrors.telefone = "O telefone é obrigatório.";
        }
        // Adicione outras validações aqui (ex: email, etc.)
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        setIsSaving(true);
        try {
            // Simulação de chamada de API
            // Substitua pela sua lógica real de API (Cliente.create, Cliente.update)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log("Salvando dados:", formData);
            onSuccess(); // Chama a função de sucesso passada como prop
            onClose(); // Fecha o modal
        } catch (error) {
            console.error("Erro ao salvar cliente:", error);
            // Aqui você pode adicionar um toast de erro, se desejar
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-800">
                        {cliente ? 'Editar Cliente' : 'Novo Cliente'}
                    </DialogTitle>
                    <DialogDescription>
                        Preencha as informações abaixo para {cliente ? 'atualizar o' : 'criar um novo'} cliente.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="nome">Nome Completo *</Label>
                        <Input
                            id="nome"
                            value={formData.nome || ''}
                            onChange={handleInputChange}
                            placeholder="Ex: João da Silva"
                            className={errors.nome ? "border-red-500" : ""}
                        />
                        {errors.nome && <FormError message={errors.nome} />}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="telefone">Telefone *</Label>
                            <Input
                                id="telefone"
                                value={formData.telefone || ''}
                                onChange={handleInputChange}
                                placeholder="(11) 99999-9999"
                                className={errors.telefone ? "border-red-500" : ""}
                            />
                            {errors.telefone && <FormError message={errors.telefone} />}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email || ''}
                                onChange={handleInputChange}
                                placeholder="joao.silva@email.com"
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="endereco">Endereço</Label>
                        <Textarea
                            id="endereco"
                            value={formData.endereco || ''}
                            onChange={handleInputChange}
                            placeholder="Rua das Flores, 123, São Paulo, SP"
                            className="h-24"
                        />
                    </div>
                </form>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
                        Cancelar
                    </Button>
                    <Button type="submit" onClick={handleSubmit} disabled={isSaving}>
                        {isSaving ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...</>
                        ) : (
                            <><Save className="w-4 h-4 mr-2" /> Salvar</>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
