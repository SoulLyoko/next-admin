import type { ProSettings } from '@ant-design/pro-components'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LayoutStore {
  settings: ProSettings
  setSettings: (settings: ProSettings) => void
  isDark: () => boolean
  toggleDark: () => void
}

export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set, get) => {
      const setSettings: LayoutStore['setSettings'] = settings => set(() => ({ settings }))
      const isDark = () => get().settings.navTheme === 'realDark'
      const toggleDark = () => setSettings({ ...get().settings, navTheme: isDark() ? 'light' : 'realDark' })

      return {
        settings: { layout: 'mix' },
        setSettings,
        isDark,
        toggleDark,
      }
    },
    { name: 'settings' },
  ),
)
