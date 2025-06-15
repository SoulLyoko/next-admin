import z from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'

export default createTRPCRouter({
  signup: publicProcedure
    .input(z.object({ name: z.string().min(1), password: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const existsUser = await ctx.db.user.findFirst({ where: { name: input.name } })
      if (existsUser)
        throw new Error('User name already exists.')

      return ctx.db.user.create({ data: input })
    }),
})
