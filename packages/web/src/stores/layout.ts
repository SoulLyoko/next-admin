import type { ProSettings } from '@ant-design/pro-components'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LayoutStore {
  settings: ProSettings
  setSettings: (settings: ProSettings) => void
  showSetting: boolean
  setShowSetting: (show: boolean) => void
  isDark: () => boolean
  toggleDark: () => void
}

export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set, get) => {
      const setSettings = (settings: ProSettings) => set(() => ({ settings }))
      const setShowSetting = (showSetting: boolean) => set(() => ({ showSetting }))
      const isDark = () => get().settings.navTheme === 'realDark'
      const toggleDark = () => setSettings({ ...get().settings, navTheme: isDark() ? 'light' : 'realDark' })

      return {
        settings: { layout: 'mix' },
        setSettings,
        showSetting: false,
        setShowSetting,
        isDark,
        toggleDark,
      }
    },
    {
      name: 'layout',
      partialize: state => ({ settings: state.settings }),
    },
  ),
)
