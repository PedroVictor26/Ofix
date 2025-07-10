import prisma from '../config/database.js'; // Importa a instância do Prisma Client

class ServicosController {
  async createServico(req, res, next) {
    try {
      const {
        numeroOs, status, descricaoProblema, descricaoSolucao, dataEntrada,
        dataPrevisaoEntrega, dataConclusao, dataEntregaCliente, valorTotalEstimado,
        valorTotalServicos, valorTotalPecas, valorTotalFinal, kmEntrada, checklist,
        observacoes, clienteId, veiculoId, responsavelId
      } = req.body;

      const oficinaId = req.user?.oficinaId; // Descomentar quando auth estiver pronto
      // const oficinaId = "mock-oficina-id"; // Placeholder - REMOVER EM PRODUÇÃO

      if (!oficinaId) {
        return res.status(401).json({ error: 'Oficina não identificada. Acesso não autorizado.' });
      }

      if (!clienteId || !veiculoId || !numeroOs) {
        return res.status(400).json({ error: 'Campos obrigatórios (numeroOs, clienteId, veiculoId) faltando.' });
      }

      const clienteExists = await prisma.cliente.findUnique({ where: { id: clienteId, oficinaId } });
      if (!clienteExists) {
        return res.status(404).json({ error: 'Cliente não encontrado nesta oficina.' });
      }
      const veiculoExists = await prisma.veiculo.findUnique({ where: { id: veiculoId, clienteId } });
      if (!veiculoExists) {
        return res.status(404).json({ error: 'Veículo não encontrado ou não pertence ao cliente informado.' });
      }
      if (responsavelId) {
        const responsavelExists = await prisma.user.findUnique({ where: { id: responsavelId, oficinaId }});
        if (!responsavelExists) {
            return res.status(404).json({ error: 'Usuário responsável não encontrado nesta oficina.' });
        }
      }

      const novoServico = await prisma.servico.create({
        data: {
          numeroOs,
          status,
          descricaoProblema,
          descricaoSolucao,
          dataEntrada: dataEntrada ? new Date(dataEntrada) : new Date(),
          dataPrevisaoEntrega: dataPrevisaoEntrega ? new Date(dataPrevisaoEntrega) : undefined,
          dataConclusao: dataConclusao ? new Date(dataConclusao) : undefined,
          dataEntregaCliente: dataEntregaCliente ? new Date(dataEntregaCliente) : undefined,
          valorTotalEstimado,
          valorTotalServicos,
          valorTotalPecas,
          valorTotalFinal,
          kmEntrada,
          checklist,
          observacoes,
          cliente: { connect: { id: clienteId } },
          veiculo: { connect: { id: veiculoId } },
          ...(responsavelId && { responsavel: { connect: { id: responsavelId } } }),
          oficina: { connect: { id: oficinaId } },
        },
        select: {
            id: true,
            numeroOs: true,
            status: true,
            descricaoProblema: true,
            dataEntrada: true,
            kmEntrada: true,
            valorTotalEstimado: true,
            clienteId: true,
            veiculoId: true,
            responsavelId: true,
            oficinaId: true,
            cliente: { select: { id: true, nomeCompleto: true } },
            veiculo: { select: { id: true, placa: true, modelo: true } },
            responsavel: { select: { id: true, nome: true } },
        }
      });
      res.status(201).json(novoServico);
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('numeroOs')) {
        return res.status(409).json({ error: 'Número da Ordem de Serviço já existe.' });
      }
      if (error.code === 'P2025') {
        return res.status(400).json({ error: 'Erro ao conectar entidades relacionadas (ex: cliente, veículo, responsável ou oficina não encontrados).' });
      }
      next(error);
    }
  }

  async getAllServicos(req, res, next) {
    try {
      const oficinaId = req.user?.oficinaId; // Descomentar quando auth estiver pronto
      // const oficinaId = "mock-oficina-id"; // Placeholder - REMOVER EM PRODUÇÃO
      if (!oficinaId) {
        return res.status(401).json({ error: 'Oficina não identificada.' });
      }

      const { status, clienteId, veiculoId, dataDe, dataAte } = req.query;
      const whereConditions = { oficinaId };

      if (status) whereConditions.status = status;
      if (clienteId) whereConditions.clienteId = clienteId;
      if (veiculoId) whereConditions.veiculoId = veiculoId;
      if (dataDe) whereConditions.dataEntrada = { ...whereConditions.dataEntrada, gte: new Date(dataDe) };
      if (dataAte) whereConditions.dataEntrada = { ...whereConditions.dataEntrada, lte: new Date(dataAte) };

      const servicos = await prisma.servico.findMany({
        where: whereConditions,
        include: {
            cliente: { select: { id: true, nomeCompleto: true } },
            veiculo: { select: { id: true, placa: true, modelo: true } },
            responsavel: { select: { id: true, nome: true } },
        },
        orderBy: {
            dataEntrada: 'desc'
        }
      });
      res.json(servicos);
    } catch (error) {
      next(error);
    }
  }

  async getServicoById(req, res, next) {
    try {
      const { id } = req.params;
      const oficinaId = req.user?.oficinaId;
      if (!oficinaId) {
        return res.status(401).json({ error: 'Oficina não identificada.' });
      }

      const servico = await prisma.servico.findUnique({
        where: { id, oficinaId },
        include: {
          cliente: true,
          veiculo: true,
          responsavel: { select: { id: true, nome: true, email: true } },
          itensPeca: { include: { peca: true } },
          procedimentos: { include: { procedimentoPadrao: true } },
        },
      });

      if (!servico) {
        return res.status(404).json({ error: 'Serviço não encontrado.' });
      }
      res.json(servico);
    } catch (error) {
      next(error);
    }
  }

  async updateServico(req, res, next) {
    try {
      const { id } = req.params;
      const oficinaId = req.user?.oficinaId;
      if (!oficinaId) {
        return res.status(401).json({ error: 'Oficina não identificada.' });
      }

      const { clienteId, veiculoId, responsavelId, status, ...updateData } = req.body;

      const servicoExistente = await prisma.servico.findUnique({
        where: { id, oficinaId },
      });
      if (!servicoExistente) {
        return res.status(404).json({ error: 'Serviço não encontrado para atualização.' });
      }

      if (clienteId && clienteId !== servicoExistente.clienteId) {
        const clienteExists = await prisma.cliente.findUnique({ where: { id: clienteId, oficinaId } });
        if (!clienteExists) return res.status(404).json({ error: 'Novo cliente não encontrado.' });
        updateData.clienteId = clienteId;
      }
      if (veiculoId && veiculoId !== servicoExistente.veiculoId) {
        const veiculoExists = await prisma.veiculo.findUnique({ where: { id: veiculoId, ...(clienteId ? {clienteId} : {clienteId: servicoExistente.clienteId}) } });
        if (!veiculoExists) return res.status(404).json({ error: 'Novo veículo não encontrado ou não pertence ao cliente.' });
        updateData.veiculoId = veiculoId;
      }
      if (responsavelId && responsavelId !== servicoExistente.responsavelId) {
        const responsavelExists = await prisma.user.findUnique({ where: { id: responsavelId, oficinaId }});
        if (!responsavelExists) return res.status(44).json({ error: 'Novo responsável não encontrado.' });
        updateData.responsavelId = responsavelId;
      } else if (responsavelId === null) {
        updateData.responsavelId = null;
      }

      if (status) {
        const statusValidos = [
          'AGUARDANDO', 'EM_ANDAMENTO', 'AGUARDANDO_PECAS', 
          'AGUARDANDO_APROVACAO', 'FINALIZADO', 'CANCELADO'
        ];
        if (!statusValidos.includes(status)) {
          return res.status(400).json({ error: `Status inválido. Use um dos seguintes: ${statusValidos.join(', ')}` });
        }
        updateData.status = status;
      }

      if (updateData.dataEntrada) updateData.dataEntrada = new Date(updateData.dataEntrada);
      if (updateData.dataPrevisaoEntrega) updateData.dataPrevisaoEntrega = new Date(updateData.dataPrevisaoEntrega);
      if (updateData.dataConclusao) updateData.dataConclusao = new Date(updateData.dataConclusao);
      if (updateData.dataEntregaCliente) updateData.dataEntregaCliente = new Date(updateData.dataEntregaCliente);

      const servicoAtualizado = await prisma.servico.update({
        where: { id, oficinaId },
        data: updateData,
        include: {
            cliente: { select: { id: true, nomeCompleto: true } },
            veiculo: { select: { id: true, placa: true, modelo: true } },
            responsavel: { select: { id: true, nome: true } },
        }
      });
      res.json(servicoAtualizado);
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('numeroOs')) {
        return res.status(409).json({ error: 'Número da Ordem de Serviço já existe.' });
      }
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Erro ao atualizar: uma ou mais entidades relacionadas não foram encontradas.' });
      }
      next(error);
    }
  }

  async deleteServico(req, res, next) {
    try {
      const { id } = req.params;
      const oficinaId = req.user?.oficinaId;
      if (!oficinaId) {
        return res.status(401).json({ error: 'Oficina não identificada.' });
      }

      const servicoExistente = await prisma.servico.findUnique({
        where: { id, oficinaId },
      });
      if (!servicoExistente) {
        return res.status(404).json({ error: 'Serviço não encontrado para exclusão.' });
      }
      
      await prisma.servico.delete({
        where: { id, oficinaId },
      });
      res.status(204).send();
    } catch (error)
    {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Serviço não encontrado para exclusão.' });
      }
      if (error.code === 'P2003') {
         return res.status(409).json({ error: 'Não é possível excluir o serviço pois existem dados relacionados (ex: itens de serviço, procedimentos). Remova-os primeiro ou contate o suporte.' });
      }
      next(error);
    }
  }
}

export default new ServicosController();