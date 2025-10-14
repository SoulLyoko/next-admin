import type { MenuProps } from 'antd'
import { useFullscreen } from 'ahooks'
import { Avatar, Button, Dropdown, Layout } from 'antd'
import { signOut } from 'next-auth/react'
import { Icon } from '~/components'
import { useDark } from '~/hooks'
import { api } from '~/trpc/react'

export default function LayoutHeader() {
  const { data: user } = api.user.info.useQuery()

  const dropdownItems: MenuProps['items'] = [
    {
      key: 'user',
      icon: <Avatar src={user?.image}></Avatar>,
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

  const { isDark, toggleDark } = useDark()
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(() => document.documentElement)

  return (
    <Layout.Header className="flex gap-2 items-center justify-between">
      <div className="flex-1"></div>
      <Button type="text" icon={isDark ? <Icon icon="ant-design:moon-outlined" /> : <Icon icon="ant-design:sun-outlined" />} onClick={toggleDark}></Button>
      <Button type="text" icon={isFullscreen ? <Icon icon="ant-design:compress-outlined" /> : <Icon icon="ant-design:expand-outlined" />} onClick={toggleFullscreen}></Button>
      <div>
        {user
          ? (
              <Dropdown menu={{ items: dropdownItems }}>
                <Avatar className="cursor-pointer" src={user?.image}></Avatar>
              </Dropdown>
            )
          : <a href="/login">登录</a>}
      </div>
    </Layout.Header>
  )
}
