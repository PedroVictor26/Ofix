import { PrismaClient } from '@prisma/client';

// Instancia o Prisma Client
const prisma = new PrismaClient({
  // Opções de log (opcional, útil para desenvolvimento)
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Hook para fechar a conexão Prisma quando a aplicação encerrar (opcional, mas boa prática)
async function gracefulShutdown(signal) {
  console.log(`*${signal} recebido, fechando conexão Prisma...`);
  await prisma.$disconnect();
  console.log('Conexão Prisma fechada.');
  process.exit(0);
}

// Ouve por sinais de término para fechar a conexão Prisma
// process.on('SIGINT', () => gracefulShutdown('SIGINT')); // Ctrl+C
// process.on('SIGTERM', () => gracefulShutdown('SIGTERM')); // `kill` command

export default prisma;
