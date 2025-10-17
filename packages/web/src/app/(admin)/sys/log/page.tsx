'use client'
import type { LogPartial } from '@app/db/zod'
import { defineProCrudProps, ProCrud } from '~/components'
import { client } from '~/trpc/client'

export default function SysLog() {
  const codeStyle = { width: '100%', boxSizing: 'border-box' }

  const crudProps = defineProCrudProps<LogPartial>({
    rowKey: 'id',
    request: client.log.page.query,
    addBtn: false,
    viewBtn: true,
    editBtn: false,
    delBtn: false,
    columns: [
      {
        title: '请求类型',
        dataIndex: 'type',
        search: true,
      },
      {
        title: '请求路径',
        dataIndex: 'path',
      },
      {
        title: '请求状态',
        dataIndex: 'ok',
        valueType: 'select',
        valueEnum: {
          true: '成功',
          false: '失败',
        },
      },
      {
        title: '耗时(ms)',
        dataIndex: 'time',
      },
      {
        title: '操作时间',
        dataIndex: 'createdAt',
        valueType: 'dateTime',
      },
      {
        title: '请求参数',
        dataIndex: 'input',
        valueType: 'jsonCode',
        hideInTable: true,
        fieldProps: { style: codeStyle },
      },
      {
        title: '请求头',
        dataIndex: 'headers',
        valueType: 'jsonCode',
        hideInTable: true,
        fieldProps: { style: codeStyle },
      },
      {
        title: '错误信息',
        dataIndex: 'error',
        valueType: 'dependency',
        hideInTable: true,
        name: ['ok'],
        columns({ ok }) {
          return ok
            ? []
            : [{
                title: '错误信息',
                dataIndex: 'error',
                valueType: 'code',
                fieldProps: { style: codeStyle },
              }]
        },
      },
    ],
  })

  return <ProCrud {...crudProps} />
}
