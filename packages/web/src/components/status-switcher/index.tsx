'use client'
import { Switch } from 'antd'
import { useState } from 'react'

export function StatusSwitcher<T extends { status?: string }>(props: { data: T, onUpdate?: (data: T) => any }) {
  const [loading, setLoading] = useState(false)
  async function onChange(value: boolean) {
    try {
      setLoading(true)
      const data = { ...props.data, status: value ? '1' : '0' }
      await props.onUpdate?.(data)
    }
    finally {
      setLoading(false)
    }
  }
  return <Switch value={props.data.status === '1'} loading={loading} onChange={onChange} />
}

export default StatusSwitcher
