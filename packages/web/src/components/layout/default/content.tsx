import { Layout } from 'antd'

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <Layout.Content className="p-5 of-auto">
      {children}
    </Layout.Content>
  )
}
