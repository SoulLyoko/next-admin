import { SettingDrawer } from '@ant-design/pro-components'
import { useFullscreen, useToggle } from '@reactuses/core'
import { Button } from 'antd'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'
import { Icon } from '~/components'
import { useLayoutStore } from '~/stores'

export default function LayoutActions() {
  const { isDark, toggleDark, settings, setSettings } = useLayoutStore()
  const { setTheme } = useTheme()
  useEffect(() => setTheme(isDark() ? 'dark' : 'light'), [settings])

  const [isFullscreen, { toggleFullscreen }] = useFullscreen(() => document.documentElement)
  const [showSetting, toggleSetting] = useToggle(false)

  return (
    <>
      <Button type="text" icon={isDark() ? <Icon icon="ant-design:moon-outlined" /> : <Icon icon="ant-design:sun-outlined" />} onClick={toggleDark}></Button>
      <Button type="text" icon={isFullscreen ? <Icon icon="ant-design:compress-outlined" /> : <Icon icon="ant-design:expand-outlined" />} onClick={toggleFullscreen}></Button>
      <Button type="text" icon={<Icon icon="ant-design:setting-outlined" />} onClick={() => toggleSetting()}></Button>
      <SettingDrawer
        settings={settings}
        onSettingChange={setSettings}
        collapse={showSetting}
        onCollapseChange={toggleSetting}
        enableDarkTheme
        hideHintAlert
        hideCopyButton
      />
    </>
  )
}
