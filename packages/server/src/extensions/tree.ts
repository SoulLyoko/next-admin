import { Prisma } from '@prisma/client'

import { getTreeInclude } from '../utils'

export function tree() {
  return Prisma.defineExtension({
    name: 'prisma-extension-tree',
    model: {
      $allModels: {
        async findTree<T, A>(
          this: T,
          args?: Prisma.Exact<A, Prisma.Args<T, 'findMany'>>,
        ): Promise<Prisma.Result<T, A, 'findMany'>> {
          const ctx: any = Prisma.getExtensionContext(this)
          const { where, include, ...restArgs } = args ?? {} as any
          const data = await ctx.findMany({
            include: getTreeInclude(include),
            where: { parentId: null, ...where },
            ...restArgs,
          })
          return data
        },
      },
    },
  })
}
