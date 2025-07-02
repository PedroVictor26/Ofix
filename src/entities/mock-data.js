// src/entities/mock-data.js

const mockClientes = [
    { id: 1, nome: "João da Silva", email: "joao.silva@example.com", telefone: "11999998888", endereco: "Rua das Flores, 123" },
    { id: 2, nome: "Maria Oliveira", email: "maria.oliveira@example.com", telefone: "21987654321", endereco: "Avenida Principal, 456" },
];

const mockVeiculos = [
    { id: 1, cliente_id: 1, modelo: "Toyota Corolla", placa: "ABC1234", ano: 2022, cor: "Preto" },
    { id: 2, cliente_id: 2, modelo: "Honda Civic", placa: "XYZ5678", ano: 2023, cor: "Branco" },
];

// Dados Falsos
const mockServicos = [
    { id: 'OS001', cliente_id: 1, veiculo_id: 1, status: 'aguardando_pecas', problema: 'Troca das Carlotas', progresso: 1, total_passos: 6, data_entrada: '25/06/2025' },
    { id: 'OS002', cliente_id: 2, veiculo_id: 2, status: 'em_andamento', problema: 'Revisão completa de freios', progresso: 3, total_passos: 5, data_entrada: '26/06/2025' },
    { id: 'OS003', cliente_id: 1, veiculo_id: 1, status: 'aguardando', problema: 'Alinhamento e Balanceamento', progresso: 0, total_passos: 4, data_entrada: '27/06/2025' },
];

const mockProcedimentos = [
    { id: 1, nome: "Troca de Óleo e Filtro", categoria: "manutencao preventiva", tempo_estimado: 1, descricao: "Procedimento padrão...", checklist: ["Drenar óleo", "Remover filtro"] },
    { id: 2, nome: "Revisão Completa de Freios", categoria: "freios", tempo_estimado: 2, descricao: "Inspeção e manutenção...", checklist: ["Verificar pastilhas", "Inspecionar discos"] },
];

const mockMensagens = [
    { id: 1, nome: "Atualização de Status - Serviço Iniciado", texto: "Olá {cliente}! Seu veículo {modelo} (placa {placa}) já está em nossos cuidados." },
    { id: 2, nome: "Aviso - Orçamento Pronto", texto: "Olá {cliente}! O orçamento para o seu {modelo} está pronto para aprovação." },
];

const mockFornecedores = [
    { id: 1, nome: "AutoPeças Brasil" },
    { id: 2, nome: "Distribuidora Freios Master" },
];

const mockPecas = [
    { id: 1, nome: "Filtro de Óleo Fram PH6017A", sku: "FR-PH6017A", fabricante: "Fram", fornecedor_id: 1, preco_custo: 15.50, preco_venda: 35.00, quantidade: 12, estoque_minimo: 5 },
    { id: 2, nome: "Pastilha de Freio Cobreq N-523", sku: "CB-N523", fabricante: "Cobreq", fornecedor_id: 2, preco_custo: 45.00, preco_venda: 95.00, quantidade: 4, estoque_minimo: 4 },
    { id: 3, nome: "Vela de Ignição NGK BKR6E", sku: "NGK-BKR6E", fabricante: "NGK", fornecedor_id: 1, preco_custo: 12.00, preco_venda: 28.00, quantidade: 20, estoque_minimo: 10 },
];

const mockFinanceiro = [
    { id: 1, descricao: "Pagamento do serviço OS001", valor: 250.00, tipo: "Entrada", categoria: "servico", data: "28/06/2025", servico_id: "OS001" },
    { id: 2, descricao: "Compra de filtro de ar", valor: 45.00, tipo: "Saída", categoria: "peca", data: "27/06/2025", servico_id: null },
    { id: 3, descricao: "Pagamento adiantado OS002", valor: 150.00, tipo: "Entrada", categoria: "servico", data: "26/06/2025", servico_id: "OS002" },
];

const mockItemServico = [
    { id: 1, servico_id: "OS001", peca_id: 1, quantidade: 2 },
    { id: 2, servico_id: "OS002", peca_id: 2, quantidade: 1 },
];
// Funções Falsas que Simulam a API
export const Cliente = {
    list: () => Promise.resolve(mockClientes),
};

export const Veiculo = {
    list: () => Promise.resolve(mockVeiculos),
};

export const Servico = {
    list: () => Promise.resolve(mockServicos),
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
