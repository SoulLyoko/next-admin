'use client'
import { Layout } from 'antd'

export default function LayoutSider({ children }: { children: React.ReactNode }) {
  return (
    <Layout.Content className="p-5">
      <div className="rd-lg h-full bg-white">
        {children}
      </div>
    </Layout.Content>
  )
}
