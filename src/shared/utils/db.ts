import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

declare global {
  var _prisma: PrismaClient | undefined;
}

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma =
  global._prisma ||
  new PrismaClient({
    adapter,
    log: ['query'],
    // log: ['query', 'info', 'warn', 'error'],
  });

// В режиме разработки (когда NODE_ENV не 'production') мы сохраняем
// созданный инстанс в глобальный объект.
// При следующем hot-reload код выше возьмет уже существующий инстанс
// из `global.prisma` и не будет создавать новый.
if (process.env.NODE_ENV !== 'production') {
  global._prisma = prisma;
}
