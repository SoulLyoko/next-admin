'use client'
import type { ActionType, ProColumns, ProTableProps } from '@ant-design/pro-components'
import type { MaybePromise } from '@trpc/server/unstable-core-do-not-import'
import type { GetProps } from 'antd'
import { BetaSchemaForm, ProTable } from '@ant-design/pro-components'

type Data = Record<string, any>
type SchemaFormProps<T, V = 'text'> = GetProps<typeof BetaSchemaForm<T, V>>
type FormType = 'add' | 'edit' | 'view'

type ProCrudProps<T extends Data = Data, P extends Data = Data, V = 'text'> = ProTableProps<T, P, V> & {
  create?: (data: T) => MaybePromise<any>
  update?: (data: T) => MaybePromise<any>
  delete?: (id: any) => MaybePromise<any>
  batchDelete?: (ids: any[]) => MaybePromise<any>
  formProps?: Omit<SchemaFormProps<T, V>, 'columns'> | ((formType: FormType) => Omit<SchemaFormProps<T, V>, 'columns'>)
  onBeforeSubmit?: (formType: FormType, form: T) => MaybePromise<any>
}

export default function ProCrud<T extends Data = Data, P extends Data = Data, V = 'text'>(props: ProCrudProps<T, P, V>) {
  const actionRef = useRef<ActionType>(null)
  const reload = () => actionRef.current?.reload()
  type RenderArgs = Parameters<NonNullable<ProColumns<T, V>['render']>>
  const getFormProps = (
    formType: FormType,
    args?: {
      dom: RenderArgs[0]
      entity: RenderArgs[1]
      index: RenderArgs[2]
      action: RenderArgs[3]
      schema: RenderArgs[4]
    },
  ) => {
    const entity = _cloneDeep(args?.entity)
    const defaultFormPropsByFormType: Record<FormType, Partial<SchemaFormProps<T, V>>> = {
      add: {
        title: '新增',
        trigger: <ATooltip className="ant-pro-table-list-toolbar-setting-item" title="新增" children={<Icon icon="ant-design:plus-outlined" />} />,
        onFinish: async (form) => {
          form = { ...form }
          await props.onBeforeSubmit?.(formType, form)
          await props.create?.(form)
          reload()
          return true
        },
      },
      edit: {
        title: '编辑',
        trigger: <a>编辑</a>,
        initialValues: entity,
        onFinish: async (form) => {
          const rowKey = props.rowKey as keyof T
          form = { [rowKey]: entity?.[rowKey], ...form }
          await props.onBeforeSubmit?.(formType, form)
          await props.update?.(form)
          reload()
          return true
        },
      },
      view: {
        title: '查看',
        trigger: <a>查看</a>,
        initialValues: entity,
        disabled: true,
        submitter: {
          render: () => [],
        },
      },
    }
    const formProps = typeof props.formProps === 'function' ? props.formProps(formType) : props.formProps

    return {
      ...defaultFormPropsByFormType[formType],
      layoutType: 'ModalForm',
      drawerProps: { destroyOnClose: true, forceRender: true },
      modalProps: { destroyOnClose: true, forceRender: true },
      columns: props.columns,
      ...formProps,
    } as SchemaFormProps<T, V>
  }

  const columns: ProColumns<T, V>[] = [
    ...props.columns ?? [],
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render(dom, entity, index, action, schema) {
        return [
          <BetaSchemaForm {...getFormProps('view', { dom, entity, index, action, schema })} />,
          <BetaSchemaForm {...getFormProps('edit', { dom, entity, index, action, schema })} />,
          <APopconfirm
            title="删除"
            description="确认删除吗?"
            onConfirm={async () => {
              await props.delete?.(entity[props.rowKey as keyof T])
              reload()
            }}
            children={<a>删除</a>}
          />,
        ]
      },
    },
  ]

  return (
    <ProTable<T, P, V>
      {...props}
      rowSelection={{}}
      columns={columns}
      actionRef={actionRef}
      tableAlertOptionRender={({ selectedRowKeys, onCleanSelected }) => [
        <APopconfirm
          title="批量删除"
          description={`确认批量删除已选择的 ${selectedRowKeys.length} 项吗?`}
          onConfirm={async () => {
            await props.batchDelete?.(selectedRowKeys)
            reload()
          }}
          children={<a>批量删除</a>}
        />,
        <a className="ml-4" onClick={onCleanSelected}>取消选择</a>,
      ]}
      toolbar={{
        actions: [<BetaSchemaForm {...getFormProps('add')} />],
      }}
    />
  )
}
