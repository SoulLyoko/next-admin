'use client'
import type { ThemeConfig } from 'antd'
import { ConfigProvider, Layout, theme } from 'antd'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useDark } from '~/hooks'
import LayoutContent from './content'
import LayoutFooter from './footer'
import LayoutHeader from './header'
import LayoutSider from './sider'

export function LayoutDefault({ children }: { children: React.ReactNode }) {
  const session = useSession()
  const router = useRouter()

  if (!session)
    router.replace('/login')

  const [isDark] = useDark()
  const themeConfig: ThemeConfig = {
    cssVar: true,
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    components: {
      Layout: {
        headerBg: 'var(--ant-color-bg-container)',
        headerHeight: '60px',
        headerPadding: '0 20px',
        footerPadding: '10px 20px',
        footerBg: 'var(--ant-color-bg-container)',
        triggerHeight: '40px',
      },
    },
  }

  return (
    <ConfigProvider theme={themeConfig}>
      <Layout className="h-full" hasSider>
        <LayoutSider />
        <Layout>
          <LayoutHeader />
          <LayoutContent>
            {children}
          </LayoutContent>
          <LayoutFooter />
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}

export default LayoutDefault
