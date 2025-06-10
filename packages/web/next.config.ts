import type { NextConfig } from 'next'
import AutoImport from './plugins/auto-import'

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import './src/env.js'

export default {
  webpack(config: any) {
    config.plugins.push(AutoImport())
    return config
  },
} satisfies NextConfig
