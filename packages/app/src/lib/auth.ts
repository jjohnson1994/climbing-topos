import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie, deleteCookie } from '@tanstack/react-start/server'
import { redirect } from '@tanstack/react-router'
import { verifyJwt, createAccessTokenJwt, type JwtPayload } from './jwt'
import { getUserById } from '@/data/models/users'

const MAX_SESSION_SECONDS = 30 * 24 * 60 * 60
const REFRESH_AFTER_SECONDS = 60 * 60

export const getAuthUser = createServerFn({ method: 'GET' }).handler(
  async (): Promise<JwtPayload | false> => {
    const token = getCookie('access_token')
    if (!token) return false

    const verified = await verifyJwt(token).catch(() => null)
    if (!verified) {
      deleteCookie('access_token')
      return false
    }

    const nowSeconds = Math.floor(Date.now() / 1000)
    const authTime = verified.authTime ?? verified.iat ?? nowSeconds

    if (nowSeconds - authTime > MAX_SESSION_SECONDS) {
      deleteCookie('access_token')
      return false
    }

    const issuedAt = verified.iat ?? 0
    if (nowSeconds - issuedAt < REFRESH_AFTER_SECONDS) {
      return verified
    }

    const tokenVersion = verified.tokenVersion ?? 0

    if (verified.properties.sub) {
      let user
      try {
        user = await getUserById(verified.properties.sub)
      } catch {
        return verified
      }

      if (!user || (user.tokenVersion ?? 0) !== tokenVersion) {
        deleteCookie('access_token')
        return false
      }
    }

    const newToken = await createAccessTokenJwt(verified.properties, {
      tokenVersion,
      authTime,
    }).catch(() => null)

    if (newToken) {
      setCookie('access_token', newToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 14 * 24 * 60 * 60,
      })
    }

    return verified
  },
)

export const getVerifiedUser = createServerFn({ method: 'GET' }).handler(
  async (): Promise<JwtPayload | false> => {
    const user = await getAuthUser()

    if (
      !user ||
      user.properties.status !== 'verified' ||
      !user.properties.sub
    ) {
      return false
    }

    return user
  },
)

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  deleteCookie('access_token')
  throw redirect({ to: '/' })
})
