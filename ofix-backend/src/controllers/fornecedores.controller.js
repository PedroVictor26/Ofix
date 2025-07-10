import prisma from '../config/database.js';

class FornecedoresController {
  async createFornecedor(req, res, next) {
    try {
      // Lógica para criar fornecedor
      res.status(201).json({ message: "Rota POST /fornecedores funcionando!" });
    } catch (error) {
      next(error);
    }
  }

  async getAllFornecedores(req, res, next) {
    try {
      // Lógica para listar fornecedores
      res.json([]);
    } catch (error) {
      next(error);
    }
  }

  async getFornecedorById(req, res, next) {
    try {
      // Lógica para buscar fornecedor por ID
      res.json({});
    } catch (error) {
      next(error);
    }
  }

  async updateFornecedor(req, res, next) {
    try {
      // Lógica para atualizar fornecedor
      res.json({});
    } catch (error) {
      next(error);
    }
  }

  async deleteFornecedor(req, res, next) {
    try {
      // Lógica para deletar fornecedor
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new FornecedoresController();
