'use client'
import type { DictPartialWithRelations } from '@app/db/zod'
import type { CrudInstance } from '~/components/pro-crud'
import { client } from '~/trpc/client'

type Dict = DictPartialWithRelations

export default function SysDict() {
  const queryDict = client.dict.data.query
  const getDictTree = client.dict.tree.query

  const crudRef = useRef<CrudInstance<Dict>>(undefined)
  const crudProps = defineProCrudProps<Dict>({
    crudRef,
    rowKey: 'id',
    request: params => getDictTree(params).then(data => ({ data, success: true })),
    create: client.dict.create.mutate,
    update: client.dict.update.mutate,
    delete: client.dict.delete.mutate,
    batchDelete: client.dict.delete.mutate,
    optionBefore: (dom, row) => <a onClick={() => crudRef.current?.onAdd({ parentId: row.id })}>新增下级</a>,
    rowSelection: {},
    columns: [
      {
        title: '字典名称',
        dataIndex: 'label',
        search: true,
        formItemProps: {
          rules: [{ required: true }],
        },
      },
      {
        title: '字典值',
        dataIndex: 'value',
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
        valueType: 'treeSelect',
        search: true,
        fieldProps: {
          fieldNames: { value: 'id' },
        },
        request: getDictTree,
        render(dom, row) {
          return row.parent?.label
        },
      },
      {
        title: '排序',
        dataIndex: 'sort',
        valueType: 'digit',
        fieldProps: {
          className: 'w-full',
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        valueType: 'radio',
        request: () => queryDict('sys_status'),
        render(_, row, index, action) {
          async function onUpdate(data: Dict) {
            await client.dict.updateStatus.mutate(data)
            await action?.reload()
          }
          return <StatusSwitcher data={row} onUpdate={onUpdate} />
        },
      },
    ],
  })

  return <ProCrud {...crudProps} />
}
