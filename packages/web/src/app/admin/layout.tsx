import { auth } from '@app/server'
import { redirect } from 'next/navigation'
import Layout from '~/components/layout'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session)
    redirect('/api/auth/signin')

  return (
    <Layout user={session.user}>
      {children}
    </Layout>
  )
}
