import type { DefaultSession, NextAuthConfig } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import { randomUUID } from 'node:crypto'
import { env } from 'node:process'

import { PrismaAdapter } from '@auth/prisma-adapter'
import Github from 'next-auth/providers/github'
import Wechat from 'next-auth/providers/wechat'
import { db } from '../db'
import Credentials from './credentials'

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: User
  }
  interface User {}
}

const sessionMaxAge = 24 * 60 * 60 * 1000 // 1 day
const getExpires = () => new Date(Date.now() + sessionMaxAge)

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    Credentials,
    Wechat({
      clientId: env.AUTH_WECHAT_APP_ID,
      clientSecret: env.AUTH_WECHAT_APP_SECRET,
    }),
    Github,
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  adapter: PrismaAdapter(db),
  debug: env.NODE_ENV === 'development',
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: sessionMaxAge,
  },
  callbacks: {
    async jwt(params) {
      const { token, user, trigger } = params
      token.picture = '' // base64 to large
      if (token.sessionToken) {
        const exists = await db.session.findFirst({ where: { sessionToken: token.sessionToken, expires: { gt: new Date() } } })
        if (!exists)
          return null
      }
      else if (trigger) {
        const sessionToken = randomUUID()
        await db.session.create({ data: { userId: user.id!, expires: getExpires(), sessionToken } })
        token.sessionToken = sessionToken
      }
      return token
    },
    async session(params) {
      const { session, token } = params
      if (token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
  events: {
    async signOut(message) {
      const { token: { sessionToken } } = message as { token: JWT & { sessionToken?: string } }
      if (sessionToken) {
        await db.session.delete({ where: { sessionToken } })
      }
    },
  },
} satisfies NextAuthConfig
