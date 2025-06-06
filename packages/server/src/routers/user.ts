import type { UserPartial } from '@app/db/zod'
import { UserPartialSchema, UserSchema } from '@app/db/zod'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'
import { PageSchema, R } from '../utils'

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
    .input(PageSchema.and(UserPartialSchema))
    .query(async ({ ctx, input }) => {
      const res = await ctx.db.user.pagination<'user'>(userWhere(input))
      return R.success(res)
    }),

  list: protectedProcedure.input(UserPartialSchema).query(async ({ ctx, input }) => {
    const data = await ctx.db.user.findMany({ where: userWhere(input) })
    return R.success({ data })
  }),

  create: protectedProcedure
    .input(UserPartialSchema)
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db.user.create({ data: input })
      return R.success({ data })
    }),

  update: protectedProcedure
    .input(UserSchema)
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db.user.update({ where: { id: input.id }, data: input })
      return R.success({ data })
    }),

  delete: protectedProcedure
    .input(UserSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db.user.delete({ where: { id: input.id } })
      return R.success({ data })
    }),
})
