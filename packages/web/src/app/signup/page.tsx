import { signIn } from '@app/server'
import { redirect } from 'next/navigation'
import { ZodError } from 'zod'
import { api, HydrateClient } from '~/trpc/server'

export default async function SignUp(props: { searchParams: Promise<{ error: string }> }) {
  const { error } = await props.searchParams

  async function onSubmit(e: FormData) {
    'use server'
    const name = e.get('name') as string
    const password = e.get('password') as string

    const data = { name, password }
    try {
      await api.user.signup(data)
      await signIn('credentials', data)
    }
    catch (error: any) {
      const msg = error.cause instanceof ZodError ? 'Invalid credentials.' : error.message
      redirect(`/signup?error=${msg}`)
    }
  }

  return (
    <HydrateClient>
      <div className="min-h-screen flex justify-center items-center bg-dark">
        <div className="bg-black rd-2xl py-5 px-8 c-white w-xs">
          {error && (
            <div className="c-white bg-red px-4 py-2 rd mb-4">
              Sign up failed.
              {' '}
              {error}
            </div>
          )}
          <form action={onSubmit}>
            <div>
              <label className="block mb-1">name</label>
              <input className="px-4 bg-transparent b-1 b-solid b-gray/50 rd-lg py-1 mb-2 w-full" name="name" type="text" placeholder="" />
            </div>
            <div>
              <label className="block mb-1">password</label>
              <input className="bg-transparent b-1 b-solid b-gray/50 rd-lg px-4 py-1 mb-2 w-full" name="password" type="password" placeholder="" />
            </div>
            <button className="bg-dark px-4 rd-lg w-full py-3 text-center my-2" type="submit">Sign up</button>
          </form>
        </div>
      </div>
    </HydrateClient>
  )
}
