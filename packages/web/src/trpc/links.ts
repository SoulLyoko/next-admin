/* eslint-disable node/prefer-global/process */
import { httpBatchStreamLink, loggerLink, TRPCClientError } from '@trpc/client'
import { message } from 'antd'
import SuperJSON from 'superjson'

export function createLoggerLink() {
  const isDev = process.env.NODE_ENV === 'development'
  return loggerLink({
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
  })
}

export function createHttpBatchStreamLink() {
  return httpBatchStreamLink({
    transformer: SuperJSON,
    url: `${getBaseUrl()}/api/trpc`,
    headers: () => {
      const headers = new Headers()
      headers.set('x-trpc-source', 'nextjs-react')
      return headers
    },
  })
}

function getBaseUrl() {
  if (typeof window !== 'undefined')
    return window.location.origin
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}
