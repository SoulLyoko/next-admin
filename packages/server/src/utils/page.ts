import z from 'zod'

export const PageSchema = z.object({
  pageSize: z.number().min(1).optional(),
  current: z.number().min(1).optional(),
})

export type Page = z.infer<typeof PageSchema>

export interface PageResult<T> {
  data: T
  total: number
  success: boolean
}
