import * as jose from 'jose'
import { Resource } from 'sst'

export type JwtProperties = {
  email: string
  status: 'verified' | 'pending'
  nickname?: string
  picture?: string
  sub?: string
  id?: string
}

export type JwtPayload = {
  properties: JwtProperties
  tokenVersion?: number
  authTime?: number
  iat?: number
}

export type JwtSession = {
  tokenVersion?: number
  authTime?: number
}

export const createAccessTokenJwt = async (
  payload: JwtProperties,
  session?: JwtSession,
) => {
  const privateKey = await jose.importPKCS8(
    Resource.JwtPrivateKey.value,
    'RS256',
  )

  const newAccessToken = await new jose.SignJWT({
    properties: {
      ...payload,
    },
    tokenVersion: session?.tokenVersion ?? 0,
    authTime: session?.authTime ?? Math.floor(Date.now() / 1000),
  })
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuedAt()
    .setIssuer('https://climbingtopos.com')
    .setAudience('climbing-topos-app')
    .setExpirationTime('14d')
    .sign(privateKey)

  return newAccessToken
}

export const verifyJwt = async (token: string): Promise<JwtPayload> => {
  const publicKey = await jose.importSPKI(Resource.JwtPublicKey.value, 'RS256')

  const { payload } = await jose.jwtVerify(token, publicKey, {
    algorithms: ['RS256'],
    issuer: 'https://climbingtopos.com',
    audience: 'climbing-topos-app',
  })

  return payload as unknown as JwtPayload
}
