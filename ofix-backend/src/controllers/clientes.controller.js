import prisma from '../config/database.js';

class ClientesController {
  async createCliente(req, res, next) {
    try {
      const { nomeCompleto, cpfCnpj, telefone, email, endereco } = req.body;
      const oficinaId = req.user?.oficinaId;

      if (!oficinaId) {
        return res.status(401).json({ error: 'Oficina não identificada. Acesso não autorizado.' });
      }

      if (!nomeCompleto || !telefone) {
        return res.status(400).json({ error: 'Nome completo e telefone são obrigatórios.' });
      }

      const novoCliente = await prisma.cliente.create({
        data: {
          nomeCompleto,
          cpfCnpj,
          telefone,
          email,
          endereco,
          oficina: { connect: { id: oficinaId } },
        },
      });
      res.status(201).json(novoCliente);
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('cpfCnpj')) {
        return res.status(409).json({ error: 'CPF/CNPJ já cadastrado.' });
      }
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return res.status(409).json({ error: 'Email já cadastrado.' });
      }
      next(error);
    }
  }

  async getAllClientes(req, res, next) {
    try {
      const oficinaId = req.user?.oficinaId;
      if (!oficinaId) {
        return res.status(401).json({ error: 'Oficina não identificada.' });
      }

      const clientes = await prisma.cliente.findMany({
        where: { oficinaId },
        include: { veiculos: true }, // Inclui os veículos relacionados
        orderBy: { nomeCompleto: 'asc' },
      });
      res.json(clientes);
    } catch (error) {
      next(error);
    }
  }

  async getClienteById(req, res, next) {
    try {
      const { id } = req.params;
      const oficinaId = req.user?.oficinaId;

      if (!oficinaId) {
        return res.status(401).json({ error: 'Oficina não identificada.' });
      }

      const cliente = await prisma.cliente.findUnique({
        where: { id, oficinaId },
      });

      if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado.' });
      }
      res.json(cliente);
    } catch (error) {
      next(error);
    }
  }

  async updateCliente(req, res, next) {
    try {
      const { id } = req.params;
      const oficinaId = req.user?.oficinaId;

      if (!oficinaId) {
        return res.status(401).json({ error: 'Oficina não identificada.' });
      }

      const clienteExistente = await prisma.cliente.findUnique({
        where: { id, oficinaId },
      });

      if (!clienteExistente) {
        return res.status(404).json({ error: 'Cliente não encontrado para atualização.' });
      }

      const clienteAtualizado = await prisma.cliente.update({
        where: { id, oficinaId },
        data: req.body,
      });
      res.json(clienteAtualizado);
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('cpfCnpj')) {
        return res.status(409).json({ error: 'CPF/CNPJ já cadastrado.' });
      }
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return res.status(409).json({ error: 'Email já cadastrado.' });
      }
      next(error);
    }
  }

  async deleteCliente(req, res, next) {
    try {
      const { id } = req.params;
      const oficinaId = req.user?.oficinaId;

      if (!oficinaId) {
        return res.status(401).json({ error: 'Oficina não identificada.' });
      }

      const clienteExistente = await prisma.cliente.findUnique({
        where: { id, oficinaId },
      });

      if (!clienteExistente) {
        return res.status(404).json({ error: 'Cliente não encontrado para exclusão.' });
      }

      await prisma.cliente.delete({
        where: { id, oficinaId },
      });
      res.status(204).send();
    } catch (error) {
      if (error.code === 'P2003') { // Foreign key constraint failed
        return res.status(409).json({ error: 'Não é possível excluir o cliente pois existem veículos ou serviços associados.' });
      }
      next(error);
    }
  }

  async createVeiculo(req, res, next) {
    try {
      const { clienteId } = req.params;
      const { placa, marca, modelo, anoFabricacao, anoModelo, cor, chassi, kmAtual } = req.body;
      const oficinaId = req.user?.oficinaId;

      if (!oficinaId) {
        return res.status(401).json({ error: 'Oficina não identificada. Acesso não autorizado.' });
      }

      if (!placa || !marca || !modelo || !clienteId) {
        return res.status(400).json({ error: 'Placa, marca, modelo e ID do cliente são obrigatórios.' });
      }

      const clienteExists = await prisma.cliente.findUnique({
        where: { id: clienteId, oficinaId },
      });

      if (!clienteExists) {
        return res.status(404).json({ error: 'Cliente não encontrado.' });
      }

      const novoVeiculo = await prisma.veiculo.create({
        data: {
          placa,
          marca,
          modelo,
          anoFabricacao,
          anoModelo,
          cor,
          chassi,
          kmAtual,
          cliente: { connect: { id: clienteId } },
          oficina: { connect: { id: oficinaId } },
        },
      });
      res.status(201).json(novoVeiculo);
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('placa')) {
        return res.status(409).json({ error: 'Placa já cadastrada.' });
      }
      if (error.code === 'P2002' && error.meta?.target?.includes('chassi')) {
        return res.status(409).json({ error: 'Chassi já cadastrado.' });
      }
      next(error);
    }
  }
}

export default new ClientesController();
