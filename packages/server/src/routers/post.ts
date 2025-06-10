import { PostPartialSchema } from '@app/db/zod'
import z from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { PageSchema, R } from '../utils'

export const postRouter = createTRPCRouter({
  page: protectedProcedure
    .input(PageSchema.and(PostPartialSchema))
    .query(async ({ ctx, input }) => {
      const res = await ctx.db.post.pagination<'post'>({ where: input })
      return R.success(res)
    }),

  list: protectedProcedure.input(PostPartialSchema).query(async ({ ctx, input }) => {
    const data = await ctx.db.post.findMany({ where: input })
    return data
  }),

  create: protectedProcedure
    .input(PostPartialSchema)
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db.post.create({ data: input })
      return data
    }),

  update: protectedProcedure
    .input(PostPartialSchema)
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db.post.update({ where: { id: input.id }, data: input })
      return data
    }),

  delete: protectedProcedure
    .input(z.string().or(z.string().array()))
    .mutation(async ({ ctx, input }) => {
      const inIds = { in: Array.isArray(input) ? input : [input] }
      await ctx.db.postsOnUsers.deleteMany({ where: { postId: inIds } })
      const data = await ctx.db.post.deleteMany({ where: { id: inIds } })
      return data
    }),
})
