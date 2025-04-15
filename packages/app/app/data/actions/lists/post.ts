'use server';

import { NewListSchema } from '@climbingtopos/schemas';
import { lists } from '@/app/data/services';
import { RequestValidator } from '@/app/helpers/request-validator';
import { auth } from '@/app/actions';
import { ListRequest } from '@climbingtopos/types';

const validateBody =
  (body: ListRequest): RequestValidator =>
    async () => {
      const schema = NewListSchema();
      const isValid = await schema.isValid(body);

      if (isValid) {
        return true;
      } else {
        throw new Error('invalid schema');
      }
    };

export const post = async (body: ListRequest) => {
  try {
    const user = await auth();
    const bodyIsValid = await validateBody(body)();

    if (bodyIsValid !== true) {
      return bodyIsValid;
    }

    if (user === false) {
      return {
        success: false,
      };
    }

    const listDescription = body;
    const newList = await lists.createList(user.properties, listDescription);

    return { success: true, ...newList };
  } catch (error) {
    console.error('Error creating new list', error);

    throw error;
  }
};
