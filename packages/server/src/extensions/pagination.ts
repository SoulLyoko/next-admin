import type { PageResult } from '../utils'
import { Prisma } from '@prisma/client'

export interface PaginationConfig {
  /**
   * default pageSize
   * @defaultValue 10
   */
  pageSize?: number
}

export function pagination(config?: PaginationConfig) {
  const { pageSize: defaultPageSize = 10 } = config ?? {}
  return Prisma.defineExtension({
    name: 'prisma-extension-pagination',
    model: {
      $allModels: {
        async pagination<T, A>(
          this: T,
          args?: Prisma.Exact<A, Omit<Prisma.Args<T, 'findMany'>, 'take' | 'skip'>>,
        ): Promise<PageResult<Prisma.Result<T, A, 'findMany'>>> {
          const ctx: any = Prisma.getExtensionContext(this)
          const { where: whereArgs, ...restArgs } = args as any
          const { current = 1, pageSize = defaultPageSize, ...where } = whereArgs as any

          const data = await ctx.findMany({
            take: pageSize,
            skip: pageSize * (current - 1),
            where,
            ...restArgs,
          })
          const total = await ctx.count({ where })

          return { data, total, success: true }
        },
      },
    },
  })
}
