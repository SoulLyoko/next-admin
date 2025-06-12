import { createCallerFactory, createTRPCRouter } from '../trpc'
import { deptRouter } from './dept'
import { dictRouter } from './dict'
import { menuRouter } from './menu'
import { postRouter } from './post'
import { roleRouter } from './role'
import { userRouter } from './user'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  dept: deptRouter,
  post: postRouter,
  role: roleRouter,
  user: userRouter,
  menu: menuRouter,
  dict: dictRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)
