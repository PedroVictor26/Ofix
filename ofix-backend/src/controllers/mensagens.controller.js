import prisma from '../config/database.js';

export const getAllMensagens = async (req, res) => {
  try {
    const mensagens = await prisma.mensagemPadrao.findMany();
    res.json(mensagens);
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const getMensagemById = async (req, res) => {
  const { id } = req.params;
  try {
    const mensagem = await prisma.mensagemPadrao.findUnique({
      where: { id },
    });
    if (!mensagem) {
      return res.status(404).json({ error: "Mensagem não encontrada." });
    }
    res.json(mensagem);
  } catch (error) {
    console.error("Erro ao buscar mensagem por ID:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const createMensagem = async (req, res) => {
  const { nome, template } = req.body;
  try {
    const newMensagem = await prisma.mensagemPadrao.create({
      data: {
        nome,
        template,
      },
    });
    res.status(201).json(newMensagem);
  } catch (error) {
    console.error("Erro ao criar mensagem:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const updateMensagem = async (req, res) => {
  const { id } = req.params;
  const { nome, template } = req.body;
  try {
    const updatedMensagem = await prisma.mensagemPadrao.update({
      where: { id },
      data: {
        nome,
        template,
      },
    });
    res.json(updatedMensagem);
  } catch (error) {
    console.error("Erro ao atualizar mensagem:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const deleteMensagem = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.mensagemPadrao.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar mensagem:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};