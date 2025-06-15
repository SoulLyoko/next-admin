import { createCallerFactory, createTRPCRouter } from '../trpc'
import auth from './auth'
import dept from './dept'
import dict from './dict'
import log from './log'
import menu from './menu'
import post from './post'
import role from './role'
import user from './user'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth,
  dept,
  dict,
  log,
  menu,
  post,
  role,
  user,
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
