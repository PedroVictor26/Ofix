import { PrismaClient } from '@prisma/client';

// Instancia o Prisma Client
const prisma = new PrismaClient({
  // Opções de log (opcional, útil para desenvolvimento)
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

export default prisma;