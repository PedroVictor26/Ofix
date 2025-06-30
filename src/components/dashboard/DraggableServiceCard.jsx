import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ServiceCard from './ServiceCard'; // O componente visual do card
import { motion } from 'framer-motion';

export default function DraggableServiceCard({ id, servico, cliente, veiculo, onClick, statusConfig }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging, // Para aplicar estilos enquanto arrasta
    } = useSortable({
        id: id,
        data: { // Dados adicionais que podem ser úteis no onDragEnd ou outros eventos
            type: 'card',
            servico: servico,
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 100 : 'auto', // Eleva o card enquanto arrasta
        opacity: isDragging ? 0.75 : 1,   // Dá um feedback visual de arrasto
    };

    // Framer Motion para animações de entrada/saída e layout
    // A animação de layout (reordenação) é gerenciada pelo SortableContext e motion.div
    // As animações de entrada/saída (aparecer/desaparecer) são gerenciadas pelo AnimatePresence no KanbanColumn

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            layoutId={id} // Para animação suave entre colunas
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
            transition={{ type: "spring", stiffness: 260, damping: 20, duration: 0.2 }}
            className={isDragging ? 'shadow-2xl scale-105' : 'shadow-md'} // Estilo extra durante o drag
        >
            <ServiceCard
                servico={servico}
                cliente={cliente}
                veiculo={veiculo}
                onClick={onClick} // Mantém a funcionalidade de clique original
                statusConfig={statusConfig}
            />
        </motion.div>
    );
}
