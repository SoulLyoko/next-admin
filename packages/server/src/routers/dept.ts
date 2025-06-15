import { DeptPartialSchema } from '@app/db/zod'
import z from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export default createTRPCRouter({
  tree: protectedProcedure
    .input(DeptPartialSchema)
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.dept.findTree({ where: input })
      return data
    }),

  create: protectedProcedure
    .input(DeptPartialSchema)
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db.dept.create({ data: input })
      return data
    }),

  update: protectedProcedure
    .input(DeptPartialSchema)
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db.dept.update({ where: { id: input.id }, data: input })
      return data
    }),

  delete: protectedProcedure
    .input(z.string().or(z.string().array()))
    .mutation(async ({ ctx, input }) => {
      const inIds = { in: Array.isArray(input) ? input : [input] }
      await ctx.db.deptsOnUsers.deleteMany({ where: { deptId: inIds } })
      const data = await ctx.db.dept.deleteMany({ where: { id: inIds } })
      return data
    }),
})
