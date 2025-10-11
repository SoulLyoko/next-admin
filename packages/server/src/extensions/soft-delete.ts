import type { Config } from 'prisma-extension-soft-delete'
import type { $ZodObjectDef } from 'zod/v4/core'
import * as schemas from '@app/db/zod'
import { Prisma } from '@prisma/client'
import { createSoftDeleteExtension } from 'prisma-extension-soft-delete'

export type SoftDeleteConfig = Config

export function softDelete(config?: SoftDeleteConfig) {
  const { models, defaultConfig } = config ?? {}

  const defaultModels: typeof models = {}
  Object.keys(Prisma.ModelName).forEach((name) => {
    const def = schemas[`${name}Schema` as keyof typeof schemas].def as $ZodObjectDef
    const enabled = Object.keys(def.shape).includes(defaultConfig?.field ?? 'deleted')
    if (enabled)
      defaultModels[name as Prisma.ModelName] = true
  })

  return createSoftDeleteExtension({
    models: {
      ...defaultModels,
      ...models,
    },
    defaultConfig,
  })
}
