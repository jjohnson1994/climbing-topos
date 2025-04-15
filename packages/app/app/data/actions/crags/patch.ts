'use server';
import { CragPatch } from '@climbingtopos/types';
import { UpdateCragSchema } from '@climbingtopos/schemas';
import { crags } from '@/app/data/services';
import {
  RequestValidator,
  validateRequest,
} from '@/app/helpers/request-validator';
import { auth, login } from '@/app/actions';

const isValidCragPatch =
  (body: CragPatch): RequestValidator =>
    async () => {
      if (!body) {
        throw new Error('Invalid Request: No body');
      }

      const schema = UpdateCragSchema();
      const isValid = await schema.isValid(body, {
        strict: true,
      });

      if (!isValid) {
        throw new Error('Invalid Request: Body Does Not Match Schema');
      }

      return true;
    };

export const patch = async (cragSlug: string, body: CragPatch) => {
  const user = await auth();

  try {
    if (!user) {
      console.error(
        'PATCH crag request received without authorization header',
        body,
      );

      return login();
    }

    const validationResponse = await validateRequest([isValidCragPatch(body)]);

    if (validationResponse !== true) {
      return validationResponse;
    }

    const userSub = user.properties.sub;

    const crag = await crags.getCragBySlug(cragSlug, userSub);

    if (crag.managedBy.sub !== userSub) {
      return {
        error: true,
        message:
          'Permission Error: You Do Not Have Permission to Patch this Crag',
      };
    }

    await crags.updateCrag(cragSlug, body);

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error updating area', error);

    return {
      error: true,
      message: error.message,
    };
  }
};
