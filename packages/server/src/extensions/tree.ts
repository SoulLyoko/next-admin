import { Prisma } from '@prisma/client'

interface FindTreeArgs {
  parent?: boolean | any
  children?: boolean | { include?: FindTreeArgs } | any
  level?: number
}

export function getTreeInclude(args?: FindTreeArgs) {
  const { parent, children = true, level = 10 } = args ?? {}
  let treeInclude: FindTreeArgs = {}
  for (let i = 0; i < level; i++) {
    if (i === 0) {
      treeInclude = { parent, children }
    }
    else {
      if (typeof children === 'object') {
        treeInclude = {
          parent,
          children: { ...children, include: { ...treeInclude, ...children?.include } },
        }
      }
      else if (children) {
        treeInclude = { parent, children: { include: treeInclude } }
      }
    }
  }

  return treeInclude
}

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
          const { where, ...restArgs } = args ?? {} as any
          const data = await ctx.findMany({
            include: getTreeInclude(restArgs),
            where: { ...where, parentId: null },
          })
          return data
        },
      },
    },
  })
}
