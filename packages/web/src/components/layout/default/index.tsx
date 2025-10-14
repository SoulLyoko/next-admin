'use client'
import { Layout } from 'antd'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import LayoutContent from './content'
import LayoutFooter from './footer'
import LayoutHeader from './header'
import LayoutProvider from './provider'
import LayoutSider from './sider'

export function LayoutDefault({ children }: { children: React.ReactNode }) {
  const session = useSession()
  const router = useRouter()

  if (!session)
    router.replace('/login')

  return (
    <LayoutProvider>
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
    </LayoutProvider>
  )
}

export default LayoutDefault
