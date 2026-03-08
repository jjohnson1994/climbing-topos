import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import * as yup from 'yup'
import type { ListAddRouteRequest } from '@climbingtopos/types'
import { lists, routes } from '@/data/services'
import { getAuthUser } from '@/lib/auth'

const bodySchema = yup.array().of(
  yup.object().shape({
    cragSlug: yup.string().required(),
    areaSlug: yup.string().required(),
    topoSlug: yup.string().required(),
    routeSlug: yup.string().required(),
  }),
)

export const patchFn = createServerFn({ method: 'POST' })
  .inputValidator(async (data: { slug: string; body: ListAddRouteRequest[] }) => {
    await bodySchema.validate(data.body, { abortEarly: false })
    return data
  })
  .handler(async ({ data }) => {
    const user = await getAuthUser()

    if (!user) {
      throw redirect({ to: '/login' })
    }

    const userSub = user.properties.sub || ''
    const list = await lists.getListBySlug(userSub, data.slug)

    const routesToList = await Promise.all(
      data.body.map(async (routeReq) =>
        routes.listRoutes(
          userSub,
          routeReq.cragSlug,
          routeReq.areaSlug,
          routeReq.topoSlug,
          routeReq.routeSlug,
        ),
      ),
    )

    const updateResponse = await lists.addRoutesToList(
      userSub,
      data.slug,
      routesToList.map((route) => ({
        areaSlug: route.areaSlug,
        areaTitle: route.title,
        country: route.country,
        countryCode: route.countryCode,
        county: route.county,
        cragSlug: route.cragSlug,
        cragTitle: route.cragTitle,
        grade: route.grade,
        gradeModal: route.gradeModal,
        gradingSystem: route.gradingSystem,
        latitude: route.latitude,
        slug: data.slug,
        listSlug: list.slug,
        listTitle: list.title,
        longitude: route.longitude,
        rockType: route.rockType,
        routeSlug: route.slug,
        routeType: route.routeType,
        state: route.state,
        title: route.title,
        topoSlug: route.topoSlug,
      })),
    )

    return { success: true, ...updateResponse }
  })
