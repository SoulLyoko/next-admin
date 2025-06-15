'use client'
import { signIn } from 'next-auth/react'

export default function Login() {
  async function onSubmit(typeOrForm?: string | any) {
    const type = typeof typeOrForm === 'string' ? typeOrForm : 'credentials'
    const form = typeof typeOrForm === 'object' ? typeOrForm : undefined
    return signIn(type, { ...form, redirectTo: '/' })
  }

  return (
    <ProLoginFormPage
      logo="/favicon.ico"
      title="Admin"
      subTitle="用户登录"
      backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
      onFinish={onSubmit}
      actions={(
        <div className="flex-center flex-col">
          <ADivider>其他登录方式</ADivider>
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
    </ProLoginFormPage>
  )
}
