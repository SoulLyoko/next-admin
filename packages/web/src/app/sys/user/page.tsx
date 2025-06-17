'use client'
import type { CrudInstance } from '~/components/pro-crud'
import type { RouterOutputs } from '~/trpc/react'
import { api } from '~/trpc/react'

type User = Partial<RouterOutputs['user']['page']['data'][number]>

export default function SysUser() {
  const getDict = api.useUtils().dict.data.fetch

  const crudRef = useRef<CrudInstance>(undefined)
  const crudProps = defineProCrudProps<User>({
    crudRef,
    rowKey: 'id',
    request: api.useUtils().user.page.fetch,
    create: api.user.create.useMutation().mutateAsync,
    update: api.user.update.useMutation().mutateAsync,
    delete: api.user.delete.useMutation().mutateAsync,
    columns: [
      {
        title: '头像',
        dataIndex: 'image',
      },
      {
        title: '姓名',
        dataIndex: 'nickname',
        search: true,
      },
      {
        title: '用户名',
        dataIndex: 'name',
        search: true,
        formItemProps: {
          rules: [{ required: true }],
        },
      },
      {
        title: '密码',
        dataIndex: 'password',
        valueType: 'dependency',
        hideInTable: true,
        name: [],
        columns() {
          const formType = crudRef.current?.formType
          if (formType === 'add') {
            return [{
              title: '密码',
              valueType: 'password',
              formItemProps: { rules: [{ required: true }] },
            }]
          }
          else {
            return []
          }
        },
      },
      {
        title: '性别',
        dataIndex: 'sex',
        valueType: 'treeSelect',
        request: () => getDict('sex'),
      },
      {
        title: '手机号',
        dataIndex: 'phone',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '部门',
        dataIndex: 'deptIds',
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
