/* eslint-disable node/prefer-global/process */
type ProcessEnv = typeof process.env
export function getEnv(): ProcessEnv {
  return process.env
}
