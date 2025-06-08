import { DeptPartialSchema, DeptSchema } from '@app/db/zod'
import z from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { R } from '../utils'

const deptTreeInclude = { parent: true, children: { include: { parent: true } } }

export const deptRouter = createTRPCRouter({
  tree: protectedProcedure
    .input(DeptPartialSchema)
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.dept.findMany({
        include: deptTreeInclude,
        where: { ...input, parentId: null },
      })
      return data
    }),

  treeList: protectedProcedure
    .input(DeptPartialSchema)
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.dept.findMany({
        include: deptTreeInclude,
        where: { ...input, parentId: null },
      })
      return R.success({ data })
    }),

  create: protectedProcedure
    .input(DeptPartialSchema)
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db.dept.create({ data: input })
      return data
    }),

  update: protectedProcedure
    .input(DeptSchema)
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db.dept.update({ where: { id: input.id }, data: input })
      return data
    }),

  delete: protectedProcedure
    .input(z.string().or(z.string().array()))
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db.dept.deleteMany({
        where: { id: { in: Array.isArray(input) ? input : [input] } },
      })
      return data
    }),
})
