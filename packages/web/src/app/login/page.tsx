'use client'
import { LoginFormPage, ProFormText } from '@ant-design/pro-components'
import { Divider } from 'antd'
import { signIn } from 'next-auth/react'
import { APP_LOGO, APP_TITLE } from '~/constants/app'

export default function Login() {
  function onSubmit(type: string | any, form?: any) {
    return signIn(type, { ...form, redirectTo: '/' })
  }

  return (
    <LoginFormPage
      logo={APP_LOGO}
      title={APP_TITLE}
      subTitle="用户登录"
      backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
      containerStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
      onFinish={form => onSubmit('credentials', form)}
      actions={(
        <div className="flex-center flex-col">
          <Divider>其他登录方式</Divider>
          <div className="flex gap-2">
            <a onClick={() => onSubmit('wechat')}>
              <img className="size-32px" src="/wechat.svg" alt="wechat" />
            </a>
            <a onClick={() => onSubmit('github')}>
              <img className="size-32px" src="/github.svg" alt="github" />
            </a>
          </div>
        </div>
      )}
    >
      <ProFormText name="name" label="用户名" rules={[{ required: true }]}></ProFormText>
      <ProFormText.Password name="password" label="密码" rules={[{ required: true }]}></ProFormText.Password>
      <div className="mb-5 text-right">
        <a href="/signup">注册</a>
      </div>
    </LoginFormPage>
  )
}
