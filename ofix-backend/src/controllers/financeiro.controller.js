import prisma from '../config/database.js';

export const getAllTransacoes = async (req, res) => {
  const oficinaId = req.user?.oficinaId;

  if (!oficinaId) {
    return res.status(400).json({ error: 'Usuário não está associado a uma oficina.' });
  }

  try {
    console.log('Verificando prisma.financeiro:', prisma.financeiro); // Adicionado para depuração
    const transacoes = await prisma.financeiro.findMany({
      where: { oficinaId },
    });

    // Converter Decimal para Number para serialização JSON segura
    const transacoesFormatadas = transacoes.map(t => ({
      ...t,
      valor: t.valor.toNumber(),
    }));

    res.json(transacoesFormatadas);
  } catch (error) {
    console.error("Erro ao buscar transações financeiras:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const getFaturamentoHoje = async (req, res) => {
  const oficinaId = req.user?.oficinaId;

  if (!oficinaId) {
    return res.status(400).json({ error: 'Usuário não está associado a uma oficina.' });
  }

  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    const resultado = await prisma.financeiro.aggregate({
      _sum: {
        valor: true,
      },
      where: {
        oficinaId,
        tipo: 'Entrada',
        data: {
          gte: hoje,
          lt: amanha,
        },
      },
    });

    const faturamentoHoje = resultado._sum.valor?.toNumber() || 0;

    res.json({ faturamentoHoje });
  } catch (error) {
    console.error("Erro ao buscar faturamento de hoje:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const getTransacaoById = async (req, res) => {
  const { id } = req.params;
  const oficinaId = req.user?.oficinaId;

  if (!oficinaId) {
    return res.status(400).json({ error: 'Usuário não está associado a uma oficina.' });
  }

  try {
    const transacao = await prisma.financeiro.findFirst({
      where: { id, oficinaId },
    });
    if (!transacao) {
      return res.status(404).json({ error: "Transação não encontrada." });
    }
    res.json(transacao);
  } catch (error) {
    console.error("Erro ao buscar transação por ID:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const createTransacao = async (req, res) => {
  const { descricao, valor, tipo, categoria, data, servicoId } = req.body;
  const oficinaId = req.user?.oficinaId; // Extrai o oficinaId

  if (!oficinaId) {
    return res.status(400).json({ error: 'Usuário não está associado a uma oficina.' });
  }

  try {
    const newTransacao = await prisma.financeiro.create({
      data: {
        descricao,
        valor,
        tipo,
        categoria,
        data: new Date(data),
        servicoId,
        oficina: { connect: { id: oficinaId } }, // Associa à oficina
      },
    });
    res.status(201).json(newTransacao);
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const updateTransacao = async (req, res) => {
  const { id } = req.params;
  const { descricao, valor, tipo, categoria, data, servicoId } = req.body;
  const oficinaId = req.user?.oficinaId;

  if (!oficinaId) {
    return res.status(400).json({ error: 'Usuário não está associado a uma oficina.' });
  }

  try {
    // Primeiro, verifique se a transação pertence à oficina do usuário
    const transacaoExistente = await prisma.financeiro.findFirst({
      where: { id, oficinaId },
    });

    if (!transacaoExistente) {
      return res.status(404).json({ error: "Transação não encontrada ou não pertence à sua oficina." });
    }

    const updatedTransacao = await prisma.financeiro.update({
      where: { id }, // A atualização ainda usa apenas o ID
      data: {
        descricao,
        valor,
        tipo,
        categoria,
        data: new Date(data),
        servicoId,
      },
    });
    res.json(updatedTransacao);
  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const deleteTransacao = async (req, res) => {
  const { id } = req.params;
  const oficinaId = req.user?.oficinaId;

  if (!oficinaId) {
    return res.status(400).json({ error: 'Usuário não está associado a uma oficina.' });
  }

  try {
    // Primeiro, verifique se a transação pertence à oficina do usuário
    const transacaoExistente = await prisma.financeiro.findFirst({
      where: { id, oficinaId },
    });

    if (!transacaoExistente) {
      return res.status(404).json({ error: "Transação não encontrada ou não pertence à sua oficina." });
    }

    await prisma.financeiro.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar transação:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};