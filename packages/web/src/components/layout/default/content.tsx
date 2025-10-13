import { Layout } from 'antd'

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <Layout.Content className="p-5 of-auto">
      <div className="rd-lg bg-white h-full">
        {children}
      </div>
    </Layout.Content>
  )
}
