'use server';

import { cookies as getCookies } from 'next/headers';
import { users, files } from '@/app/data/services';
import { auth } from '@/app/actions';
import jwt from 'jsonwebtoken';
import { Resource } from 'sst';
import { setTokens } from '../auth';

export interface AccountSetupForm {
  username: string;
  profilePicure: File;
}

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { QueryCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const fetchJwtSigningKey = async () => {
  const authTableName = Resource.ClimbingTopos2AuthTable.name;

  const params = {
    TableName: authTableName,
    KeyConditionExpression: '#pk = :pk',
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': 'signing:key',
    },
  };

  const response = await dynamodb.send(new QueryCommand(params));
  const item = response.Items[0];

  const parsedValue = JSON.parse(item.value);

  const privateKey = parsedValue.privateKey.replace(/\\n/g, '\n');

  return privateKey;
};

export async function updateUser(accountSetupForm: FormData) {
  const cookies = await getCookies();
  const accessToken = cookies.get('access_token');

  const subject = await auth();

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

  const privateKey = await fetchJwtSigningKey();

  const currentAccessTokenDecoded = jwt.verify(accessToken.value, privateKey);

  const newAccessToken = jwt.sign(
    {
      ...currentAccessTokenDecoded,
      properties: {
        ...currentAccessTokenDecoded.properties,
        ...newUserProperties,
      },
    },
    privateKey,
    { algorithm: 'ES256' },
  );

  await setTokens(newAccessToken);
}
