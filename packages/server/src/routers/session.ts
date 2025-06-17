import { SessionPartialSchema } from '@app/db/zod'
import z from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { PageSchema } from '../utils'

export default createTRPCRouter({
  page: protectedProcedure
    .input(PageSchema.and(SessionPartialSchema))
    .query(async ({ ctx, input }) => {
      const res = await ctx.db.session.pagination({ where: input, include: { user: true } })
      return res
    }),

  list: protectedProcedure
    .input(SessionPartialSchema)
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.session.findMany({ where: input, include: { user: true } })
      return data
    }),

  delete: protectedProcedure
    .input(z.string().or(z.string().array()))
    .mutation(async ({ ctx, input }) => {
      const inIds = { in: Array.isArray(input) ? input : [input] }
      const data = await ctx.db.session.deleteMany({ where: { id: inIds } })
      return data
    }),
})
