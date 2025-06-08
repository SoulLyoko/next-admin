'use client'
import type { ProColumns } from '@ant-design/pro-components'
import ProCrud from '~/components/pro-crud'
import { api } from '~/trpc/react'

export default function Post() {
  const createPost = api.post.create.useMutation().mutateAsync
  const updatePost = api.post.update.useMutation().mutateAsync
  const deletePost = api.post.delete.useMutation().mutateAsync
  const getPostPage = api.useUtils().post.page.fetch

  const columns: ProColumns[] = [
    {
      title: '名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '此项为必填项' }],
      },
    },
  ]

  return (
    <ProCrud
      rowKey="id"
      columns={columns}
      request={getPostPage}
      create={createPost}
      update={updatePost}
      delete={deletePost}
      batchDelete={deletePost}
    />
  )
}
