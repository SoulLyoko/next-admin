import type { UserPartial } from '@app/db/zod'
import { UserPartialSchema } from '@app/db/zod'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { hashPassword, PageSchema } from '../utils'

const userWhere = (input?: UserPartial) => ({ ...input, name: { contains: input?.name ?? '' } })

export default createTRPCRouter({
  info: protectedProcedure.query(async ({ ctx }) => {
    const id = ctx.session.user.id
    const data = await ctx.db.user.findUnique({
      include: {
        posts: { include: { post: true } },
        roles: { include: { role: true } },
        depts: { include: { dept: true } },
      },
      where: { id },
    })
    return data
  }),

  updateInfo: protectedProcedure
    .input(UserPartialSchema.omit({ password: true }))
    .mutation(async ({ ctx, input }) => {
      const id = ctx.session.user.id
      const data = await ctx.db.user.update({
        where: { id },
        data: input,
      })
      return data
    }),

  updatePassword: protectedProcedure
    .input(z.object({
      oldPassword: z.string(),
      newPassword: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const id = ctx.session.user.id
      const { oldPassword, newPassword } = input
      const user = await ctx.db.user.findUnique({
        where: { id, password: hashPassword(oldPassword!) },
      })
      if (!user) {
        throw new Error('Wrong password')
      }
      const data = await ctx.db.user.update({
        where: { id },
        data: { password: hashPassword(newPassword) },
      })
      return data
    }),

  page: protectedProcedure
    .input(UserPartialSchema.merge(PageSchema))
    .query(async ({ ctx, input }) => {
      const res = await ctx.db.user.pagination({
        omit: { password: true },
        include: {
          posts: { include: { post: true } },
          roles: { include: { role: true } },
          depts: { include: { dept: true } },
        },
        where: userWhere(input),
      })
      return {
        ...res,
        data: res.data.map(d => ({
          ...d,
          deptIds: d.depts.map(e => e.deptId),
          postIds: d.posts.map(e => e.postId),
          roleIds: d.roles.map(e => e.roleId),
        })),
      }
    }),

  list: protectedProcedure
    .input(UserPartialSchema)
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.user.findMany({ omit: { password: true }, where: userWhere(input) })
      return data
    }),

  create: protectedProcedure
    .input(UserPartialSchema.merge(z.object({
      deptIds: z.string().array().optional(),
      postIds: z.string().array().optional(),
      roleIds: z.string().array().optional(),
      name: z.string(),
      password: z.string(),
    })))
    .mutation(async ({ ctx, input }) => {
      const { deptIds, postIds, roleIds, password, ...createData } = input
      const data = await ctx.db.user.create({
        data: {
          ...createData,
          password: hashPassword(password!),
          depts: {
            createMany: { data: deptIds?.map(deptId => ({ deptId })) ?? [] },
          },
          posts: {
            createMany: { data: postIds?.map(postId => ({ postId })) ?? [] },
          },
          roles: {
            createMany: { data: roleIds?.map(roleId => ({ roleId })) ?? [] },
          },
        },
      })
      return data
    }),

  update: protectedProcedure
    .input(UserPartialSchema.omit({ password: true }).merge(z.object({
      deptIds: z.string().array(),
      postIds: z.string().array(),
      roleIds: z.string().array(),
    }).partial()))
    .mutation(async ({ ctx, input }) => {
      const { id, deptIds, postIds, roleIds, ...updateData } = input
      const data = await ctx.db.user.update({
        where: { id },
        data: {
          ...updateData,
          depts: {
            deleteMany: { userId: id },
            createMany: { data: deptIds?.map(deptId => ({ deptId })) ?? [] },
          },
          posts: {
            deleteMany: { userId: id },
            createMany: { data: postIds?.map(postId => ({ postId })) ?? [] },
          },
          roles: {
            deleteMany: { userId: id },
            createMany: { data: roleIds?.map(roleId => ({ roleId })) ?? [] },
          },
        },
      })
      return data
    }),

  delete: protectedProcedure
    .input(z.string().or(z.string().array()))
    .mutation(async ({ ctx, input }) => {
      const inIds = { in: Array.isArray(input) ? input : [input] }
      await ctx.db.deptsOnUsers.deleteMany({ where: { userId: inIds } })
      await ctx.db.postsOnUsers.deleteMany({ where: { userId: inIds } })
      await ctx.db.rolesOnUsers.deleteMany({ where: { userId: inIds } })
      const data = await ctx.db.user.deleteMany({ where: { id: inIds } })
      return data
    }),

  updateStatus: protectedProcedure
    .input(UserPartialSchema.pick({ id: true, status: true }))
    .mutation(async ({ ctx, input }) => {
      const { id, status } = input
      const data = await ctx.db.user.update({
        where: { id },
        data: { status },
      })
      return data
    }),
})
