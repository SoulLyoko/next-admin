'use client'
import type { MenuProps } from 'antd'
import { Layout, Menu } from 'antd'
import { useState } from 'react'

type MenuItem = Required<MenuProps>['items'][number]

export default function LayoutSider() {
  const [collapsed, setCollapsed] = useState(false)

  const items: MenuItem[] = [
    {
      label: <a href="/sys/user">User</a>,
      key: 'user',
    },
    {
      label: <a href="/sys/dept">Dept</a>,
      key: 'dept',
    },
    {
      label: <a href="/sys/post">Post</a>,
      key: 'post',
    },
    {
      label: <a href="/sys/role">Role</a>,
      key: 'role',
    },
  ]

  return (
    <Layout.Sider className="b-solid b-light b-r" theme="light" width="300px" collapsible onCollapse={setCollapsed}>
      <div className="flex-center gap-2 h-60px">
        <img className="size-7" src="/favicon.ico" />
        {!collapsed && <span className="font-bold text-lg c-gray">Admin</span>}
      </div>
      <Menu items={items} />
    </Layout.Sider>
  )
}
