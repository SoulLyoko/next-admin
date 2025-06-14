import type { ProCrudProps } from '~/components/pro-crud'

export function defineProCrudProps<T = any, P = T, V = 'text'>(props: ProCrudProps<T, P, V>) {
  return props
}
