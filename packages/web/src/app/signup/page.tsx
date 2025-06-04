'use client'
import type { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { api } from '~/trpc/react'

export default function SignUp() {
  const router = useRouter()
  const signupMutation = api.user.signup.useMutation()
  const [msg, setMsg] = useState()

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const [name = { value: '' }, password = { value: '' }] = e.target as unknown as { value: string }[]
    const data = { name: name.value, password: password.value }
    setMsg(undefined)
    signupMutation
      .mutateAsync(data)
      .then(() => router.push('/api/auth/signin'))
      .catch(err => setMsg(err.message))
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-dark">
      <div className="bg-black rd-2xl py-5 px-8 c-#fff w-xs">
        <form onSubmit={onSubmit}>
          <div>
            <label className="block mb-1">name</label>
            <input className="px-4 bg-transparent b-1 b-solid b-gray/50 rd-lg py-2 mb-2 w-full" name="name" type="text" placeholder="" />
          </div>
          <div>
            <label className="block mb-1">password</label>
            <input className="bg-transparent b-1 b-solid b-gray/50 rd-lg px-4 py-2 mb-2 w-full" name="password" type="password" placeholder="" />
          </div>
          <button className="bg-dark px-4 py-3 rd-lg w-full text-center my-2" type="submit">Sign up with Credentials</button>
          {msg && <div className="c-red">{msg}</div>}
        </form>
      </div>
    </div>
  )
}
