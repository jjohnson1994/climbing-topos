import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import type { LogRequest } from '@climbingtopos/types'
import { NewLogsSchema } from '@climbingtopos/schemas'
import { logs } from '@/data/services'
import { getAuthUser } from '@/lib/auth'

export const postFn = createServerFn({ method: 'POST' })
  .inputValidator(async (data: LogRequest[]) => {
    await NewLogsSchema().validate({ logs: data }, { abortEarly: false })
    return data
  })
  .handler(async ({ data }) => {
    const user = await getAuthUser()

    if (!user) {
      throw redirect({ to: '/login' })
    }

    await logs.logRoutes(data, user.properties as any)

    return { success: true }
  })
