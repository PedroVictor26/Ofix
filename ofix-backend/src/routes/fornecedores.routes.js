import { Router } from 'express';
import fornecedoresController from '../controllers/fornecedores.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(protectRoute);

router.post('/', fornecedoresController.createFornecedor);
router.get('/', fornecedoresController.getAllFornecedores);
router.get('/:id', fornecedoresController.getFornecedorById);
router.put('/:id', fornecedoresController.updateFornecedor);
router.delete('/:id', fornecedoresController.deleteFornecedor);

export default router;
