'use client'
import type { ActionType, BetaSchemaForm, ProColumns, ProFormInstance, ProTableProps } from '@ant-design/pro-components'
import type { MaybePromise } from '@trpc/server/unstable-core-do-not-import'
import type { GetProps } from 'antd'

type Data = Record<string, any>
type SchemaFormProps<T, V = 'text'> = GetProps<typeof BetaSchemaForm<T, V>>
type FormType = 'add' | 'edit' | 'view'
type ColumnRenderArgs<T, V> = Parameters<NonNullable<ProColumns<T, V>['render']>>

export interface CrudInstance<T = any> {
  formType?: FormType
  onAdd: (row: T) => MaybePromise<void>
  onEdit: (row: T) => MaybePromise<void>
  onView: (row: T) => MaybePromise<void>
  onRemove: (row: T) => MaybePromise<void>
  onBatchRemove: (selectedRowKeys: React.Key[], selectedRows: T[]) => MaybePromise<void>
}

export type ProCrudProps<T = any, P = any, V = 'text'> = ProTableProps<T, P, V> & {
  crudRef?: React.RefObject<CrudInstance<T> | undefined>
  formProps?: Omit<SchemaFormProps<T, V>, 'columns' | 'formRef'>
  create?: (data: T | any) => MaybePromise<any>
  update?: (data: T | any) => MaybePromise<any>
  delete?: (id: any) => MaybePromise<any>
  batchDelete?: (ids: any[]) => MaybePromise<any>
  onCreate?: SchemaFormProps<T, V>['onFinish']
  onUpdate?: SchemaFormProps<T, V>['onFinish']
  onDelete?: (row: T) => MaybePromise<void>
  onBatchDelete?: (selectedRowKeys: React.Key[], selectedRows: T[]) => MaybePromise<void>
  optionBefore?: ProColumns<T, V>['render']
  optionAfter?: ProColumns<T, V>['render']
  option?: boolean | ProColumns<T, 'option'>
  addBtn?: boolean | React.ReactNode
  viewBtn?: boolean | ProColumns<T, V>['render']
  editBtn?: boolean | ProColumns<T, V>['render']
  delBtn?: boolean | ProColumns<T, V>['render']
  batchDelBtn?: boolean | ((selectedRowKeys: React.Key[], selectedRows: T[]) => React.ReactNode)
}

