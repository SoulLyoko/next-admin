import type { MenuProps } from 'antd'
import { Avatar, Dropdown, Typography } from 'antd'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { Icon } from '~/components'
import { api } from '~/trpc/react'

export default function LayoutAvatar() {
  const { data: user } = api.user.info.useQuery()

  const dropdownItems: MenuProps['items'] = [
    {
      key: 'home',
      icon: <Icon icon="ant-design:home-outlined" width="14" />,
      label: <Link href="/">首页</Link>,
    },
    {
      key: 'profile',
      icon: <Icon icon="ant-design:user-outlined" width="14" />,
      label: <Link href="/sys/profile">个人中心</Link>,
    },
    {
      key: 'signout',
      icon: <Icon icon="ant-design:logout-outlined" width="14" />,
      label: <a onClick={() => signOut({ redirectTo: '/login' })}>退出登录</a>,
    },
  ]

  return (
    <Dropdown menu={{ items: dropdownItems }}>
      <div className="flex gap-2">
        <Avatar src={user?.image}></Avatar>
        <Typography.Text>{user?.nickname ?? user?.name}</Typography.Text>
      </div>
    </Dropdown>
  )
}
