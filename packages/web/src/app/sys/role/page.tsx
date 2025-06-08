'use client'
import type { ProColumns } from '@ant-design/pro-components'
import ProCrud from '~/components/pro-crud'
import { api } from '~/trpc/react'

export default function Role() {
  const createRole = api.role.create.useMutation().mutateAsync
  const updateRole = api.role.update.useMutation().mutateAsync
  const deleteRole = api.role.delete.useMutation().mutateAsync
  const getRolePage = api.useUtils().role.page.fetch

  const columns: ProColumns[] = [
    {
      title: '名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '此项为必填项' }],
      },
    },
  ]

  return (
    <ProCrud
      rowKey="id"
      columns={columns}
      request={getRolePage}
      create={createRole}
      update={updateRole}
      delete={deleteRole}
    />
  )
}