export default function ProCrud<T extends Data = Data, P extends Data = Data, V = 'text'>(props: ProCrudProps<T, P, V>) {
  const {
    formRef: propFormRef,
    actionRef: propsActionRef,
    crudRef: propsCrudRef,
    ...restProps
  } = props

  const actionRef = useRef<ActionType>(undefined)
  useImperativeHandle(propsActionRef, () => actionRef.current, [actionRef])
  const reload = () => actionRef.current?.reload()

  const [formState, setFormState] = useState<SchemaFormProps<T, V>>({ columns: [] })
  const [open, setOpen] = useState(false)
  const [formType, setFormType] = useState<FormType>()

  function onAdd(row?: T) {
    setFormType('add')
    setOpen(true)
    setFormState({
      columns: restProps.columns,
      title: '新增',
      initialValues: { ...row },
      async onFinish(form) {
        if (restProps.onCreate)
          return restProps.onCreate

        await restProps.create?.(form)
        reload()
        return true
      },
    } as SchemaFormProps<T, V>)
  }
  function onEdit(row: T) {
    setFormType('edit')
    setOpen(true)
    setFormState({
      columns: restProps.columns,
      title: '编辑',
      initialValues: { ...row },
      onFinish: async (form) => {
        const rowKey = restProps.rowKey as keyof T
        form = { [rowKey]: row?.[rowKey], ...form }
        if (restProps.onUpdate)
          return restProps.onUpdate(form)

        await restProps.update?.(form)
        reload()
        return true
      },
    } as SchemaFormProps<T, V>)
  }
  function onView(row: T) {
    setFormType('view')
    setOpen(true)
    setFormState({
      columns: restProps.columns,
      title: '查看',
      initialValues: { ...row },
      disabled: true,
      submitter: { render: () => [] },
    } as SchemaFormProps<T, V>)
  }
  async function onRemove(row: T) {
    if (restProps.onDelete)
      return restProps.onDelete(row)

    await restProps.delete?.(row[restProps.rowKey as keyof T])
    reload()
  }
  async function onBatchRemove(selectedRowKeys: React.Key[], selectedRows: T[]) {
    if (restProps.onBatchDelete)
      return restProps.onBatchDelete(selectedRowKeys, selectedRows)

    await restProps.batchDelete?.(selectedRowKeys)
    reload()
  }

  useImperativeHandle(propsCrudRef, () => ({ formType, onAdd, onEdit, onView, onRemove, onBatchRemove }), [])

  const columns = [
    ...restProps.columns ?? [],
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      hideInTable: restProps.option === false,
      render: (...args) => [
        restProps.optionBefore?.(...args),
        renderViewBtn(...args),
        renderEditBtn(...args),
        renderDelBtn(...args),
        restProps.optionAfter?.(...args),
      ],
      ...(typeof restProps.option === 'object' ? restProps.option : {}),
    },
  ] as ProColumns<T, V>[]

  function renderViewBtn(...args: ColumnRenderArgs<T, V>) {
    if (!restProps.viewBtn)
      return
    if (typeof restProps.viewBtn === 'function')
      return restProps.viewBtn(...args)

    const row = args[1]
    return <a onClick={() => onView(row)}>查看</a>
  }
  function renderEditBtn(...args: ColumnRenderArgs<T, V>) {
    if (restProps.editBtn === false)
      return
    if (typeof restProps.editBtn === 'function')
      return restProps.editBtn(...args)

    const row = args[1]
    return <a onClick={() => onEdit(row)}>编辑</a>
  }

  function renderDelBtn(...args: ColumnRenderArgs<T, V>) {
    if (restProps.delBtn === false)
      return
    if (typeof restProps.delBtn === 'function')
      return restProps.delBtn(...args)

    const row = args[1]
    return (
      <APopconfirm
        title="删除"
        description="确认删除吗?"
        onConfirm={() => onRemove(row)}
        children={<a>删除</a>}
      />
    )
  }

  function renderBatchDelBtn(selectedRowKeys: React.Key[], selectedRows: T[]) {
    if (restProps.batchDelBtn === false)
      return
    if (typeof restProps.batchDelBtn === 'function')
      return restProps.batchDelBtn(selectedRowKeys, selectedRows)

    return (
      <APopconfirm
        title="批量删除"
        description={`确认批量删除已选择的 ${selectedRowKeys.length} 项吗?`}
        onConfirm={async () => onBatchRemove(selectedRowKeys, selectedRows)}
        children={<a>批量删除</a>}
      />
    )
  }

  function renderAddBtn() {
    if (restProps.addBtn === false)
      return

    return restProps.addBtn ?? (
      <ATooltip className="ant-pro-table-list-toolbar-setting-item" title="新增">
        <Icon icon="ant-design:plus-outlined" onClick={() => onAdd()} />
      </ATooltip>
    )
  }

  function onFormInit(values: T, form: ProFormInstance) {
    if (propFormRef && 'current' in propFormRef)
      propFormRef.current = form
    restProps.formProps?.onInit?.(values, form)
  }

  return (
    <>
      <ProTable<T, P, V>
        {...restProps}
        columns={columns}
        actionRef={actionRef}
        toolbar={{
          actions: [renderAddBtn()],
          ...restProps.toolbar,
        }}
        tableAlertOptionRender={
          restProps.tableAlertOptionRender
          ?? (({ selectedRowKeys, selectedRows, onCleanSelected }) => [
            renderBatchDelBtn(selectedRowKeys, selectedRows),
            <a className="ml-4" onClick={onCleanSelected}>取消选择</a>,
          ])
        }
      />

      {open && (
        <ProBetaSchemaForm
          layoutType="ModalForm"
          open={open}
          onOpenChange={setOpen}
          {...formState}
          {...restProps.formProps as any}
          onInit={onFormInit}
        />
      )}
    </>
  )
}
