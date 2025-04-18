import { handle } from 'hono/aws-lambda';
import { issuer } from '@openauthjs/openauth';
import { CodeUI } from '@openauthjs/openauth/ui/code';
import { CodeProvider } from '@openauthjs/openauth/provider/code';
import { MemoryStorage } from '@openauthjs/openauth/storage/memory';
import { subjects } from './subjects';
import { PasswordUI } from '@openauthjs/openauth/ui/password';
import { PasswordProvider } from '@openauthjs/openauth/provider/password';
import { Resource } from 'sst';
import { nanoid } from 'nanoid';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  QueryCommand,
  DynamoDBDocumentClient,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { sendTransactional } from './db/email';

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

async function createNewUser(email: string) {
  const uid = nanoid();

  const newUser = {
    hk: uid,
    sk: 'metadata#',
    email,
    model: 'user',
    id: uid,
    slug: email,
  };

  const params = {
    TableName: Resource.climbingtopos2.name,
    Item: newUser,
  };

  await dynamoDb.send(new PutCommand(params));

  return newUser;
}

async function getUser(email: string) {
  const params = {
    TableName: Resource.climbingtopos2.name,
    IndexName: 'gsi2',
    KeyConditionExpression: '#hk = :hk AND #sk = :sk',
    ExpressionAttributeNames: {
      '#hk': 'model',
      '#sk': 'slug',
    },
    ExpressionAttributeValues: {
      ':hk': 'user',
      ':sk': email,
    },
  };

  const user = await dynamoDb.send(new QueryCommand(params));

  if (user.Count === 0) {
    const newUser = await createNewUser(email);
    return newUser;
  }

  return user.Items[0];
}

const app = issuer({
  subjects,
  storage: MemoryStorage(),
  // Remove after setting custom domain
  allow: async () => true,
  providers: {
    code: CodeProvider(
      CodeUI({
        sendCode: async (email, code) => {
          await sendTransactional({
            subject: 'Login code',
            content: `Your login code is: ${code}`,
            recipientEmail: email.email,
          });
        },
      }),
    ),
    password: PasswordProvider(
      PasswordUI({
        copy: {
          error_email_taken: 'This email is already taken.',
        },
        sendCode: async (email, code) => {
          await sendTransactional({
            subject: 'Account verification code',
            content: `Your account verification code is: ${code}`,
            recipientEmail: email.email,
          });
        },
      }),
    ),
  },
  success: async (ctx, value) => {
    if (value.provider === 'code') {
      const user = await getUser(value.claims.email);

      return ctx.subject('user', {
        id: user.id,
        sub: user.id,
        nickname: user.nickname,
        picture: user.picture,
        email: value.claims.email,
      });
    }
    if (value.provider === 'password') {
      const user = await getUser(value.email);

      return ctx.subject('user', {
        id: user.id,
        sub: user.id,
        nickname: user.nickname,
        picture: user.picture,
        email: value.email,
      });
    }
    throw new Error('Invalid provider');
  },
});

export const handler = handle(app);
