'use client'
import { api, type RouterOutputs } from '~/trpc/react'

type Role = Partial<RouterOutputs['role']['page']['data'][number]>

export default function SysRole() {
  const crudProps = defineProCrudProps<Role>({
    rowKey: 'id',
    request: api.useUtils().role.page.fetch,
    create: api.role.create.useMutation().mutateAsync,
    update: api.role.update.useMutation().mutateAsync,
    delete: api.role.delete.useMutation().mutateAsync,
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
        request: api.useUtils().menu.tree.fetch,
        render(dom, row) {
          return row.menus?.map(e => e.menu?.name)?.join(' | ')
        },
      },
    ],
  })

  return <ProCrud {...crudProps} />
}
