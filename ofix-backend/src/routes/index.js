import { Router } from 'express';
import servicosRouter from './servicos.routes.js';
import authRouter from './auth.routes.js';
<<<<<<< Updated upstream
import clientesRouter from './clientes.routes.js'; // Importa o novo roteador de clientes
import { protectRoute } from '../middlewares/auth.middleware.js'; // Importa o middleware de proteção
=======
import clientesRouter from './clientes.routes.js';
import procedimentosRouter from './procedimentos.routes.js';
import mensagensRouter from './mensagens.routes.js';
import pecasRouter from './pecas.routes.js';
import fornecedoresRouter from './fornecedores.routes.js';
import financeiroRouter from './financeiro.routes.js';
import veiculosRouter from './veiculos.routes.js';
import { protectRoute } from '../middlewares/auth.middleware.js';
>>>>>>> Stashed changes

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'API OFIX está no ar! Versão 1.0' });
});

router.use('/auth', authRouter);
<<<<<<< Updated upstream

// Rotas de Serviços (protegidas dentro de servicos.routes.js ou aqui, se necessário)
router.use('/servicos', servicosRouter);

// Rotas de Clientes (protegidas pelo middleware protectRoute)
// O middleware protectRoute já está aplicado dentro de clientes.routes.js
router.use('/clientes', clientesRouter);
=======
router.use('/servicos', servicosRouter);
router.use('/clientes', protectRoute, clientesRouter);
router.use('/procedimentos', protectRoute, procedimentosRouter);
router.use('/mensagens', protectRoute, mensagensRouter);
router.use('/pecas', protectRoute, pecasRouter);
router.use('/fornecedores', protectRoute, fornecedoresRouter);
router.use('/financeiro', protectRoute, financeiroRouter);
router.use('/veiculos', protectRoute, veiculosRouter);
>>>>>>> Stashed changes

export default router;
