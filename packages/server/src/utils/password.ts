import crypto from 'node:crypto'

export function hashPassword(password: string) {
  return crypto.hash('md5', password)
}
