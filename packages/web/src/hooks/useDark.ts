import { useTheme } from 'next-themes'
import { useMemo } from 'react'

export function useDark() {
  const { theme, setTheme } = useTheme()
  const isDark = useMemo(() => theme === 'dark', [theme])
  const toggleDark = () => setTheme(theme === 'dark' ? 'light' : 'dark')
  return { isDark, toggleDark }
}
