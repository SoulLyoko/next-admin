import z from 'zod'

export const PageSchema = z.object({
  pageSize: z.number().min(1).max(100).optional(),
  current: z.number().min(1).optional(),
})
