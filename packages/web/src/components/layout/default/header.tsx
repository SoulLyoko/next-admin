import type { MenuProps } from 'antd'
import { signOut } from 'next-auth/react'
import { api } from '~/trpc/react'

export default function LayoutHeader() {
  const { data: user } = api.user.getInfo.useQuery()

  const dropdownItems: MenuProps['items'] = [
    {
      key: '1',
      icon: <Icon icon="ant-design:logout-outlined" />,
      label: <a onClick={onSignout}>退出登录</a>,
    },
  ]

  async function onSignout() {
    signOut({ redirectTo: '/login' })
  }

  return (
    <ALayout.Header className="b-b b-light b-solid flex gap-2 items-center justify-between">
      <div className="flex-1"></div>
      <div>
        <ADropdown menu={{ items: dropdownItems }}>
          <AButton type="text">{user?.name}</AButton>
        </ADropdown>
      </div>
    </ALayout.Header>
  )
}
