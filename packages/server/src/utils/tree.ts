import { defu } from 'defu'

interface TreeInclude {
  parent?: boolean | { include?: TreeInclude }
  children?: boolean | { include?: TreeInclude }
}

export function getTreeInclude<T = TreeInclude>(args?: T, level: number = 10) {
  let treeInclude: TreeInclude = {}
  for (let i = 0; i < level; i++) {
    if (i === 0) {
      treeInclude = defu(args ?? {}, { parent: true, children: true })
    }
    else {
      treeInclude = defu(args ?? {}, { parent: true, children: { include: treeInclude } })
    }
  }

  return treeInclude as T
}

export type TreeNode<T = Record<string, any>> = T & { children?: TreeNode<T>[] }
export interface BuildTreeOptions {
  /**
   * 父级id
   * @default null
   */
  parentId?: string | number
  /**
   * 节点id键名
   * @default "id"
   */
  idKey?: string
  /**
   * 父级节点id键名
   * @default "parentId"
   */
  parentIdKey?: string
}
export function buildTree<T extends Record<string, any> = Record<string, any>>(list: T[], options: BuildTreeOptions = {}) {
  const { parentId = null, idKey = 'id', parentIdKey = 'parentId' } = options

  return list
    .filter(item => item[parentIdKey] === parentId)
    .map((parent) => {
      const result: TreeNode<T> = { ...parent, parent }
      let children = null
      const hasChildren = list.some(item => item[parentIdKey] === parent[idKey])
      if (hasChildren)
        children = buildTree(list, { ...options, parentId: parent[idKey] })

      children?.length && (result.children = children)
      return result
    })
}
