'use client'
import type { MenuDataItem } from '@ant-design/pro-components'
import { GridContent, ProLayout, SettingDrawer } from '@ant-design/pro-components'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { Icon } from '~/components'
import { APP_LOGO, APP_TITLE } from '~/constants'
import { useLayoutStore } from '~/stores'
import { client } from '~/trpc/client'
import LayoutActions from './actions'
import LayoutAvatar from './avatar'
import LayoutFooter from './footer'
import LayoutProvider from './provider'

export function LayoutDefault({ children }: { children: React.ReactNode }) {
  const session = useSession()
  const router = useRouter()

  if (!session)
    router.replace('/login')

  const pathname = usePathname()

  const loopMenuItem = (menus: any[]): MenuDataItem[] =>
    menus.map(({ icon, children, ...item }) => ({
      ...item,
      icon: <Icon icon={icon} className="text-1.2em" />,
      children: children && loopMenuItem(children),
    }))
  const menuRequest = () => client.menu.routes.query().then(loopMenuItem)
  const menuItemRender = (item: MenuDataItem, dom: React.ReactNode) => {
    return <div onClick={() => item.path?.startsWith('/') && router.push(item.path)}>{dom}</div>
  }

  const { settings, setSettings, showSetting, setShowSetting } = useLayoutStore()

  return (
    <LayoutProvider>
      <ProLayout
        className="h-full [&_.ant-pro-global-header-header-actions-avatar]:p-0 [&_.ant-pro-setting-drawer-handle]:hidden"
        title={APP_TITLE}
        logo={APP_LOGO}
        location={{ pathname }}
        menu={{ request: menuRequest }}
        menuItemRender={menuItemRender}
        actionsRender={() => <LayoutActions />}
        avatarProps={{ render: () => <LayoutAvatar /> }}
        footerRender={() => <LayoutFooter />}
        {...settings}
      >
        <GridContent className="h-full [&>.ant-pro-grid-content-children]:h-full">
          {children}
        </GridContent>

        <SettingDrawer
          settings={settings}
          onSettingChange={setSettings}
          collapse={showSetting}
          onCollapseChange={setShowSetting}
          enableDarkTheme
          hideHintAlert
          hideCopyButton
        />
      </ProLayout>
    </LayoutProvider>
  )
}

export default LayoutDefault
