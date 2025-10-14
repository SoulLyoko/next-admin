import { useCycleList } from '@reactuses/core'
import { useTheme } from 'next-themes'
import { useMemo } from 'react'

export function useDark() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = useMemo(() => resolvedTheme === 'dark', [resolvedTheme])
  const toggleDark = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  return { isDark, toggleDark }
}

export function useToggleTheme() {
  const [state, next] = useCycleList(['system', 'dark', 'light'])
  const { theme, setTheme } = useTheme()
  const toggleTheme = () => {
    next()
    setTheme(state)
  }

  return { theme, toggleTheme }
}
