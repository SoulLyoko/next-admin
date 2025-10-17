import { ProConfigProvider } from '@ant-design/pro-components'
import { ConfigProvider } from 'antd'
import { useEffect, useState } from 'react'
import { useLayoutStore } from '~/stores'

export default function LayoutProvider({ children }: { children: React.ReactNode }) {
  const { isDark } = useLayoutStore()

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted)
    return null

  return (
    <ProConfigProvider dark={isDark()}>
      <ConfigProvider theme={{ cssVar: true }}>
        {children}
      </ConfigProvider>
    </ProConfigProvider>
  )
}
