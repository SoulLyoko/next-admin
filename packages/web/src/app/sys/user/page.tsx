'use client'
import type { ProColumns } from '@ant-design/pro-components'
import type { RouterOutputs } from '~/trpc/react'
import ProCrud from '~/components/pro-crud'

import { api } from '~/trpc/react'

type UserVO = RouterOutputs['user']['page']['data'][number] & {
  deptIds?: string[]
  roleIds?: string[]
  postIds?: string[]
}

export default function User() {
  const createUser = api.user.create.useMutation().mutateAsync
  const updateUser = api.user.update.useMutation().mutateAsync
  const deleteUser = api.user.delete.useMutation().mutateAsync
  const getUserPage = api.useUtils().user.page.fetch
  const getPostList = api.useUtils().post.list.fetch
  const getRoleList = api.useUtils().role.list.fetch
  const getDeptTree = api.useUtils().dept.tree.fetch

  const columns: ProColumns<UserVO>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '此项为必填项' }],
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      search: false,
    },
    {
      title: '部门',
      dataIndex: 'deptIds',
      valueType: 'treeSelect',
      fieldProps: {
        multiple: true,
        fieldNames: { label: 'name', value: 'id' },
      },
      request: getDeptTree,
      render(dom, entity) {
        return entity.depts?.map(e => e.dept?.name)?.join(',')
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
      request: getPostList,
      render(dom, entity) {
        return entity.posts?.map(e => e.post?.name)?.join(',')
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
      request: getRoleList,
      render(dom, entity) {
        return entity.roles?.map(e => e.role?.name)?.join(',')
      },
    },
  ]

  return (
    <ProCrud
      rowKey="id"
      columns={columns}
      request={getUserPage}
      create={createUser}
      update={updateUser}
      delete={deleteUser}
      batchDelete={deleteUser}
    />
  )
}
