import type { ImportNameAlias, ImportsMap } from 'unplugin-auto-import/types'
import * as antdPro from '@ant-design/pro-components'
import * as antd from 'antd'
import fg from 'fast-glob'
import { camelCase, upperFirst } from 'lodash-es'
import * as lodash from 'lodash-es'
import AutoImport from 'unplugin-auto-import/webpack'

export default function AutoImportCustom() {
  return AutoImport({
    include: [/\.[tj]sx?$/],
    imports: ['react', componentsImports(), lodashImports(), antdImports(), antdProImports()],
    dts: './auto-imports.d.ts',
  })
}

/** add `src/components` dir imports */
function componentsImports() {
  const componentsDir = 'src/components'
  const files = fg.sync(`${componentsDir}/**/*.(t|j)sx`)

  const imports: ImportsMap = {}
  files.forEach((componentPath) => {
    let componentName = componentPath.replace(componentsDir, '').replace(/\/index\.(t|j)sx$/, '').replace(/\.(t|j)sx$/, '')
    componentName = pascalCase(componentName)
    imports[componentPath] = [['default', componentName]]
  })

  return imports
}

/** add lodash imports with prefix `_` */
function lodashImports(): ImportsMap {
  return {
    'lodash-es': Object.keys(lodash).map(name => [name, `_${name}`]),
  }
}

/** add antd imports */
function antdImports(): ImportsMap {
  return {
    antd: Object.keys(antd).filter(name => /^[A-Z]/.test(name)).map(name => [name, `A${name}`]),
  }
}
/** add @ant-design/pro-components imports */
function antdProImports(): ImportsMap {
  const pros = Object.keys(antdPro).filter(name => name.startsWith('Pro'))
  const alias: ImportNameAlias[] = [
    ['PageContainer', 'ProPageContainer'],
    ['WaterMark', 'ProWaterMark'],
    ['StatisticCard', 'ProStatisticCard'],
    ['CheckCard', 'ProCheckCard'],
    ['BetaSchemaForm', 'ProBetaSchemaForm'],
    ['QueryFilter', 'ProQueryFilter'],
    ['LightFilter', 'ProLightFilter'],
    ['StepsForm', 'ProStepsForm'],
    ['ModalForm', 'ProModalForm'],
    ['DrawerForm', 'ProDrawerForm'],
    ['LoginForm', 'ProLoginForm'],
    ['LoginFormPage', 'ProLoginFormPage'],
    ['EditableProTable', 'ProEditableProTable'],
    ['DragSortTable', 'ProDragSortTable'],
  ]

  return {
    '@ant-design/pro-components': [...pros, ...alias],
  }
}

function pascalCase(str: string) {
  return upperFirst(camelCase(str))
}
