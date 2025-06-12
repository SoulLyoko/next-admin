'use client'
import type { DictPartialWithRelations } from '@app/db/zod'
import type { CrudInstance } from '~/components/pro-crud'
import { api } from '~/trpc/react'

type Dict = DictPartialWithRelations

export default function SysDict() {
  const getDictTree = api.useUtils().dict.tree.fetch

  const crudRef = useRef<CrudInstance<Dict>>(undefined)
  const crudProps = defineProCrudProps<Dict>({
    crudRef,
    rowKey: 'id',
    request: params => getDictTree(params).then(data => ({ data, success: true })),
    create: api.dict.create.useMutation().mutateAsync,
    update: api.dict.update.useMutation().mutateAsync,
    delete: api.dict.delete.useMutation().mutateAsync,
    batchDelete: api.dict.delete.useMutation().mutateAsync,
    optionBefore: (dom, row) => <a onClick={() => crudRef.current?.onAdd({ parentId: row.id })}>新增下级</a>,
    rowSelection: {},
    columns: [
      {
        title: '字典名称',
        dataIndex: 'label',
        formItemProps: {
          rules: [{ required: true }],
        },
      },
      {
        title: '字典值',
        dataIndex: 'value',
        search: false,
        formItemProps: {
          rules: [{ required: true }],
        },
        render(dom, row) {
          return row.parentId ? row.value : <ATypography.Text copyable>{row.value}</ATypography.Text>
        },
      },
      {
        title: '上级',
        dataIndex: 'parentId',
        search: false,
        valueType: 'treeSelect',
        fieldProps: {
          fieldNames: { value: 'id' },
        },
        request: getDictTree,
        render(dom, row) {
          return row.parent?.label
        },
      },
    ],
  })

  return <ProCrud {...crudProps} />
}
