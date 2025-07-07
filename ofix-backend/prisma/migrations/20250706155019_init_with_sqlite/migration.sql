-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "oficinaId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_oficinaId_fkey" FOREIGN KEY ("oficinaId") REFERENCES "Oficina" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Oficina" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT,
    "telefone" TEXT,
    "endereco" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nomeCompleto" TEXT NOT NULL,
    "cpfCnpj" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "endereco" TEXT,
    "observacoes" TEXT,
    "oficinaId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Cliente_oficinaId_fkey" FOREIGN KEY ("oficinaId") REFERENCES "Oficina" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Veiculo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "placa" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "anoFabricacao" INTEGER,
    "anoModelo" INTEGER,
    "cor" TEXT,
    "chassi" TEXT,
    "kmAtual" INTEGER,
    "clienteId" TEXT NOT NULL,
    "oficinaId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Veiculo_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Veiculo_oficinaId_fkey" FOREIGN KEY ("oficinaId") REFERENCES "Oficina" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Servico" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numeroOs" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AGUARDANDO',
    "descricaoProblema" TEXT,
    "descricaoSolucao" TEXT,
    "dataEntrada" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataPrevisaoEntrega" DATETIME,
    "dataConclusao" DATETIME,
    "dataEntregaCliente" DATETIME,
    "valorTotalEstimado" DECIMAL,
    "valorTotalServicos" DECIMAL,
    "valorTotalPecas" DECIMAL,
    "valorTotalFinal" DECIMAL,
    "kmEntrada" INTEGER,
    "checklist" TEXT,
    "observacoes" TEXT,
    "clienteId" TEXT NOT NULL,
    "veiculoId" TEXT NOT NULL,
    "responsavelId" TEXT,
    "oficinaId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Servico_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Servico_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Servico_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Servico_oficinaId_fkey" FOREIGN KEY ("oficinaId") REFERENCES "Oficina" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Peca" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codigoInterno" TEXT,
    "codigoFabricante" TEXT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "fabricante" TEXT,
    "unidadeMedida" TEXT NOT NULL DEFAULT 'UN',
    "precoCusto" DECIMAL,
    "precoVenda" DECIMAL NOT NULL,
    "estoqueAtual" INTEGER NOT NULL DEFAULT 0,
    "estoqueMinimo" INTEGER DEFAULT 0,
    "localizacao" TEXT,
    "oficinaId" TEXT NOT NULL,
    "fornecedorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Peca_oficinaId_fkey" FOREIGN KEY ("oficinaId") REFERENCES "Oficina" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Peca_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "Fornecedor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Fornecedor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "cnpjCpf" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "endereco" TEXT,
    "oficinaId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Fornecedor_oficinaId_fkey" FOREIGN KEY ("oficinaId") REFERENCES "Oficina" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ItemServicoPeca" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "servicoId" TEXT NOT NULL,
    "pecaId" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "precoUnitarioCobrado" DECIMAL NOT NULL,
    "valorTotal" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ItemServicoPeca_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Servico" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ItemServicoPeca_pecaId_fkey" FOREIGN KEY ("pecaId") REFERENCES "Peca" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProcedimentoPadrao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codigo" TEXT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "tempoEstimadoHoras" DECIMAL,
    "checklistJson" TEXT,
    "oficinaId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProcedimentoPadrao_oficinaId_fkey" FOREIGN KEY ("oficinaId") REFERENCES "Oficina" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProcedimentoPadraoServico" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "servicoId" TEXT NOT NULL,
    "procedimentoPadraoId" TEXT NOT NULL,
    "observacoes" TEXT,
    "concluido" BOOLEAN NOT NULL DEFAULT false,
    "dataConclusao" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProcedimentoPadraoServico_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Servico" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProcedimentoPadraoServico_procedimentoPadraoId_fkey" FOREIGN KEY ("procedimentoPadraoId") REFERENCES "ProcedimentoPadrao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MensagemPadrao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codigo" TEXT,
    "nome" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "oficinaId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MensagemPadrao_oficinaId_fkey" FOREIGN KEY ("oficinaId") REFERENCES "Oficina" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MensagemServico" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "servicoId" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "tipoEnvio" TEXT NOT NULL,
    "dataEnvio" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enviadoPor" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MensagemServico_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Servico" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Financeiro" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "descricao" TEXT NOT NULL,
    "valor" DECIMAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "categoria" TEXT,
    "data" DATETIME NOT NULL,
    "servicoId" TEXT,
    "oficinaId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Financeiro_oficinaId_fkey" FOREIGN KEY ("oficinaId") REFERENCES "Oficina" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Oficina_cnpj_key" ON "Oficina"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_cpfCnpj_key" ON "Cliente"("cpfCnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_email_key" ON "Cliente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Veiculo_placa_key" ON "Veiculo"("placa");

-- CreateIndex
CREATE UNIQUE INDEX "Veiculo_chassi_key" ON "Veiculo"("chassi");

-- CreateIndex
CREATE UNIQUE INDEX "Servico_numeroOs_key" ON "Servico"("numeroOs");

-- CreateIndex
CREATE UNIQUE INDEX "Peca_codigoInterno_key" ON "Peca"("codigoInterno");

-- CreateIndex
CREATE UNIQUE INDEX "Fornecedor_cnpjCpf_key" ON "Fornecedor"("cnpjCpf");

-- CreateIndex
CREATE UNIQUE INDEX "Fornecedor_email_key" ON "Fornecedor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ItemServicoPeca_servicoId_pecaId_key" ON "ItemServicoPeca"("servicoId", "pecaId");

-- CreateIndex
CREATE UNIQUE INDEX "ProcedimentoPadrao_codigo_key" ON "ProcedimentoPadrao"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "ProcedimentoPadraoServico_servicoId_procedimentoPadraoId_key" ON "ProcedimentoPadraoServico"("servicoId", "procedimentoPadraoId");

-- CreateIndex
CREATE UNIQUE INDEX "MensagemPadrao_codigo_key" ON "MensagemPadrao"("codigo");
