import { logError } from '@/lib/log'
import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { getAuthUser } from '@/lib/auth'
import { crags, files } from '@/data/services'
import { NewCragSchema } from '@climbingtopos/schemas'

export const postFn = createServerFn({ method: 'POST' })
  .inputValidator((data: {
    acceptTerms: boolean
    accessLink: string
    accessDetails: string
    approachNotes: string
    carParks: unknown[]
    access: string
    longitude: string
    latitude: string
    tags: string[]
    description: string
    title: string
    osmData: unknown
    imageBase64: string
  }) => data)
  .handler(async ({ data }) => {
    try {
      const user = await getAuthUser()

      if (!user) {
        throw redirect({ to: '/login' })
      }

      const image = await files.uploadImage(data.imageBase64)

      const { imageBase64: _, ...rest } = data
      const cragData = { ...rest, image }

      await NewCragSchema().validate(cragData, { stripUnknown: true, abortEarly: false })

      const resp = await crags.createCrag(cragData as any, user.properties as any)

      return { ...resp }
    } catch (err) {
      logError('action:crags/post', err)
      throw err
    }
  })
