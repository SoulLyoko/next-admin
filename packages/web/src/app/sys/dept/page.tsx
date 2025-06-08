'use client'
import type { ProColumns } from '@ant-design/pro-components'
import type { RouterOutputs } from '~/trpc/react'
import ProCrud from '~/components/pro-crud'
import { api } from '~/trpc/react'

type DeptVO = RouterOutputs['dept']['treeList']['data'][number]

export default function Dept() {
  const createDept = api.dept.create.useMutation().mutateAsync
  const updateDept = api.dept.update.useMutation().mutateAsync
  const deleteDept = api.dept.delete.useMutation().mutateAsync
  const getDeptTreeList = api.useUtils().dept.treeList.fetch
  const getDeptTree = api.useUtils().dept.tree.fetch

  const columns: ProColumns<DeptVO>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '此项为必填项' }],
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
      render(dom, entity) {
        return entity.parent?.name
      },
    },
  ]

  return (
    <ProCrud
      rowKey="id"
      columns={columns}
      request={getDeptTreeList}
      create={createDept}
      update={updateDept}
      delete={deleteDept}
    />
  )
}
