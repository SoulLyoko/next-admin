import type { Prisma } from '@prisma/client'
import { MenuPartialSchema } from '@app/db/zod'
import z from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

let treeInclude: Prisma.MenuInclude = {}
for (let i = 0; i < 9; i++) {
  if (i === 0) {
    treeInclude = { parent: true, children: true }
  }
  else {
    treeInclude = { parent: true, children: { include: treeInclude } }
  }
}

export const menuRouter = createTRPCRouter({
  tree: protectedProcedure
    .input(MenuPartialSchema)
    .query(async ({ ctx, input }) => {
      const { name } = input
      const data = await ctx.db.menu.findMany({
        include: treeInclude,
        where: name ? { name } : { parentId: null },
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
})
