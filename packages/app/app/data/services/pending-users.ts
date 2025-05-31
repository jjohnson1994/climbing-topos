import { randomInt } from 'crypto';
import bcrypt from 'bcrypt';
import { createUser, getUserByEmail, update } from '@/app/data/models/users';
import { sendTransactional } from '@/app/lib/email';
import { DateTime } from 'luxon';

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

export async function resendConfirmationCode(email: string) {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error('User does not exist');
  }

  if (
    DateTime.fromISO(user.verificationCodeExpiration) >
    DateTime.utc().plus({ minutes: 14 })
  ) {
    throw new Error('Cannot request a new verification code yet');
  }

  const verificationCode = randomInt(100000, 1000000);
  const verificationCodeExpiration = DateTime.utc()
    .plus({ minutes: 15 })
    .toString();

  await update(user.id, {
    UpdateExpression:
      'SET #verificationCode = :verificationCode, #verificationCodeExpiration = :verificationCodeExpiration',
    ExpressionAttributeNames: {
      '#verificationCode': 'verificationCode',
      '#verificationCodeExpiration': 'verificationCodeExpiration',
    },
    ExpressionAttributeValues: {
      ':verificationCode': verificationCode,
      ':verificationCodeExpiration': verificationCodeExpiration,
    },
  });

  await sendTransactional({
    subject:
      "Welcome to ClimbingTopos.com, here's your sign up verification code",
    content: `Your verification code is: ${verificationCode}`,
    recipientEmail: email,
  });

  return verificationCodeExpiration;
}
