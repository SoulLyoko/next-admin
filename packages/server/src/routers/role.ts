import { RolePartialSchema } from '@app/db/zod'
import z from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { PageSchema, R } from '../utils'

export const roleRouter = createTRPCRouter({
  page: protectedProcedure
    .input(PageSchema.and(RolePartialSchema))
    .query(async ({ ctx, input }) => {
      const res = await ctx.db.role.pagination<'role'>({ where: input })
      return R.success(res)
    }),

  list: protectedProcedure
    .input(RolePartialSchema)
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.role.findMany({ where: input })
      return data
    }),

  create: protectedProcedure
    .input(RolePartialSchema)
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db.role.create({ data: input })
      return data
    }),

  update: protectedProcedure
    .input(RolePartialSchema)
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db.role.update({ where: { id: input.id }, data: input })
      return data
    }),

  delete: protectedProcedure
    .input(z.string().or(z.string().array()))
    .mutation(async ({ ctx, input }) => {
      const inIds = { in: Array.isArray(input) ? input : [input] }
      await ctx.db.rolesOnUsers.deleteMany({ where: { roleId: inIds } })
      await ctx.db.menusOnRoles.deleteMany({ where: { roleId: inIds } })
      const data = await ctx.db.role.deleteMany({ where: { id: inIds } })
      return data
    }),
})
