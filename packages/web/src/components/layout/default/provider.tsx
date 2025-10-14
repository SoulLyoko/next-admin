import type { ThemeConfig } from 'antd'
import { ConfigProvider, theme } from 'antd'
import { useEffect, useState } from 'react'
import { useDark } from '~/hooks'

export default function LayoutProvider({ children }: { children: React.ReactNode }) {
  const { isDark } = useDark()

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted)
    return null

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
      {children}
    </ConfigProvider>
  )
}
