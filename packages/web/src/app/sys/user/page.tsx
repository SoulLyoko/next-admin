'use client'
import type { UploadProps } from 'antd'
import type { CrudInstance } from '~/components/pro-crud'
import type { RouterOutputs } from '~/trpc/client'
import { Icon } from '@iconify/react'
import { Upload } from 'antd'
import { useRef } from 'react'
import { StatusSwitcher } from '~/components'
import { defineProCrudProps, ProCrud } from '~/components/pro-crud'
import { client } from '~/trpc/client'
import { getFileBase64 } from '~/utils/file'

type User = Partial<RouterOutputs['user']['page']['data'][number]>

export default function SysUser() {
  const queryDict = client.dict.data.query

  const crudRef = useRef<CrudInstance>(undefined)
  const crudProps = defineProCrudProps<User>({
    crudRef,
    rowKey: 'id',
    request: client.user.page.query,
    create: client.user.create.mutate,
    update: client.user.update.mutate,
    delete: client.user.delete.mutate,
    columns: [
      {
        title: '头像',
        dataIndex: 'image',
        valueType: 'image',
        fieldProps: {
          className: 'rd-full',
        },
        renderFormItem(schema, config, form) {
          const image = form.getFieldValue('image')
          const onChange: UploadProps['onChange'] = async (info) => {
            const url = await getFileBase64(info.file.originFileObj!)
            form.setFieldValue('image', url)
          }
          return (
            <Upload listType="picture-circle" showUploadList={false} onChange={onChange}>
              {image ? <img src={image} alt="avatar" className="rd-full" /> : <Icon icon="ant-design:plus-outlined" />}
            </Upload>
          )
        },
      },
      {
        title: '姓名',
        dataIndex: 'nickname',
        search: true,
      },
      {
        title: '用户名',
        dataIndex: 'name',
        valueType: 'dependency',
        name: [],
        search: true,
        columns() {
          const formType = crudRef.current?.formType
          return [{
            title: '用户名',
            dataIndex: 'name',
            formItemProps: { rules: [{ required: formType === 'add' }] },
            fieldProps: { disabled: formType === 'edit' },
          }]
        },
      },
      {
        title: '密码',
        dataIndex: 'password',
        hideInTable: true,
        valueType: 'dependency',
        name: [],
        columns() {
          const formType = crudRef.current?.formType
          return formType === 'add'
            ? [{
                title: '密码',
                valueType: 'password',
                formItemProps: { rules: [{ required: true }] },
              }]
            : []
        },
      },
      {
        title: '性别',
        dataIndex: 'sex',
        valueType: 'select',
        request: () => queryDict('sys_user_sex'),
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
        request: client.dept.treeSelect.query,
      },
      {
        title: '岗位',
        dataIndex: 'postIds',
        valueType: 'select',
        fieldProps: {
          mode: 'multiple',
          fieldNames: { label: 'name', value: 'id' },
        },
        request: client.post.list.query,
      },
      {
        title: '角色',
        dataIndex: 'roleIds',
        valueType: 'select',
        fieldProps: {
          mode: 'multiple',
          fieldNames: { label: 'name', value: 'id' },
        },
        request: client.role.list.query,
      },
      {
        title: '状态',
        dataIndex: 'status',
        valueType: 'radio',
        request: () => queryDict('sys_status'),
        render(_, row, index, action) {
          async function onUpdate(data: User) {
            await client.user.updateStatus.mutate(data)
            await action?.reload()
          }
          return <StatusSwitcher data={row} onUpdate={onUpdate} />
        },
      },
    ],
  })

  return <ProCrud {...crudProps} />
}
