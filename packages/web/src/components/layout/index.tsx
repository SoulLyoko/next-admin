'use client'
import type { ThemeConfig } from 'antd'
import type { RouterOutputs } from '~/trpc/react'
import { ConfigProvider, Layout } from 'antd'
import LayoutContent from './content'
import LayoutFooter from './footer'
import LayoutHeader from './header'
import LayoutSider from './sider'

export default function DefaultLayout({ children, user }: { children: React.ReactNode, user: RouterOutputs['user']['getUserInfo'] }) {
  const theme: ThemeConfig = {
    components: {
      Layout: {
        headerBg: 'white',
        headerHeight: '60px',
        headerPadding: '0 20px',
        footerPadding: '10px 20px',
        footerBg: 'white',
        triggerHeight: '40px',
      },
    },
  }

  return (
    <ConfigProvider theme={theme}>
      <Layout className="h-full" hasSider>
        <LayoutSider />
        <Layout>
          <LayoutHeader user={user} />
          <LayoutContent>
            {children}
          </LayoutContent>
          <LayoutFooter />
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}
