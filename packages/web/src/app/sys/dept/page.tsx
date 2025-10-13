'use client'
import type { DeptPartialWithRelations } from '@app/db/zod'
import type { CrudInstance } from '~/components'
import { useRef } from 'react'
import { defineProCrudProps, ProCrud, StatusSwitcher } from '~/components'
import { client } from '~/trpc/client'

type Dept = DeptPartialWithRelations

export default function SysDept() {
  const queryDict = client.dict.data.query
  const getDeptTree = client.dept.tree.query

  const crudRef = useRef<CrudInstance<Dept>>(undefined)
  const crudProps = defineProCrudProps<Dept>({
    crudRef,
    rowKey: 'id',
    request: params => getDeptTree(params).then(data => ({ data, success: true })),
    create: client.dept.create.mutate,
    update: client.dept.update.mutate,
    delete: client.dept.delete.mutate,
    batchDelete: client.dept.delete.mutate,
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
      {
        title: '状态',
        dataIndex: 'status',
        valueType: 'radio',
        request: () => queryDict('sys_status'),
        render(_, row, index, action) {
          async function onUpdate(data: Dept) {
            await client.dept.updateStatus.mutate(data)
            await action?.reload()
          }
          return <StatusSwitcher data={row} onUpdate={onUpdate} />
        },
      },
    ],
  })

  return <ProCrud {...crudProps} />
}
