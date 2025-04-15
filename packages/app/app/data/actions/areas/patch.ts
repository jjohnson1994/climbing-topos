'use server';
import { AreaPatch } from '@climbingtopos/types';
import { UpdateAreaSchema } from '@climbingtopos/schemas';
import { areas, crags } from '@/app/data/services';
import {
  RequestValidator,
  validateRequest,
} from '@/app/helpers/request-validator';
import { auth } from '@/app/actions';

const isValidAreaPatch =
  (body: AreaPatch): RequestValidator =>
    async () => {
      if (!body) {
        throw new Error('Invalid Request: No Body');
      }

      const schema = UpdateAreaSchema();
      const isValid = await schema.isValid(body, {
        strict: true,
      });

      if (!isValid) {
        throw new Error('Invalid Request: Body Does Not Match Schema');
      }

      return true;
    };

export const patch = async (areaSlug: string, areaPatch: AreaPatch) => {
  try {
    const user = await auth();
    const validationResponse = await validateRequest([
      isValidAreaPatch(areaPatch),
    ]);

    if (validationResponse !== true) {
      return validationResponse;
    }

    if (!user) {
      console.error('PATCH area request received without authorization header');
      throw new Error('invalid request');
    }

    const userSub = user.properties.sub;
    const area = await areas.getAreaBySlug(areaSlug);
    const crag = await crags.getCragBySlug(area.cragSlug, userSub);

    if (crag.managedBy.sub !== userSub) {
      throw new Error(
        'Permission Error: You Do Not Have Permission to Patch this Area',
      );
    }

    await areas.updateArea(crag.slug, areaSlug, areaPatch);

    return { success: true };
  } catch (error) {
    console.error('Error updating area', error);
    throw error;
  }
};
