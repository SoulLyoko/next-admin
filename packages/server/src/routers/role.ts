import { RolePartialSchema } from '@app/db/zod'
import z from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { PageSchema } from '../utils'

export default createTRPCRouter({
  page: protectedProcedure
    .input(PageSchema.and(RolePartialSchema))
    .query(async ({ ctx, input }) => {
      const res = await ctx.db.role.pagination({
        include: {
          menus: { include: { menu: true } },
        },
        where: input,
      })
      return {
        ...res,
        data: res.data.map(d => ({
          ...d,
          menuIds: d.menus.map(e => e.menuId),
        })),
      }
    }),

  list: protectedProcedure
    .input(RolePartialSchema)
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.role.findMany({ where: input })
      return data
    }),

  create: protectedProcedure
    .input(RolePartialSchema.merge(z.object({
      menuIds: z.string().array().optional(),
    })))
    .mutation(async ({ ctx, input }) => {
      const { menuIds, ...createData } = input
      const data = await ctx.db.role.create({
        data: {
          ...createData,
          menus: {
            createMany: { data: menuIds?.map(menuId => ({ menuId })) ?? [] },
          },
        },
      })
      return data
    }),

  update: protectedProcedure
    .input(RolePartialSchema.merge(z.object({
      menuIds: z.string().array().optional(),
    })))
    .mutation(async ({ ctx, input }) => {
      const { id, menuIds, ...updateData } = input
      const data = await ctx.db.role.update({
        where: { id: input.id },
        data: {
          ...updateData,
          menus: {
            deleteMany: { roleId: id },
            createMany: { data: menuIds?.map(menuId => ({ menuId })) ?? [] },
          },
        },
      })
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

  updateStatus: protectedProcedure
    .input(RolePartialSchema.pick({ id: true, status: true }))
    .mutation(async ({ ctx, input }) => {
      const { id, status } = input
      const data = await ctx.db.role.update({
        where: { id },
        data: { status },
      })
      return data
    }),
})
