import { randomInt } from 'crypto';
import bcrypt from 'bcrypt';
import { createUser, getUserByEmail } from '@/app/data/models/users';

export async function createPendingUser(email: string, password: string) {
  const userExists = await getUserByEmail(email);

  if (userExists) {
    throw new Error('User exists');
  }

  const verificationCode = randomInt(100000, 1000000);

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  await createUser({
    email,
    hashedPassword,
    verificationCode,
  });

  return verificationCode;
}
