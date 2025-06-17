import type { MenuProps } from 'antd'
import { signOut, useSession } from 'next-auth/react'

export default function LayoutHeader() {
  const session = useSession()
  const user = session.data?.user

  const dropdownItems: MenuProps['items'] = [
    {
      key: '0',
      icon: <Icon icon="ant-design:user-outlined" />,
      label: user?.nickname ?? user?.name ?? '未知用户',
    },
    {
      key: '1',
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
