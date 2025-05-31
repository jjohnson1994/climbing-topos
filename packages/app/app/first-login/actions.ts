'use server';

import { users, files } from '@/app/data/services';
import { auth } from '@/app/actions';
import { setTokens } from '../auth';

export interface AccountSetupForm {
  username: string;
  profilePicure: File;
}

import { createAccessTokenJwt } from '../lib/jwt';

export async function updateUser(accountSetupForm: FormData) {
  const subject = await auth();

  if (!subject) {
    throw new Error('Not authorised');
  }

  const username = accountSetupForm.get('username');
  const profilePicure = accountSetupForm.get('profilePicure') as File;

  // TODO compress image
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
}

updateUser();
