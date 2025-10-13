import type { MenuPartialWithRelations } from '@app/db/zod'
import type { ItemType } from 'antd/es/menu/interface'
import { Layout, Menu } from 'antd'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Icon } from '~/components'
import { api } from '~/trpc/react'

type MenuItem = ItemType & { children?: ItemType[] }
type MenuVO = MenuPartialWithRelations

export default function LayoutSider() {
  const { data } = api.menu.routes.useQuery()
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const [openKeys, setOpenKeys] = useState<string[]>()
  useEffect(() => {
    if (data?.length) {
      const find = data?.find(d => d.children?.some(e => e.path === pathname))
      setOpenKeys(find?.path ? [find.path] : [])
    }
  }, [data])

  function getItems(items?: MenuVO[]) {
    return items?.map((item) => {
      const menuItem: MenuItem = {
        label: item.name,
        key: item.path!,
        icon: item.icon && <Icon icon={item.icon} />,
      }
      if (item.children?.length) {
        menuItem.children = getItems(item.children) ?? []
      }
      return menuItem
    })
  }

  function onSelect(item: any) {
    item.key?.startsWith('/') && router.push(item.key)
  }

  return (
    <Layout.Sider className="b-r b-light b-solid" theme="light" width="300px" collapsible onCollapse={setCollapsed}>
      <div className="flex-center gap-2 h-60px cursor-pointer" onClick={() => router.push('/')}>
        <img className="size-7" src="/favicon.ico" />
        {!collapsed && <span className="text-lg c-gray font-bold">Admin</span>}
      </div>
      {openKeys && (
        <Menu
          className="flex-1 of-auto"
          items={getItems(data)}
          mode="inline"
          defaultSelectedKeys={[pathname]}
          defaultOpenKeys={openKeys}
          onSelect={onSelect}
        />
      )}
    </Layout.Sider>
  )
}
