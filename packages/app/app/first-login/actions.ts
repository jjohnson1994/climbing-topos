'use server';

import { users, files } from '@/app/data/services';
import { auth } from '@/app/actions';

export interface AccountSetupForm {
  username: string;
  profilePicure: File;
}

export async function updateUser(accountSetupForm: FormData) {
  // TODO compress image
  const subject = await auth();

  const username = accountSetupForm.get('username');
  const profilePicure = accountSetupForm.get('profilePicure') as File;

  const { fileUrl } = await files.uploadFile(profilePicure);

  users.patchUser(subject.properties.id, {
    nickname: username,
    picture: fileUrl,
  });
}
