import { LogPartialSchema } from '@app/db/zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { PageSchema } from '../utils'

export default createTRPCRouter({
  page: protectedProcedure
    .input(PageSchema.and(LogPartialSchema))
    .query(async ({ ctx, input }) => {
      const res = await ctx.db.log.pagination({
        where: input,
        orderBy: { createdAt: 'desc' },
      })
      return res
    }),
})
