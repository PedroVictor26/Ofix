import prisma from "../config/database.js";

export const getAllProcedimentos = async (req, res) => {
  try {
    const procedimentos = await prisma.procedimentoPadrao.findMany();
    const parsedProcedimentos = procedimentos.map((p) => ({
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
      checklist: procedimento.checklistJson
        ? JSON.parse(procedimento.checklistJson)
        : [],
    };
    res.json(parsedProcedimento);
  } catch (error) {
    console.error("Erro ao buscar procedimento por ID:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const createProcedimento = async (req, res) => {
  // Nota: O frontend envia 'tempoEstimadoHoras', mas aqui ainda está como 'tempo_estimado'
  // Vamos corrigir isso também para manter a consistência.
  const { nome, descricao, tempoEstimadoHoras, checklist } = req.body;
  const oficinaId = req.user?.oficinaId;

  if (!oficinaId) {
    return res
      .status(400)
      .json({ error: "Usuário não está associado a uma oficina." });
  }

  try {
    const dataToCreate = {
      nome,
      descricao,
      tempoEstimadoHoras: parseFloat(tempoEstimadoHoras) || 0, // Garante que é um número
      checklistJson: JSON.stringify(checklist || []), // Garante que é um array e converte
      oficina: {
        connect: { id: oficinaId },
      },
    };

    const newProcedimento = await prisma.procedimentoPadrao.create({
      data: dataToCreate,
    });
    res.status(201).json(newProcedimento);
  } catch (error) {
    console.error("Erro ao criar procedimento:", error);
    res.status(500).json({
      error: "Erro interno do servidor ao criar procedimento.",
      details: error.message,
    });
  }
};

export const updateProcedimento = async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, tempoEstimadoHoras, checklist } = req.body;
  const oficinaId = req.user?.oficinaId;

  if (!oficinaId) {
    return res
      .status(400)
      .json({ error: "Usuário não está associado a uma oficina." });
  }

  try {
    const dataToUpdate = {
      nome,
      descricao,
      tempoEstimadoHoras: parseFloat(tempoEstimadoHoras) || 0, // Garante que é um número
      checklistJson: JSON.stringify(checklist || []), // Garante que é um array e converte
    };

    // Opcional: Verificar se o procedimento pertence à oficina do usuário antes de atualizar
    const procedimentoExistente = await prisma.procedimentoPadrao.findFirst({
      where: {
        id,
        oficinaId,
      },
    });

    if (!procedimentoExistente) {
      return res.status(404).json({
        error: "Procedimento não encontrado ou não pertence a esta oficina.",
      });
    }

    const updatedProcedimento = await prisma.procedimentoPadrao.update({
      where: { id },
      data: dataToUpdate,
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
    // Opcional: Adicionar verificação se o procedimento pertence à oficina do usuário
    await prisma.procedimentoPadrao.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar procedimento:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};
