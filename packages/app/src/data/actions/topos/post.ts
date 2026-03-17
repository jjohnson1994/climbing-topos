import { logError } from '@/lib/log'
import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { NewTopoSchema } from '@climbingtopos/schemas'
import { areas, topos, files } from '@/data/services'
import { getAuthUser } from '@/lib/auth'
import type { TopoRequest } from '@climbingtopos/types'

export const postFn = createServerFn({ method: 'POST' })
  .inputValidator((data: Omit<TopoRequest, 'image'> & { imageBase64: string }) => data)
  .handler(async ({ data }) => {
    try {
      const user = await getAuthUser()

      if (!user) {
        throw redirect({ to: '/login' })
      }

      const image = await files.uploadImage(data.imageBase64)

      const { imageBase64: _, ...rest } = data
      const topoData: TopoRequest = { ...rest, image }

      await NewTopoSchema().validate(topoData, { abortEarly: false })

      await areas.getAreaBySlug(topoData.areaSlug, user.properties.sub || '')
      await topos.createTopo(topoData, user.properties as any)

      return { success: true }
    } catch (err) {
      logError('action:topos/post', err)
      throw err
    }
  })
