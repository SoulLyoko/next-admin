import type { Prisma } from '@prisma/client'
import process from 'node:process'
import { PrismaClient } from '@prisma/client'

function createPrismaClient() {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  }).$extends({
    model: {
      $allModels: {
        async pagination<T extends Prisma.TypeMap['meta']['modelProps']>(input?: { current?: number, pageSize?: number } & Record<string, any>) {
          const ctx = this as unknown as PrismaClient[T]
          const { current = 1, pageSize = 10, ...where } = input ?? {}
          // eslint-disable-next-line ts/ban-ts-comment
          // @ts-expect-error
          const data: Awaited<ReturnType<PrismaClient[T]['findMany']>> = await ctx.findMany({
            take: pageSize,
            skip: pageSize * (current - 1),
            where,
          })
          // eslint-disable-next-line ts/ban-ts-comment
          // @ts-expect-error
          const total: number = await ctx.count({ where })
          return { data, total }
        },
      },
    },
  })
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production')
  globalForPrisma.prisma = db
