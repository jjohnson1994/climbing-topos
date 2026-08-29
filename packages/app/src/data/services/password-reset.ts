import { randomInt } from 'crypto';
import bcrypt from 'bcryptjs';
import { getUserByEmail, update } from '@/data/models/users';
import { DateTime } from 'luxon';

export async function requestPasswordReset(email: string): Promise<number | null> {
  const user = await getUserByEmail(email);

  if (!user || user.status === 'pending') {
    return null;
  }

  const resetCode = randomInt(100000, 1000000);
  const resetCodeExpiration = DateTime.utc().plus({ minutes: 15 }).toString();

  await update(user.id, {
    UpdateExpression:
      'SET #passwordResetCode = :passwordResetCode, #passwordResetCodeExpiration = :passwordResetCodeExpiration',
    ExpressionAttributeNames: {
      '#passwordResetCode': 'passwordResetCode',
      '#passwordResetCodeExpiration': 'passwordResetCodeExpiration',
    },
    ExpressionAttributeValues: {
      ':passwordResetCode': resetCode,
      ':passwordResetCodeExpiration': resetCodeExpiration,
    },
  });

  return resetCode;
}

export async function confirmPasswordReset(
  email: string,
  code: number,
  newPassword: string,
): Promise<void> {
  if (!newPassword || newPassword.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }

  if (Buffer.byteLength(newPassword, 'utf8') > 72) {
    throw new Error('Password must be 72 characters or fewer');
  }

  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error('Invalid or expired reset code');
  }

  if (DateTime.fromISO(user.passwordResetCodeExpiration) < DateTime.utc()) {
    throw new Error('Invalid or expired reset code');
  }

  if (user.passwordResetCode !== code) {
    throw new Error('Invalid or expired reset code');
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  try {
    await update(user.id, {
      UpdateExpression:
        'SET #hashedPassword = :hashedPassword ADD #tokenVersion :one REMOVE #passwordResetCode, #passwordResetCodeExpiration',
      ExpressionAttributeNames: {
        '#hashedPassword': 'hashedPassword',
        '#tokenVersion': 'tokenVersion',
        '#passwordResetCode': 'passwordResetCode',
        '#passwordResetCodeExpiration': 'passwordResetCodeExpiration',
      },
      ExpressionAttributeValues: {
        ':hashedPassword': hashedPassword,
        ':one': 1,
      },
      ConditionExpression: 'attribute_exists(#passwordResetCode)',
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === 'ConditionalCheckFailedException'
    ) {
      throw new Error('Invalid or expired reset code');
    }
    throw error;
  }
}
