import type { MenuProps } from 'antd'
import { signOut } from 'next-auth/react'
import { api } from '~/trpc/react'

export default function LayoutHeader() {
  const { data: user } = api.user.info.useQuery()

  const dropdownItems: MenuProps['items'] = [
    {
      key: 'user',
      icon: <AAvatar src={user?.image}></AAvatar>,
      label: user?.nickname ?? user?.name ?? '未知用户',
    },
    {
      type: 'divider',
    },
    {
      key: 'profile',
      icon: <Icon icon="ant-design:user-outlined" />,
      label: <a href="/sys/profile">个人中心</a>,
    },
    {
      key: 'signout',
      icon: <Icon icon="ant-design:logout-outlined" />,
      label: <a onClick={() => signOut({ redirectTo: '/login' })}>退出登录</a>,
    },
  ]

  return (
    <ALayout.Header className="b-b b-light b-solid flex gap-2 items-center justify-between">
      <div className="flex-1"></div>
      <div>
        {user
          ? (
              <ADropdown menu={{ items: dropdownItems }}>
                <AAvatar className="cursor-pointer" src={user?.image}></AAvatar>
              </ADropdown>
            )
          : <a href="/login">登录</a> }
      </div>
    </ALayout.Header>
  )
}
