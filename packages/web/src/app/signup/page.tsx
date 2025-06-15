'use client'
import { signIn } from 'next-auth/react'
import { api } from '~/trpc/react'

export default function Signup() {
  const signup = api.auth.signup.useMutation().mutateAsync
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
      onFinish={onSubmit}
    >
      <ProFormText name="name" label="用户名" rules={[{ required: true }]}></ProFormText>
      <ProFormText.Password name="password" label="密码" rules={[{ required: true }]}></ProFormText.Password>
    </ProLoginFormPage>
  )
}
