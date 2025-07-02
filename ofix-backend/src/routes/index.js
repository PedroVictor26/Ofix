import { Router } from 'express';
import servicosRouter from './servicos.routes.js';
import authRouter from './auth.routes.js';
import clientesRouter from './clientes.routes.js'; // Importa o novo roteador de clientes
import { protectRoute } from '../middlewares/auth.middleware.js'; // Importa o middleware de proteção

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'API OFIX está no ar! Versão 1.0' });
});

// Rotas de Autenticação (públicas, exceto /profile que tem seu próprio protectRoute)
router.use('/auth', authRouter);

// Rotas de Serviços (protegidas dentro de servicos.routes.js ou aqui, se necessário)
router.use('/servicos', servicosRouter);

// Rotas de Clientes (protegidas pelo middleware protectRoute)
// O middleware protectRoute já está aplicado dentro de clientes.routes.js
router.use('/clientes', clientesRouter);


// Adicione outras rotas principais aqui conforme necessário

export default router;
