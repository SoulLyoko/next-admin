import { MenuPartialSchema } from '@app/db/zod'
import z from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { buildTree, getTreeInclude } from '../utils'

export default createTRPCRouter({
  tree: protectedProcedure
    .input(MenuPartialSchema)
    .query(async ({ ctx, input }) => {
      const { name } = input
      const data = await ctx.db.menu.findMany({
        include: getTreeInclude(),
        where: name ? { name } : { parentId: null },
      })
      return data
    }),

  routes: protectedProcedure
    .query(async ({ ctx }) => {
      const user = ctx.session.user
      if (user.name === 'admin') {
        const menus = await ctx.db.menu.findMany({ })
        return buildTree(menus)
      }

      const roles = await ctx.db.rolesOnUsers.findMany({
        where: { userId: user.id },
        select: { roleId: true },
      })
      const menus = await ctx.db.menu.findMany({
        where: {
          roles: {
            some: {
              OR: roles,
            },
          },
        },
      })
      return buildTree(menus)
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
})
