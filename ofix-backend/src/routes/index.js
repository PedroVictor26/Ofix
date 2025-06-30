import { Router } from 'express';
import servicosRouter from './servicos.routes.js';
import authRouter from './auth.routes.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'API OFIX está no ar! Versão 1.0' });
});

// Rotas de Autenticação (públicas, exceto /profile que tem seu próprio protectRoute)
router.use('/auth', authRouter);

// Rotas de Serviços (serão protegidas pelo middleware em servicos.routes.js)
router.use('/servicos', servicosRouter);


// Adicione outras rotas principais aqui conforme necessário
// Ex: router.use('/clientes', protectRoute, clientesRouter);

export default router;
