'use client'
import type { SelectProps } from 'antd'
import { icons } from '@iconify-json/ant-design'
import { Select } from 'antd'
import { chunk } from 'lodash-es'
import { useRef, useState } from 'react'
import { Icon } from '../icon'
import './style.css'

export function IconSelect(props: SelectProps) {
  const [searchValue, setSearchValue] = useState('')
  const options = Object.keys(icons.icons).filter(e => e.includes(searchValue)).map((e) => {
    const icon = `${icons.prefix}:${e}`
    return { label: icon, value: icon }
  })
  const iconList = chunk(options, 15).map(row => ({ value: row.map(e => e.value).join(''), icons: row }))

  const optionRender = (option: any) => {
    const row: typeof options = option.data.icons
    return (
      <div className="icon-select-row">
        {
          row.map(item =>
            <Icon className={item.value === props.value ? 'iconify-selected' : ''} icon={item.value} onClick={() => onChange(item.value)}></Icon>,
          )
        }
      </div>
    )
  }

  function onChange(value?: string) {
    setSearchValue('')
    props.onChange?.(value)
  }

  const itemHeight = 48 + 10
  const selectRef = useRef<any>(null)
  function onOpenChange(visible: boolean) {
    setTimeout(() => {
      if (visible) {
        const rowIndex = iconList.findIndex(row => row.icons.some(e => e.value === props.value))
        const top = itemHeight * rowIndex
        selectRef.current?.scrollTo({ left: 0, top })
      }
    }, 100)
  }

  return (
    <Select
      classNames={{ popup: { root: 'icon-select-list' } }}
      value={props.value}
      placeholder="请选择"
      prefix={<Icon icon={props.value} />}
      showSearch
      onSearch={setSearchValue}
      {...props}
      ref={selectRef}
      listItemHeight={itemHeight}
      options={iconList}
      optionRender={optionRender}
      onOpenChange={onOpenChange}
      onClear={onChange}
      onChange={() => { }}
    >
    </Select>
  )
}

export default IconSelect
