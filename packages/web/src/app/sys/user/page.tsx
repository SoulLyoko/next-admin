'use client'
import type { RouterOutputs } from '~/trpc/react'
import { api } from '~/trpc/react'

type User = Partial<RouterOutputs['user']['page']['data'][number]>

export default function SysUser() {
  const getDict = api.useUtils().dict.data.fetch

  const crudProps = defineProCrudProps<User>({
    rowKey: 'id',
    request: api.useUtils().user.page.fetch,
    create: api.user.create.useMutation().mutateAsync,
    update: api.user.update.useMutation().mutateAsync,
    delete: api.user.delete.useMutation().mutateAsync,
    columns: [
      {
        title: '姓名',
        dataIndex: 'name',
        formItemProps: {
          rules: [{ required: true }],
        },
      },
      {
        title: '性别',
        dataIndex: 'sex',
        search: false,
        valueType: 'treeSelect',
        request: () => getDict('sex'),
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        search: false,
      },
      {
        title: '部门',
        dataIndex: 'deptIds',
        search: false,
        valueType: 'treeSelect',
        fieldProps: {
          multiple: true,
          fieldNames: { label: 'name', value: 'id' },
        },
        request: api.useUtils().dept.tree.fetch,
        render(dom, row) {
          return row.depts?.map(e => e.dept?.name)?.join(',')
        },
      },
      {
        title: '岗位',
        dataIndex: 'postIds',
        search: false,
        valueType: 'select',
        fieldProps: {
          mode: 'multiple',
          fieldNames: { label: 'name', value: 'id' },
        },
        request: api.useUtils().post.list.fetch,
        render(dom, row) {
          return row.posts?.map(e => e.post?.name)?.join(',')
        },
      },
      {
        title: '角色',
        dataIndex: 'roleIds',
        search: false,
        valueType: 'select',
        fieldProps: {
          mode: 'multiple',
          fieldNames: { label: 'name', value: 'id' },
        },
        request: api.useUtils().role.list.fetch,
        render(dom, row) {
          return row.roles?.map(e => e.role?.name)?.join(',')
        },
      },
    ],
  })

  return <ProCrud {...crudProps} />
}
