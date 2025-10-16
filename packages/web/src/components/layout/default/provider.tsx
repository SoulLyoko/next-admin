import { ProConfigProvider } from '@ant-design/pro-components'
import { ConfigProvider } from 'antd'
import { useEffect, useState } from 'react'

export default function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted)
    return null

  return (
    <ProConfigProvider>
      <ConfigProvider theme={{ cssVar: true }}>
        {children}
      </ConfigProvider>
    </ProConfigProvider>
  )
}
