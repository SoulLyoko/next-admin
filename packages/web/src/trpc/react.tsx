'use client'
import type { AppRouter } from '@app/server'
import type { QueryClient } from '@tanstack/react-query'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { QueryClientProvider } from '@tanstack/react-query'
import { createTRPCReact } from '@trpc/react-query'

import { SessionProvider } from 'next-auth/react'
import { createHttpBatchStreamLink, createLoggerLink } from './links'
import { createQueryClient } from './query-client'

let clientQueryClientSingleton: QueryClient | undefined
function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return createQueryClient()
  }
  // Browser: use singleton pattern to keep the same query client
  clientQueryClientSingleton ??= createQueryClient()

  return clientQueryClientSingleton
}

export const api = createTRPCReact<AppRouter>()

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient()
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        createLoggerLink(),
        createHttpBatchStreamLink(),
      ],
    }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        <SessionProvider>
          {props.children}
        </SessionProvider>
      </api.Provider>
    </QueryClientProvider>
  )
}

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
