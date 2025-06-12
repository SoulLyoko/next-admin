'use client'
import type { RolePartial } from '@app/db/zod'
import { api } from '~/trpc/react'

export default function SysRole() {
  const crudProps = defineProCrudProps<RolePartial>({
    rowKey: 'id',
    request: api.useUtils().role.page.fetch,
    create: api.role.create.useMutation().mutateAsync,
    update: api.role.update.useMutation().mutateAsync,
    delete: api.role.delete.useMutation().mutateAsync,
    columns: [
      {
        title: '名称',
        dataIndex: 'name',
        formItemProps: {
          rules: [{ required: true }],
        },
      },
    ],
  })

  return <ProCrud {...crudProps} />
}
