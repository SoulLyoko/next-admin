import CredentialsProvider from 'next-auth/providers/credentials'
import { z } from 'zod'
import { db } from '../db'
import { hashPassword } from '../utils'

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
    const user = await db.user.findFirst({ where: { name, password: hashPassword(password) } })
    return user
  },
})
