'use client'
import type { PostPartial } from '@app/db/zod'
import { client } from '~/trpc/client'

export default function SysPost() {
  const queryDict = client.dict.data.query

  const crudProps = defineProCrudProps<PostPartial>({
    rowKey: 'id',
    request: client.post.page.query,
    create: client.post.create.mutate,
    update: client.post.update.mutate,
    delete: client.post.delete.mutate,
    columns: [
      {
        title: '名称',
        dataIndex: 'name',
        search: true,
        formItemProps: {
          rules: [{ required: true }],
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        valueType: 'radio',
        request: () => queryDict('sys_status'),
        render(_, row, index, action) {
          async function onUpdate(data: PostPartial) {
            await client.user.updateStatus.mutate(data)
            await action?.reload()
          }
          return <StatusSwitcher data={row} onUpdate={onUpdate} />
        },
      },
    ],
  })

  return <ProCrud {...crudProps} />
}
