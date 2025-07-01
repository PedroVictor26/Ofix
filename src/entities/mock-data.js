// src/entities/mock-data.js

// Dados Falsos
const mockClientes = [
  { id: 1, nome: "João Silva Santos", telefone: "11999991234" },
  { id: 2, nome: "Maria Oliveira", telefone: "21988885678" },
];

const mockVeiculos = [
  {
    id: 1,
    cliente_id: 1,
    marca: "Toyota",
    modelo: "Corolla",
    placa: "ABC-1234",
  },
  { id: 2, cliente_id: 2, marca: "Honda", modelo: "Civic", placa: "XYZ-5678" },
];

const mockServicos = [
  {
    id: "OS001",
    cliente_id: 1,
    veiculo_id: 1,
    status: "aguardando_pecas",
    problema: "Troca das Carlotas",
    progresso: 1,
    total_passos: 6,
    data_entrada: "25/06/2025",
  },
  {
    id: "OS002",
    cliente_id: 2,
    veiculo_id: 2,
    status: "em_andamento",
    problema: "Revisão completa de freios",
    progresso: 3,
    total_passos: 5,
    data_entrada: "26/06/2025",
  },
  {
    id: "OS003",
    cliente_id: 1,
    veiculo_id: 1,
    status: "aguardando",
    problema: "Alinhamento e Balanceamento",
    progresso: 0,
    total_passos: 4,
    data_entrada: "27/06/2025",
  },
];

const mockProcedimentos = [
  {
    id: 1,
    nome: "Troca de Óleo e Filtro",
    categoria: "manutencao preventiva",
    tempo_estimado: 1,
    descricao: "Procedimento padrão...",
    checklist: ["Drenar óleo", "Remover filtro"],
  },
  {
    id: 2,
    nome: "Revisão Completa de Freios",
    categoria: "freios",
    tempo_estimado: 2,
    descricao: "Inspeção e manutenção...",
    checklist: ["Verificar pastilhas", "Inspecionar discos"],
  },
];

const mockMensagens = [
  {
    id: 1,
    nome: "Atualização de Status - Serviço Iniciado",
    texto:
      "Olá {cliente}! Seu veículo {modelo} (placa {placa}) já está em nossos cuidados.",
  },
  {
    id: 2,
    nome: "Aviso - Orçamento Pronto",
    texto:
      "Olá {cliente}! O orçamento para o seu {modelo} está pronto para aprovação.",
  },
];

const mockFornecedores = [
  { id: 1, nome: "AutoPeças Brasil" },
  { id: 2, nome: "Distribuidora Freios Master" },
];

const mockPecas = [
  {
    id: 1,
    nome: "Filtro de Óleo Fram PH6017A",
    sku: "FR-PH6017A",
    fabricante: "Fram",
    fornecedor_id: 1,
    preco_custo: 15.5,
    preco_venda: 35.0,
    quantidade: 12,
    estoque_minimo: 5,
  },
  {
    id: 2,
    nome: "Pastilha de Freio Cobreq N-523",
    sku: "CB-N523",
    fabricante: "Cobreq",
    fornecedor_id: 2,
    preco_custo: 45.0,
    preco_venda: 95.0,
    quantidade: 4,
    estoque_minimo: 4,
  },
  {
    id: 3,
    nome: "Vela de Ignição NGK BKR6E",
    sku: "NGK-BKR6E",
    fabricante: "NGK",
    fornecedor_id: 1,
    preco_custo: 12.0,
    preco_venda: 28.0,
    quantidade: 20,
    estoque_minimo: 10,
  },
];

const mockFinanceiro = [
  {
    id: 1,
    descricao: "Pagamento do serviço OS001",
    valor: 250.0,
    tipo: "Entrada",
    categoria: "servico",
    data: "28/06/2025",
    servico_id: "OS001",
  },
  {
    id: 2,
    descricao: "Compra de filtro de ar",
    valor: 45.0,
    tipo: "Saída",
    categoria: "peca",
    data: "27/06/2025",
    servico_id: null,
  },
  {
    id: 3,
    descricao: "Pagamento adiantado OS002",
    valor: 150.0,
    tipo: "Entrada",
    categoria: "servico",
    data: "26/06/2025",
    servico_id: "OS002",
  },
];

const mockItemServico = [
  { id: 1, servico_id: "OS001", peca_id: 1, quantidade: 2 },
  { id: 2, servico_id: "OS002", peca_id: 2, quantidade: 1 },
];

// Funções Falsas que Simulam a API

export const Servico = {
  list: () => Promise.resolve(mockServicos),
};

export const Veiculo = {
  list: () => Promise.resolve(mockVeiculos),
};

export const ProcedimentoPadrao = {
  list: () => Promise.resolve(mockProcedimentos),
};

export const MensagemPadrao = {
  list: () => Promise.resolve(mockMensagens),
};

export const Peca = {
  list: () => Promise.resolve(mockPecas),
};

export const Fornecedor = {
  list: () => Promise.resolve(mockFornecedores),
};

export const Financeiro = {
  list: () => Promise.resolve(mockFinanceiro),
};

export const ItemServico = {
  list: () => Promise.resolve(mockItemServico),
};

// =================== CORREÇÃO APLICADA AQUI ===================
// As funções 'list', 'create' e 'update' foram unidas em um único objeto.
export const Cliente = {
  list: () => Promise.resolve(mockClientes),

  create: async (clienteData) => {
    // Simula a criação de um novo cliente
    const novoCliente = {
      id: Date.now(), // ID temporário para o mock
      ...clienteData,
      created_at: new Date().toISOString(),
    };

    mockClientes.push(novoCliente); // Adiciona o novo cliente à lista de mocks
    console.log("Mock: Cliente criado com sucesso!", novoCliente);
    return novoCliente;
  },

  update: async (id, clienteData) => {
    // Simula a atualização de um cliente
    const index = mockClientes.findIndex(c => c.id === id);
    if (index !== -1) {
      mockClientes[index] = { ...mockClientes[index], ...clienteData };
    }
    console.log("Mock: Cliente atualizado com sucesso!", id, clienteData);
    return { id, ...clienteData };
  },
};