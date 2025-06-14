'use client'
import type { DeptPartialWithRelations } from '@app/db/zod'
import type { CrudInstance } from '~/components/pro-crud'
import { api } from '~/trpc/react'

type Dept = DeptPartialWithRelations

export default function SysDept() {
  const getDeptTree = api.useUtils().dept.tree.fetch

  const crudRef = useRef<CrudInstance<Dept>>(undefined)
  const crudProps = defineProCrudProps<Dept>({
    crudRef,
    rowKey: 'id',
    request: params => getDeptTree(params).then(data => ({ data, success: true })),
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
        search: true,
        formItemProps: {
          rules: [{ required: true }],
        },
      },
      {
        title: '上级',
        dataIndex: 'parentId',
        valueType: 'treeSelect',
        fieldProps: {
          fieldNames: { label: 'name', value: 'id' },
        },
        request: getDeptTree,
        render(dom, row) {
          return row.parent?.name
        },
      },
    ],
  })

  return <ProCrud {...crudProps} />
}
