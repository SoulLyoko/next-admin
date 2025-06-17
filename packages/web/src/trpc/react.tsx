/* eslint-disable node/prefer-global/process */
'use client'
import type { AppRouter } from '@app/server'
import type { QueryClient } from '@tanstack/react-query'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { QueryClientProvider } from '@tanstack/react-query'
import { httpBatchStreamLink, loggerLink, TRPCClientError } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'

import { message } from 'antd'
import { SessionProvider } from 'next-auth/react'
import SuperJSON from 'superjson'
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

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient()
  const isDev = process.env.NODE_ENV === 'development'
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: op => isDev || (op.direction === 'down' && op.result instanceof Error),
          logger(opts: any) {
            const { direction, type, id, path, result } = opts
            const isDown = direction === 'down'
            const isError = isDown && result instanceof TRPCClientError
            const parts = ['%c', isDown ? '<<' : '>>', type, `#${id}`, path, '%O']
            const fn: 'error' | 'log' = isError ? 'error' : 'log'
            // eslint-disable-next-line no-console
            console[fn](parts.join(' '), 'background:skyblue;color:black;font-weight:bold;', opts)

            if (isError) {
              const code = result.data?.code
              const msg = result.message
              code && message.error(isDev ? `${code}: ${msg}` : code)
              if (result?.data?.httpStatus === 401) {
                location.href = '/login'
              }
            }
          },
        }),
        httpBatchStreamLink({
          transformer: SuperJSON,
          url: `${getBaseUrl()}/api/trpc`,
          headers: () => {
            const headers = new Headers()
            headers.set('x-trpc-source', 'nextjs-react')
            return headers
          },
        }),
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

function getBaseUrl() {
  if (typeof window !== 'undefined')
    return window.location.origin
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}
