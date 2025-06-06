'use client'
import type { MenuProps } from 'antd'
import { Button, Dropdown, Layout } from 'antd'
import { api } from '~/trpc/react'

export default function LayoutHeader() {
  const { data: user } = api.user.getInfo.useQuery()

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
