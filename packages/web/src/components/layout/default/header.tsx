'use client'
import type { MenuProps } from 'antd'
import { api } from '~/trpc/react'

export default function LayoutHeader() {
  const { data: user } = api.user.getInfo.useQuery()

  const dropdownItems: MenuProps['items'] = [
    {
      key: '1',
      icon: <Icon icon="ant-design:logout-outlined" />,
      label: <a href="/api/auth/signout">Sign Out</a>,
    },
  ]

  return (
    <ALayout.Header className="flex items-center b-solid justify-between gap-2 b-b b-light">
      <div className="flex-1">Menu</div>
      <div>
        <ADropdown menu={{ items: dropdownItems }}>
          <AButton type="text">{user?.name}</AButton>
        </ADropdown>
      </div>
    </ALayout.Header>
  )
}
