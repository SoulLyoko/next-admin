'use client'
import type { ItemType } from 'antd/es/menu/interface'
import type { RouterOutputs } from '~/trpc/react'
import { usePathname, useRouter } from 'next/navigation'
import { api } from '~/trpc/react'

type MenuItem = ItemType & { children?: ItemType[] }
type MenuVO = RouterOutputs['menu']['tree'][number]

export default function LayoutSider() {
  const { data } = api.menu.tree.useQuery({})
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  function getItems(items?: MenuVO[]) {
    return items?.map((item) => {
      const menuItem: MenuItem = {
        label: item.name,
        key: item.path ?? 'sys',
        icon: item.icon && <Icon icon={item.icon} />,
        onClick: () => {
          item.path && router.push(item.path)
        },
      }
      if (item.children.length) {
        menuItem.children = getItems(item.children as MenuVO[]) ?? []
      }
      return menuItem
    })
  }

  return (
    <ALayout.Sider className="b-solid b-light b-r" theme="light" width="300px" collapsible onCollapse={setCollapsed}>
      <div className="flex-center gap-2 h-60px">
        <img className="size-7" src="/favicon.ico" />
        {!collapsed && <span className="font-bold text-lg c-gray">Admin</span>}
      </div>
      <AMenu items={getItems(data)} mode="inline" defaultSelectedKeys={[pathname]} defaultOpenKeys={['sys']} />
    </ALayout.Sider>
  )
}
