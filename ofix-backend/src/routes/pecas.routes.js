import { Router } from 'express';
import * as pecasController from '../controllers/pecas.controller.js';

const router = Router();

router.post('/', pecasController.createPeca);
router.get('/', pecasController.getAllPecas);
router.get('/:id', pecasController.getPecaById);
router.put('/:id', pecasController.updatePeca);
router.delete('/:id', pecasController.deletePeca);

export default router;