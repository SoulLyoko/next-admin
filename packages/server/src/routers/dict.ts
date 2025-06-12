import { DictPartialSchema } from '@app/db/zod'
import z from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { getTreeInclude } from '../utils'

export const dictRouter = createTRPCRouter({
  data: protectedProcedure
    .input(z.string().optional())
    .query(async ({ ctx, input }) => {
      if (!input)
        return []
      const data = await ctx.db.dict.findFirst({
        include: getTreeInclude(),
        where: { value: input, parentId: null },
      })
      return data?.children ?? []
    }),

  tree: protectedProcedure
    .input(DictPartialSchema)
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.dict.findMany({
        include: getTreeInclude(),
        where: { ...input, parentId: null },
      })
      return data
    }),

  create: protectedProcedure
    .input(DictPartialSchema.merge(z.object({ value: z.string() })))
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db.dict.create({ data: input })
      return data
    }),

  update: protectedProcedure
    .input(DictPartialSchema)
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db.dict.update({ where: { id: input.id }, data: input })
      return data
    }),

  delete: protectedProcedure
    .input(z.string().or(z.string().array()))
    .mutation(async ({ ctx, input }) => {
      const inIds = { in: Array.isArray(input) ? input : [input] }
      const data = await ctx.db.dict.deleteMany({ where: { id: inIds } })
      return data
    }),
})
