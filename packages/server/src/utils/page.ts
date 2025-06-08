import z from 'zod'

export const PageSchema = z.object({
  pageSize: z.number().min(1).max(100).optional(),
  current: z.number().min(1).optional(),
})

export type Page = z.infer<typeof PageSchema>

export function parsePage<T extends Record<string, any>>(input: Page & T) {
  const { current = 1, pageSize = 10, ...where } = input
  return {
    take: pageSize,
    skip: pageSize * (current - 1),
    where,
  }
}
