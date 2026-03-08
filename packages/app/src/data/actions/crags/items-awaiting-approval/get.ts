import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { getAuthUser } from '@/lib/auth'
import { crags } from '@/data/services'

export const getFn = createServerFn({ method: 'GET' })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<any> => {
    const user = await getAuthUser()

    if (!user) {
      throw redirect({ to: '/login' })
    }

    const userSub = user.properties.sub

    if (!userSub) {
      throw redirect({ to: '/login' })
    }

    const crag = await crags.getCragBySlug(data.slug, userSub)

    if (crag.managedBy.sub !== userSub) {
      return { error: true }
    }

    return await crags.getCragItemsAwaitingAproval(crag.slug)
  })
