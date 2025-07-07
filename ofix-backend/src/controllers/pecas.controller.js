import prisma from '../config/database.js';

export const getAllPecas = async (req, res) => {
  try {
    const pecas = await prisma.peca.findMany();
    res.json(pecas);
  } catch (error) {
    console.error("Erro ao buscar peças:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const getPecaById = async (req, res) => {
  const { id } = req.params;
  try {
    const peca = await prisma.peca.findUnique({
      where: { id },
    });
    if (!peca) {
      return res.status(404).json({ error: "Peça não encontrada." });
    }
    res.json(peca);
  } catch (error) {
    console.error("Erro ao buscar peça por ID:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const createPeca = async (req, res) => {
  const { 
    nome, 
    sku, 
    fabricante, 
    fornecedorId, 
    precoCusto, 
    precoVenda, 
    quantidade, 
    estoqueMinimo 
  } = req.body;
  const oficinaId = req.user?.oficinaId;

  if (!nome || !sku) {
    return res.status(400).json({ error: 'Nome e SKU são obrigatórios.' });
  }

  if (!oficinaId) {
    return res.status(400).json({ error: 'Usuário não está associado a uma oficina.' });
  }

  try {
    const newPeca = await prisma.peca.create({
      data: {
        nome,
        codigoFabricante: sku, // Mapeando sku para o campo correto
        fabricante,
        precoCusto: parseFloat(precoCusto) || 0,
        precoVenda: parseFloat(precoVenda) || 0,
        estoqueAtual: parseInt(quantidade) || 0,
        estoqueMinimo: parseInt(estoqueMinimo) || 0,
        oficina: {
          connect: { id: oficinaId },
        },
        ...(fornecedorId && { fornecedor: { connect: { id: fornecedorId } } }),
      },
    });
    res.status(201).json(newPeca);
  } catch (error) {
    console.error("Erro ao criar peça:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const updatePeca = async (req, res) => {
  const { id } = req.params;
  const {
    nome,
    sku,
    fabricante,
    fornecedorId,
    precoCusto,
    precoVenda,
    quantidade,
    estoqueMinimo
  } = req.body;

  try {
    const updatedPeca = await prisma.peca.update({
      where: { id },
      data: {
        nome,
        codigoFabricante: sku,
        fabricante,
        precoCusto: parseFloat(precoCusto) || 0,
        precoVenda: parseFloat(precoVenda) || 0,
        estoqueAtual: parseInt(quantidade) || 0,
        estoqueMinimo: parseInt(estoqueMinimo) || 0,
        ...(fornecedorId ? { fornecedor: { connect: { id: fornecedorId } } } : { fornecedor: { disconnect: true } }),
      },
    });
    res.json(updatedPeca);
  } catch (error) {
    console.error("Erro ao atualizar peça:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const deletePeca = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.peca.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar peça:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};