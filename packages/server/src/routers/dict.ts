import { DictPartialSchema } from '@app/db/zod'
import z from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export default createTRPCRouter({
  data: protectedProcedure
    .input(z.string().optional())
    .query(async ({ ctx, input }) => {
      if (!input)
        return []
      const data = await ctx.db.dict.findTree({
        include: {
          children: {
            where: { status: '1' },
            orderBy: { sort: 'asc' },
          },
        },
        where: { value: input, status: '1' },
      })
      return data?.[0]?.children ?? []
    }),

  tree: protectedProcedure
    .input(DictPartialSchema)
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.dict.findTree({
        include: { children: { orderBy: { sort: 'asc' } } },
        where: input,
        orderBy: { sort: 'asc' },
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

  updateStatus: protectedProcedure
    .input(DictPartialSchema.pick({ id: true, status: true }))
    .mutation(async ({ ctx, input }) => {
      const { id, status } = input
      const data = await ctx.db.dict.update({
        where: { id },
        data: { status },
      })
      return data
    }),
})
