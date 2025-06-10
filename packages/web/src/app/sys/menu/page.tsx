'use client'
import type { ProColumns } from '@ant-design/pro-components'
import type { RouterOutputs } from '~/trpc/react'
import { api } from '~/trpc/react'

type MenuVO = RouterOutputs['menu']['tree'][number]

export default function Menu() {
  const createMenu = api.menu.create.useMutation().mutateAsync
  const updateMenu = api.menu.update.useMutation().mutateAsync
  const deleteMenu = api.menu.delete.useMutation().mutateAsync
  const getMenuTree = api.useUtils().menu.tree.fetch
  const getMenuTreeList = (params: any) => getMenuTree(params).then(data => ({ data, success: true }))

  const columns: ProColumns<MenuVO>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '此项为必填项' }],
      },
    },
    {
      title: '路径',
      dataIndex: 'path',
    },
    {
      title: '图标',
      dataIndex: 'icon',
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
      render(dom, entity) {
        return entity.parent?.name
      },
    },
  ]

  return (
    <ProCrud
      rowKey="id"
      columns={columns}
      request={getMenuTreeList}
      create={createMenu}
      update={updateMenu}
      delete={deleteMenu}
    />
  )
}
