import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { NewListSchema } from '@climbingtopos/schemas'
import { lists } from '@/data/services'
import { getAuthUser } from '@/lib/auth'
import type { ListRequest } from '@climbingtopos/types'

export const postFn = createServerFn({ method: 'POST' })
  .inputValidator(async (data: ListRequest) => {
    await NewListSchema().validate(data, { abortEarly: false })
    return data
  })
  .handler(async ({ data }) => {
    const user = await getAuthUser()

    if (!user) {
      throw redirect({ to: '/login' })
    }

    const newList = await lists.createList(user.properties as any, data)

    return { success: true, ...newList }
  })
