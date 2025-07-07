import prisma from '../config/database.js';

export const getAllProcedimentos = async (req, res) => {
  try {
    const procedimentos = await prisma.procedimentoPadrao.findMany();
    const parsedProcedimentos = procedimentos.map(p => ({
      ...p,
      checklist: p.checklistJson ? JSON.parse(p.checklistJson) : [],
    }));
    res.json(parsedProcedimentos);
  } catch (error) {
    console.error("Erro ao buscar procedimentos:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const getProcedimentoById = async (req, res) => {
  const { id } = req.params;
  try {
    const procedimento = await prisma.procedimentoPadrao.findUnique({
      where: { id },
    });
    if (!procedimento) {
      return res.status(404).json({ error: "Procedimento não encontrado." });
    }
    const parsedProcedimento = {
      ...procedimento,
      checklist: procedimento.checklistJson ? JSON.parse(procedimento.checklistJson) : [],
    };
    res.json(parsedProcedimento);
  } catch (error) {
    console.error("Erro ao buscar procedimento por ID:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const createProcedimento = async (req, res) => {
  const { nome, descricao, tempo_estimado, checklist, categoria } = req.body; // Recebe 'checklist' como array
  const oficinaId = req.user?.oficinaId; // Obter oficinaId do usuário autenticado

  if (!oficinaId) {
    return res.status(400).json({ error: 'Usuário não está associado a uma oficina.' });
  }

  try {
    const newProcedimento = await prisma.procedimentoPadrao.create({
      data: {
        nome,
        descricao,
        tempo_estimado,
        checklistJson: JSON.stringify(checklist), // Converte o array para string JSON
        categoria,
        oficina: {
          connect: { id: oficinaId }, // Conectar ao ID da oficina
        },
      },
    });
    res.status(201).json(newProcedimento);
  } catch (error) {
    console.error("Erro ao criar procedimento:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const updateProcedimento = async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, tempo_estimado, checklist, categoria } = req.body; // Recebe 'checklist' como array
  const oficinaId = req.user?.oficinaId; // Obter oficinaId do usuário autenticado

  if (!oficinaId) {
    return res.status(400).json({ error: 'Usuário não está associado a uma oficina.' });
  }

  try {
    const updatedProcedimento = await prisma.procedimentoPadrao.update({
      where: { id },
      data: {
        nome,
        descricao,
        tempo_estimado,
        checklistJson: JSON.stringify(checklist), // Converte o array para string JSON
        categoria,
      },
    });
    res.json(updatedProcedimento);
  } catch (error) {
    console.error("Erro ao atualizar procedimento:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const deleteProcedimento = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.procedimentoPadrao.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar procedimento:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};