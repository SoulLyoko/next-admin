'use client'
import type { SessionPartialWithRelations } from '@app/db/zod'
import { client } from '~/trpc/client'

export default function SysSession() {
  const crudProps = defineProCrudProps<SessionPartialWithRelations>({
    rowKey: 'id',
    request: client.session.page.query,
    delete: client.session.delete.mutate,
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
