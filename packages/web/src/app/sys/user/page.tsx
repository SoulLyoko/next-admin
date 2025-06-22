'use client'
import type { UploadProps } from 'antd'
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
        valueType: 'image',
        renderFormItem(schema, config, form) {
          const image = form.getFieldValue('image')
          const handleChange: UploadProps['onChange'] = async (info) => {
            const url = await getFileBase64(info.file.originFileObj!)
            form.setFieldValue('image', url)
          }
          return (
            <AUpload listType="picture-circle" showUploadList={false} onChange={handleChange}>
              {image ? <img src={image} alt="avatar" /> : <Icon icon="ant-design:plus-outlined" />}
            </AUpload>
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
        search: true,
        name: [],
        columns() {
          const formType = crudRef.current?.formType
          return [{
            title: '用户名',
            dataIndex: 'name',
            formItemProps: { rules: [{ required: true }] },
            fieldProps: { disabled: formType !== 'add' },
          }]
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
      },
    ],
  })

  return <ProCrud {...crudProps} />
}
