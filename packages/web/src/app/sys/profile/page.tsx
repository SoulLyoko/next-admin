'use client'
import type { UploadProps } from 'antd'
import { message } from 'antd'
import { client } from '~/trpc/client'
import { api } from '~/trpc/react'

export default function SysProfile() {
  const { data: user, isFetching, refetch } = api.user.info.useQuery()
  const { mutateAsync: updateInfo } = api.user.updateInfo.useMutation()
  const { mutateAsync: updatePassword } = api.user.updatePassword.useMutation()
  const queryDict = client.dict.data.query

  const handleChange: UploadProps['onChange'] = async (info) => {
    const url = await getFileBase64(info.file.originFileObj!)
    await updateInfo({ image: url })
    refetch()
  }

  const sexIconMap: Record<string, any> = {
    1: <Icon icon="ant-design:man-outlined" />,
    0: <Icon icon="ant-design:woman-outlined" />,
    unknown: <Icon icon="ant-design:question-circle-outlined" />,
  }

  return (
    <div className="p-5 flex gap-5">
      <ACard className="w-xs" loading={isFetching}>
        <div className="flex-center flex-col">
          <AUpload listType="picture-circle" showUploadList={false} onChange={handleChange}>
            {user?.image ? <img src={user.image} alt="avatar" className="rd-full" /> : <Icon icon="ant-design:plus-outlined" />}
          </AUpload>
          <div className="text-lg font-bold mt-2">
            {user?.nickname}
          </div>
          <ADivider></ADivider>
        </div>
        <ProBetaSchemaForm
          initialValues={user ?? {}}
          layout="horizontal"
          colon={false}
          submitter={false}
          readonly
          columns={[
            { title: <Icon icon="ant-design:user-outlined" />, dataIndex: 'name' },
            { title: <Icon icon="ant-design:mail-outlined" />, dataIndex: 'email' },
            { title: sexIconMap[user?.sex ?? ''] ?? sexIconMap.unknown, dataIndex: 'sex', valueType: 'select', request: () => queryDict('sex') },
            { title: <Icon icon="ant-design:cluster-outlined" />, dataIndex: 'depts', render: () => user?.depts?.map(e => e.dept.name).join(',') },
            { title: <Icon icon="ant-design:idcard-outlined" />, dataIndex: 'posts', render: () => user?.posts?.map(e => e.post.name).join(',') },
            { title: <Icon icon="ant-design:user-add-outlined" />, dataIndex: 'roles', render: () => user?.roles?.map(e => e.role.name).join(',') },
          ]}
        />
      </ACard>

      <div className="flex flex-1 flex-col gap-5">
        <ACard loading={isFetching} title="基本信息">
          <ProBetaSchemaForm
            initialValues={user ?? {}}
            layout="horizontal"
            onFinish={async (form: any) => {
              await updateInfo(form)
              refetch()
            }}
            columns={[
              { title: '姓名', dataIndex: 'nickname' },
              { title: '邮箱', dataIndex: 'email' },
              { title: '性别', dataIndex: 'sex', valueType: 'select', request: () => queryDict('sex') },
            ]}
          />
        </ACard>
        <ACard title="修改密码" loading={isFetching}>
          <ProBetaSchemaForm
            layout="horizontal"
            onFinish={async (form: any) => {
              if (form.newPassword !== form.confirmPassword) {
                message.error('新密码与确认密码不一致')
                return
              }
              await updatePassword(form)
            }}
            columns={[
              {
                title: '旧密码',
                dataIndex: 'oldPassword',
                valueType: 'password',
                formItemProps: { rules: [{ required: true }] },
              },
              {
                title: '新密码',
                dataIndex: 'newPassword',
                valueType: 'password',
                formItemProps: { rules: [{ required: true }] },
              },
              {
                title: '确认密码',
                dataIndex: 'confirmPassword',
                valueType: 'password',
                formItemProps: { rules: [{ required: true }] },
              },
            ]}
          />
        </ACard>
      </div>

    </div>
  )
}
