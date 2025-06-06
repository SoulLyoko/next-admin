'use client'
import type { MenuProps } from 'antd'
import type { RouterOutputs } from '~/trpc/react'
import { Button, Dropdown, Layout } from 'antd'

export default function LayoutHeader({ user }: { user: RouterOutputs['user']['getUserInfo'] }) {
  const dropdownItems: MenuProps['items'] = [
    {
      key: '1',
      icon: <i className="i-ant-design-logout-outlined" />,
      label: <a href="/api/auth/signout">Sign Out</a>,
    },
  ]

  return (
    <Layout.Header className="flex items-center b-solid justify-between gap-2 b-b b-light">
      <div className="flex-1">Menu</div>
      <div>
        <Dropdown menu={{ items: dropdownItems }}>
          <Button type="text">{user?.name}</Button>
        </Dropdown>
      </div>
    </Layout.Header>
  )
}
