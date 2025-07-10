import { Router } from 'express';
import servicosRouter from './servicos.routes.js';
import authRouter from './auth.routes.js';
import clientesRouter from './clientes.routes.js';
import procedimentosRouter from './procedimentos.routes.js';
import mensagensRouter from './mensagens.routes.js';
import pecasRouter from './pecas.routes.js';
import fornecedoresRouter from './fornecedores.routes.js';
import financeiroRouter from './financeiro.routes.js';
import veiculosRouter from './veiculos.routes.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'API OFIX está no ar! Versão 1.0' });
});

router.use('/auth', authRouter);
router.use('/servicos', servicosRouter);
router.use('/clientes', protectRoute, clientesRouter);
router.use('/procedimentos', protectRoute, procedimentosRouter);
router.use('/mensagens', protectRoute, mensagensRouter);
router.use('/pecas', protectRoute, pecasRouter);
router.use('/fornecedores', protectRoute, fornecedoresRouter);
router.use('/financeiro', protectRoute, financeiroRouter);
router.use('/veiculos', protectRoute, veiculosRouter);

export default router;