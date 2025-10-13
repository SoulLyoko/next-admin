import type { UseDarkOptions } from '@reactuses/core'
import { useDarkMode } from '@reactuses/core'
import { useRouter } from 'next/navigation'

export function useDark(options?: UseDarkOptions) {
  const [isDark, toggleDark] = useDarkMode({
    classNameDark: 'dark',
    classNameLight: 'light',
    defaultValue: localStorage.getItem('reactuses-color-scheme') === 'dark',
    ...options,
  })

  const router = useRouter()

  return [
    isDark,
    () => {
      toggleDark()
      router.refresh()
    },
  ] as const
}
