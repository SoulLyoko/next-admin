'use client'
import type { ActionType, ProColumns, ProFormColumnsType } from '@ant-design/pro-components'
import type { RouterInputs, RouterOutputs } from '~/trpc/react'
import { PlusOutlined } from '@ant-design/icons'
import { BetaSchemaForm, ProTable } from '@ant-design/pro-components'
import { Button, Popconfirm } from 'antd'
import { useRef } from 'react'
import { api } from '~/trpc/react'

type DataType = RouterOutputs['user']['page']['data'][number]
type ParamsType = RouterInputs['user']['page']

export default function User() {
  const createUser = api.user.create.useMutation().mutateAsync
  const updateUser = api.user.update.useMutation().mutateAsync
  const deleteUser = api.user.delete.useMutation().mutateAsync
  const getUserPage = api.useUtils().user.page.fetch

  const actionRef = useRef<ActionType>(null)
  const reload = () => actionRef.current?.reload()

  const formColumns: ProFormColumnsType<DataType>[] = [
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
    },
  ]

  const tableColumns: ProColumns<DataType>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (_, record) => [
        <BetaSchemaForm<DataType>
          initialValues={record}
          trigger={<a>编辑</a>}
          title="编辑"
          layoutType="ModalForm"
          modalProps={{ destroyOnHidden: true, forceRender: true }}
          onFinish={async (form) => {
            await updateUser({ ...record, ...form })
            reload()
            return true
          }}
          columns={formColumns}
        />,
        <Popconfirm
          title="删除"
          description="确认删除吗?"
          onConfirm={async () => {
            await deleteUser({ id: record.id })
            reload()
          }}
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ]

  return (
    <ProTable<DataType, ParamsType>
      actionRef={actionRef}
      rowKey="id"
      columns={tableColumns}
      request={getUserPage}
      toolbar={{
        menu: {
          items: [{
            key: 'add',
            label: (
              <BetaSchemaForm<DataType>
                trigger={<Button type="primary" icon={<PlusOutlined />}>新增</Button>}
                title="新增"
                layoutType="ModalForm"
                modalProps={{ destroyOnHidden: true, forceRender: true }}
                onFinish={async (form) => {
                  await createUser(form)
                  reload()
                  return true
                }}
                columns={formColumns}
              />
            ),
          }],
        },
      }}
    // editable={{
    //   type: 'multiple',
    //   onSave: (id, data) => id ? updateUser(data) : createUser(data),
    //   onDelete: id => deleteUser({ id: id as string }),
    // }}
    />
  )
}
