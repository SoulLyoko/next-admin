import type { Prisma } from '@prisma/client'
import { MenuPartialSchema } from '@app/db/zod'
import { defu } from 'defu'
import z from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export default createTRPCRouter({
  routes: protectedProcedure
    .query(async ({ ctx }) => {
      const user = ctx.session.user
      const commonArgs: Prisma.MenuFindManyArgs = {
        where: { status: '1' },
        orderBy: { sort: 'asc' },
      }
      if (user.name === 'admin') {
        const data = await ctx.db.menu.findTree({
          ...commonArgs,
          include: { children: commonArgs },
        })
        return data
      }

      const roles = await ctx.db.rolesOnUsers.findMany({
        where: { userId: user.id },
        select: { roleId: true },
      })
      const whereRoles = {
        where: {
          roles: { some: { OR: roles } },
        },
      }
      const whereRolesArgs = defu(whereRoles, commonArgs)
      const data = await ctx.db.menu.findTree({
        ...whereRolesArgs,
        include: { children: whereRolesArgs },
      })
      return data
    }),

  tree: protectedProcedure
    .input(MenuPartialSchema)
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.menu.findTree({
        include: { children: { orderBy: { sort: 'asc' } } },
        where: input,
        orderBy: { sort: 'asc' },
      })
      return data
    }),

  create: protectedProcedure
    .input(MenuPartialSchema)
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db.menu.create({ data: input })
      return data
    }),

  update: protectedProcedure
    .input(MenuPartialSchema)
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db.menu.update({ where: { id: input.id }, data: input })
      return data
    }),

  delete: protectedProcedure
    .input(z.string().or(z.string().array()))
    .mutation(async ({ ctx, input }) => {
      const inIds = { in: Array.isArray(input) ? input : [input] }
      await ctx.db.menusOnRoles.deleteMany({ where: { menuId: inIds } })
      const data = await ctx.db.menu.deleteMany({ where: { id: inIds } })
      return data
    }),

  updateStatus: protectedProcedure
    .input(MenuPartialSchema.pick({ id: true, status: true }))
    .mutation(async ({ ctx, input }) => {
      const { id, status } = input
      const data = await ctx.db.menu.update({
        where: { id },
        data: { status },
      })
      return data
    }),
})
