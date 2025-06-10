import { auth } from '@app/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session)
    redirect('/api/auth/signin')

  return (
    <LayoutDefault>
      {children}
    </LayoutDefault>
  )
}
