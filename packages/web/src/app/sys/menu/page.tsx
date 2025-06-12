'use client'
import type { MenuPartialWithRelations } from '@app/db/zod'
import type { CrudInstance } from '~/components/pro-crud'
import { api } from '~/trpc/react'

type Menu = MenuPartialWithRelations

export default function SysMenu() {
  const getMenuTree = api.useUtils().menu.tree.fetch

  const crudRef = useRef<CrudInstance<Menu>>(undefined)
  const crudProps = defineProCrudProps<Menu>({
    crudRef,
    rowKey: 'id',
    request: params => getMenuTree(params).then(data => ({ data, success: true })),
    create: api.dept.create.useMutation().mutateAsync,
    update: api.dept.update.useMutation().mutateAsync,
    delete: api.dept.delete.useMutation().mutateAsync,
    batchDelete: api.dept.delete.useMutation().mutateAsync,
    optionBefore: (dom, row) => <a onClick={() => crudRef.current?.onAdd({ parentId: row.id })}>新增下级</a>,
    rowSelection: {},
    columns: [
      {
        title: '名称',
        dataIndex: 'name',
        formItemProps: {
          rules: [{ required: true }],
        },
      },
      {
        title: '路径',
        dataIndex: 'path',
        search: false,
      },
      {
        title: '图标',
        dataIndex: 'icon',
        search: false,
      },
      {
        title: '上级',
        dataIndex: 'parentId',
        valueType: 'treeSelect',
        search: false,
        fieldProps: {
          fieldNames: { label: 'name', value: 'id' },
        },
        request: getMenuTree,
        render(dom, row) {
          return row.parent?.name
        },
      },
    ],
  })

  return <ProCrud {...crudProps} />
}
