import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'

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
})
