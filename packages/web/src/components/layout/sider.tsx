'use client'
import { Layout } from 'antd'
import { useState } from 'react'

export default function LayoutSider() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <Layout.Sider className="b-solid b-light b-r" theme="light" width="300px" collapsible onCollapse={setCollapsed}>
      <div className="flex-center gap-2 h-60px">
        <img className="size-7" src="/favicon.ico" />
        {!collapsed && <span className="font-bold text-lg c-gray">Admin</span>}
      </div>
    </Layout.Sider>
  )
}
