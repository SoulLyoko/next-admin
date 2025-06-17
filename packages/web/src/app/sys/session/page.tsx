'use client'
import type { SessionPartialWithRelations } from '@app/db/zod'
import { api } from '~/trpc/react'

export default function SysSession() {
  const crudProps = defineProCrudProps<SessionPartialWithRelations>({
    rowKey: 'id',
    request: api.useUtils().session.page.fetch,
    delete: api.session.delete.useMutation().mutateAsync,
    addBtn: false,
    editBtn: false,
    columns: [
      {
        title: '用户',
        dataIndex: 'user',
        render(_, row) {
          return row.user?.name
        },
      },
      {
        title: 'token',
        dataIndex: 'sessionToken',
      },
      {
        title: '登录时间',
        dataIndex: 'createdAt',
        valueType: 'dateTime',
      },
      {
        title: '过期时间',
        dataIndex: 'expires',
        valueType: 'dateTime',
      },
    ],
  })

  return <ProCrud {...crudProps} />
}
