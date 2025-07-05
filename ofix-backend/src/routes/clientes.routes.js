import { Router } from 'express';
import clientesController from '../controllers/clientes.controller.js';

const router = Router();

router.post('/', clientesController.createCliente);
router.get('/', clientesController.getAllClientes);
router.get('/:id', clientesController.getClienteById);
router.put('/:id', clientesController.updateCliente);
router.delete('/:id', clientesController.deleteCliente);
router.post('/:clienteId/veiculos', clientesController.createVeiculo);

export default router;
