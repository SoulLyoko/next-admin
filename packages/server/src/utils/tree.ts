interface TreeInclude {
  parent?: boolean
  children?: boolean | { include?: TreeInclude }
}

export function getTreeInclude(level: number = 10) {
  let treeInclude: TreeInclude = {}
  for (let i = 0; i < level; i++) {
    if (i === 0) {
      treeInclude = { parent: true, children: true }
    }
    else {
      treeInclude = { parent: true, children: { include: treeInclude } }
    }
  }

  return treeInclude
}
