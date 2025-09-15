'use client'
import { signIn } from 'next-auth/react'
import { client } from '~/trpc/client'

export default function Signup() {
  const signup = client.auth.signup.mutate
  async function onSubmit(form?: any) {
    await signup(form)
    await signIn('credentials', { ...form, redirectTo: '/' })
  }

  return (
    <ProLoginFormPage
      logo="/favicon.ico"
      title="Admin"
      subTitle="用户注册"
      backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
      submitter={{ searchConfig: { submitText: '注册' } }}
      onFinish={onSubmit}
    >
      <ProFormText name="name" label="用户名" rules={[{ required: true }]}></ProFormText>
      <ProFormText.Password name="password" label="密码" rules={[{ required: true }]}></ProFormText.Password>
      <div className="mb-5 text-right">
        <a href="/login">登录</a>
      </div>
    </ProLoginFormPage>
  )
}
