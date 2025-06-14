import { randomUUID } from 'node:crypto'
// import { AuthError } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { z } from 'zod'
import { db } from '../db'

const signInSchema = z.object({
  name: z.string({ required_error: 'Name is required' })
    .min(1, 'Name is required'),
  password: z.string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
})

export default CredentialsProvider({
  credentials: {
    name: { type: 'text' },
    password: { type: 'password' },
  },
  async authorize(credentials) {
    const { name, password } = await signInSchema.parseAsync(credentials)

    let user = null

    user = await db.user.findFirst({ where: { name, password } })

    if (!user) {
      // throw new AuthError('Sign in failed. Check the name and password fields are correct')
      return null
    }

    const sessionToken = randomUUID()
    await db.session.create({
      data: {
        userId: user.id,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        sessionToken,
      },
    })
    return { ...user, sessionToken }
  },
})
