import type { AppRouter } from '@app/server'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { createTRPCClient } from '@trpc/client'
import { createHttpBatchStreamLink, createLoggerLink } from './links'

export const client = createTRPCClient<AppRouter>({
  links: [
    createLoggerLink(),
    createHttpBatchStreamLink(),
  ],
})

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>
