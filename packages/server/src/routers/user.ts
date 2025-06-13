import type { UserPartial } from '@app/db/zod'
import { UserPartialSchema } from '@app/db/zod'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'
import { PageSchema } from '../utils'

const userWhere = (input?: UserPartial) => ({ ...input, name: { contains: input?.name ?? '' } })

export const userRouter = createTRPCRouter({
  signup: publicProcedure
    // .input(z.object({ name: z.string().min(1), password: z.string().min(1) }))
    .input(z.instanceof(FormData))
    .mutation(async ({ ctx, input }) => {
      const data = {
        name: input.get('name') as string,
        password: input.get('password') as string,
      }

      if (!data.name || !data.password)
        throw new Error('Invalid input.')

      const existsUser = await ctx.db.user.findFirst({ where: { name: data.name } })
      if (existsUser)
        throw new Error('User name already exists.')

      return ctx.db.user.create({ data })
    }),

  getInfo: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.session.user
    }),

  page: protectedProcedure
    .input(UserPartialSchema.merge(PageSchema))
    .query(async ({ ctx, input }) => {
      const res = await ctx.db.user.pagination({
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
      const data = await ctx.db.user.findMany({ where: userWhere(input) })
      return data
    }),

  create: protectedProcedure
    .input(UserPartialSchema)
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db.user.create({ data: input })
      return data
    }),

  update: protectedProcedure
    .input(UserPartialSchema.merge(z.object({
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
})
