import { LogPartialSchema } from '@app/db/zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { PageSchema } from '../utils'

export const logRouter = createTRPCRouter({
  page: protectedProcedure
    .input(PageSchema.and(LogPartialSchema))
    .query(async ({ ctx, input }) => {
      const res = await ctx.db.log.pagination({ where: input })
      return res
    }),
})
