'use client'
import type { MenuPartialWithRelations } from '@app/db/zod'
import type { CrudInstance } from '~/components/pro-crud'
import { client } from '~/trpc/client'

type Menu = MenuPartialWithRelations

export default function SysMenu() {
  const queryDict = client.dict.data.query
  const getMenuTree = client.menu.tree.query

  const crudRef = useRef<CrudInstance<Menu>>(undefined)
  const crudProps = defineProCrudProps<Menu>({
    crudRef,
    rowKey: 'id',
    request: params => getMenuTree(params).then(data => ({ data, success: true })),
    create: client.menu.create.mutate,
    update: client.menu.update.mutate,
    delete: client.menu.delete.mutate,
    batchDelete: client.menu.delete.mutate,
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
        title: '路径',
        dataIndex: 'path',
      },
      {
        title: '图标',
        dataIndex: 'icon',
        render(_, row) {
          return <Icon icon={row.icon!} />
        },
        renderFormItem(schema, config, form) {
          const icon = form.getFieldValue('icon')
          return <IconSelect value={icon} onChange={e => form.setFieldValue('icon', e)} allowClear></IconSelect>
        },
      },
      {
        title: '排序',
        dataIndex: 'sort',
        valueType: 'digit',
      },
      {
        title: '上级',
        dataIndex: 'parentId',
        valueType: 'treeSelect',
        fieldProps: {
          fieldNames: { label: 'name', value: 'id' },
        },
        request: getMenuTree,
        render(_, row) {
          return row.parent?.name
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        valueType: 'radio',
        request: () => queryDict('sys_status'),
        render(_, row, index, action) {
          async function onUpdate(data: Menu) {
            await client.menu.updateStatus.mutate(data)
            await action?.reload()
          }
          return <StatusSwitcher data={row} onUpdate={onUpdate} />
        },
      },
    ],
  })

  return <ProCrud {...crudProps} />
}
