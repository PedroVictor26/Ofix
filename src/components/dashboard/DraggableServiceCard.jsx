import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ServiceCard from './ServiceCard';

export default function DraggableServiceCard({ id, servico, cliente, veiculo, onClick }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: id,
        data: {
            type: 'card',
            servico: servico,
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || 'transform 250ms ease',
        zIndex: isDragging ? 100 : 'auto',
        opacity: isDragging ? 0.8 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={(e) => {
            e.stopPropagation();
            onClick();
        }}>
            <ServiceCard
                servico={servico}
                cliente={cliente}
                veiculo={veiculo}
            />
        </div>
    );
}