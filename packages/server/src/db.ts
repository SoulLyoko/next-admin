import process from 'node:process'
import { PrismaClient } from '@prisma/client'
import { pagination, softDelete, tree } from './extensions'

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
    .$extends(pagination())
    .$extends(softDelete())
    .$extends(tree())
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production')
  globalForPrisma.prisma = db
