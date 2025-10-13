'use client'
import type { IconProps } from '@iconify/react'
import { icons } from '@iconify-json/ant-design'
import { addCollection, Icon as IconifyIcon } from '@iconify/react'

addCollection(icons)

export function Icon(props: Omit<IconProps, 'icon'> & { icon?: string }) {
  return <IconifyIcon {...props as IconProps} />
}

export default Icon
