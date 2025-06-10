'use client'
import type { ThemeConfig } from 'antd'
import LayoutContent from './content'
import LayoutFooter from './footer'
import LayoutHeader from './header'
import LayoutSider from './sider'

export default function LayoutDefault({ children }: { children: React.ReactNode }) {
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
    <AConfigProvider theme={theme}>
      <ALayout className="h-full" hasSider>
        <LayoutSider />
        <ALayout>
          <LayoutHeader />
          <LayoutContent>
            {children}
          </LayoutContent>
          <LayoutFooter />
        </ALayout>
      </ALayout>
    </AConfigProvider>
  )
}
