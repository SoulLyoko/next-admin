'use client'
import type { PostPartial } from '@app/db/zod'
import { api } from '~/trpc/react'

export default function SysPost() {
  const crudProps = defineProCrudProps<PostPartial>({
    rowKey: 'id',
    request: api.useUtils().post.page.fetch,
    create: api.post.create.useMutation().mutateAsync,
    update: api.post.update.useMutation().mutateAsync,
    delete: api.post.delete.useMutation().mutateAsync,
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
