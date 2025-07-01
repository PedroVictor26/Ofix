import { Router } from 'express';
import prisma from '../config/database.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = Router();

// Middleware para proteger todas as rotas de clientes
router.use(protectRoute);

// Rota para criar um novo cliente
// POST /api/clientes
router.post('/', async (req, res) => {
  const { nome_completo, cpf_cnpj, telefone, email, endereco, observacoes } = req.body;
  const { oficinaId } = req.user; // Obtido do token JWT pelo middleware protectRoute

  if (!nome_completo || !telefone) {
    return res.status(400).json({ error: 'Nome completo e telefone são obrigatórios.' });
  }

  if (!oficinaId) {
    return res.status(400).json({ error: 'ID da oficina não encontrado no token do usuário. Não é possível criar o cliente.' });
  }

  try {
    const novoCliente = await prisma.cliente.create({
      data: {
        nomeCompleto: nome_completo,
        cpfCnpj: cpf_cnpj,
        telefone: telefone,
        email: email,
        endereco: endereco,
        observacoes: observacoes,
        oficina: {
          connect: { id: oficinaId },
        },
      },
    });
    res.status(201).json(novoCliente);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(409).json({ error: 'Este email já está cadastrado.' });
    }
    if (error.code === 'P2002' && error.meta?.target?.includes('cpfCnpj')) {
      return res.status(409).json({ error: 'Este CPF/CNPJ já está cadastrado.' });
    }
    res.status(500).json({ error: 'Erro interno ao criar cliente.' });
  }
});

export default router;
