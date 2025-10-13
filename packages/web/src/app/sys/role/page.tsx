'use client'
import type { RouterOutputs } from '~/trpc/client'
import { defineProCrudProps, ProCrud, StatusSwitcher } from '~/components'
import { client } from '~/trpc/client'

type Role = Partial<RouterOutputs['role']['page']['data'][number]>

export default function SysRole() {
  const queryDict = client.dict.data.query

  const crudProps = defineProCrudProps<Role>({
    rowKey: 'id',
    request: client.role.page.query,
    create: client.role.create.mutate,
    update: client.role.update.mutate,
    delete: client.role.delete.mutate,
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
        title: '菜单权限',
        dataIndex: 'menuIds',
        valueType: 'treeSelect',
        fieldProps: {
          multiple: true,
          fieldNames: { label: 'name', value: 'id' },
        },
        ellipsis: true,
        request: client.menu.tree.query,
        render(dom, row) {
          return row.menus?.map(e => e.menu?.name)?.join(' | ')
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        valueType: 'radio',
        request: () => queryDict('sys_status'),
        render(_, row, index, action) {
          async function onUpdate(data: Role) {
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
