import type { Metadata } from 'next'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { Analytics } from '@vercel/analytics/next'
import { APP_DESC, APP_LOGO, APP_TITLE } from '~/constants/app'
import { TRPCReactProvider } from '~/trpc/react'
import '@ant-design/v5-patch-for-react-19'
import '@unocss/reset/tailwind.css'
import '~/styles/globals.css'

export const metadata: Metadata = {
  title: APP_TITLE,
  description: APP_DESC,
  icons: [{ rel: 'icon', url: APP_LOGO }],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <TRPCReactProvider>
          <AntdRegistry>
            {children}
          </AntdRegistry>
        </TRPCReactProvider>

        <Analytics></Analytics>
      </body>
    </html>
  )
}
