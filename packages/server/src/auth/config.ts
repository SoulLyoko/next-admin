import type { DefaultSession, NextAuthConfig, User } from 'next-auth'
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
    user: {
      id: string
      // ...other properties
      // role: UserRole;
    } & DefaultSession['user']
  }

  interface User {
    // ...other properties
    // role: UserRole;
    sessionToken?: string
  }
}

export const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

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
  callbacks: {
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
    jwt({ token, user }) {
      if (user) {
        token.id = token.sub
        token.sessionToken = user.sessionToken
      }
      return token
    },
  },
  session: {
    strategy: 'jwt',
  },
  events: {
    async signIn(message) {
      const { user } = message
      const sessionToken = randomUUID()
      user.sessionToken = sessionToken
      await db.session.create({
        data: { userId: user.id!, expires, sessionToken },
      })
    },
    async signOut(message) {
      const { token } = message as { token: JWT & User }
      if (token?.sessionToken) {
        await db.session.delete({ where: { sessionToken: token.sessionToken } })
      }
    },
  },
} satisfies NextAuthConfig
