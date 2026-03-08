import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie, deleteCookie } from '@tanstack/react-start/server'
import { redirect } from '@tanstack/react-router'
import { verifyJwt, createAccessTokenJwt, type JwtPayload } from './jwt'

export const getAuthUser = createServerFn({ method: 'GET' }).handler(
  async (): Promise<JwtPayload | false> => {
    const token = getCookie('access_token')
    if (!token) return false

    const verified = await verifyJwt(token).catch(() => null)
    if (!verified) {
      deleteCookie('access_token')
      return false
    }

    try {
      const newToken = await createAccessTokenJwt(verified.properties)
      setCookie('access_token', newToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 14 * 24 * 60 * 60,
      })
    } catch {}

    return verified
  },
)

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  deleteCookie('access_token')
  throw redirect({ to: '/' })
})

