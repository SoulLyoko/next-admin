import type { ProColumns } from '@ant-design/pro-components'
import type { ProCrudProps } from '~/components/pro-crud'

export function defineProColumns<T = any, V = 'text'>(columns: ProColumns<T, V>[]): ProColumns<T, V>[] {
  return columns
}

export function defineProCrudProps<T = any, P = T, V = 'text'>(props: ProCrudProps<T, P, V>) {
  return props
}
