'use server';

import { users, files } from '@/app/data/services';
import { auth } from '@/app/actions';
import { setTokens } from '../auth';

export interface AccountSetupForm {
  username: string;
  profilePicure: File;
}

import { createAccessTokenJwt } from '../lib/jwt';

export async function updateUser(accountSetupForm: FormData): Promise<{ error?: string }> {
  try {
    const subject = await auth();

    if (!subject) {
      return { error: 'Not authorised' };
    }

    const usernameValue = accountSetupForm.get('username');
    const profilePicure = accountSetupForm.get('profilePicure');

    if (!usernameValue || typeof usernameValue !== 'string') {
      return { error: 'Username is required' };
    }

    const username = usernameValue.trim();

    if (username.length === 0 || username.length > 50) {
      return { error: 'Username must be between 1 and 50 characters' };
    }

    if (!/^[a-zA-Z0-9 _-]+$/.test(username)) {
      return { error: 'Username may only contain letters, numbers, spaces, hyphens and underscores' };
    }

    if (!profilePicure || !(profilePicure instanceof File) || profilePicure.size === 0) {
      return { error: 'Profile picture is required' };
    }

    const { fileUrl } = await files.uploadFile(profilePicure);

    await users.patchUser(subject.properties.id, {
      nickname: username,
      picture: fileUrl,
    });

    const newUserProperties = {
      ...subject.properties,
      nickname: username,
      picture: fileUrl,
    };

    const newAccessToken = await createAccessTokenJwt({
      ...newUserProperties,
    });

    await setTokens(newAccessToken);

    return {};
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Something went wrong, please try again' };
  }
}
