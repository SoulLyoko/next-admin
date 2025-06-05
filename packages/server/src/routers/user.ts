import { z } from 'zod'
import {
  createTRPCRouter,
  publicProcedure,
} from '../trpc'

export const userRouter = createTRPCRouter({
  signup: publicProcedure
    .input(z.object({ name: z.string().min(1), password: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const existsUser = await ctx.db.user.findFirst({ where: { name: input.name } })
      if (existsUser)
        throw new Error('User name already exists.')

      const data = {
        name: input.name,
        password: input.password,
      }
      return ctx.db.user.create({ data })
    }),
})
