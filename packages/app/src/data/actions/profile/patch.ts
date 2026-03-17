import { logError } from '@/lib/log'
import { createServerFn } from '@tanstack/react-start'
import { setCookie } from '@tanstack/react-start/server'
import { users, files } from '@/data/services'
import { getAuthUser } from '@/lib/auth'
import { createAccessTokenJwt } from '@/lib/jwt'

export interface AccountSetupForm {
  username: string
  profilePictureBase64?: string
}

export const patchFn = createServerFn({ method: 'POST' })
  .inputValidator((data: AccountSetupForm) => data)
  .handler(async ({ data }): Promise<{ error?: string }> => {
    try {
      const subject = await getAuthUser()

      if (!subject) {
        return { error: 'Not authorised' }
      }

      const username = data.username.trim()

      if (username.length === 0 || username.length > 50) {
        return { error: 'Username must be between 1 and 50 characters' }
      }

      if (!/^[a-zA-Z0-9 _-]+$/.test(username)) {
        return {
          error:
            'Username may only contain letters, numbers, spaces, hyphens and underscores',
        }
      }

      if (!data.profilePictureBase64) {
        return { error: 'Profile picture is required' }
      }

      const profilePicture = await files.uploadImage(data.profilePictureBase64)

      await users.patchUser(subject.properties.id as string, {
        nickname: username,
        picture: profilePicture,
      })

      const newUserProperties = {
        ...subject.properties,
        nickname: username,
        picture: profilePicture,
      }

      const newAccessToken = await createAccessTokenJwt(newUserProperties)

      setCookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 14 * 24 * 60 * 60,
      })

      return {}
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : 'Something went wrong, please try again',
      }
    }
  })
