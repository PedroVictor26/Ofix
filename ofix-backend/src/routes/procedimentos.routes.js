import { Router } from 'express';
import * as procedimentosController from '../controllers/procedimentos.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(protectRoute);

router.post('/', procedimentosController.createProcedimento);
router.get('/', procedimentosController.getAllProcedimentos);
router.get('/:id', procedimentosController.getProcedimentoById);
router.put('/:id', procedimentosController.updateProcedimento);
router.delete('/:id', procedimentosController.deleteProcedimento);

export default router;
