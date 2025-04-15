'use server';

import { AreaRequest } from '@climbingtopos/types';
import { areas, crags } from '@/app/data/services';
import {
  RequestValidator,
  validateRequest,
} from '@/app/helpers/request-validator';
import { auth } from '@/app/actions';

const cragExists =
  (userSub: string, body: AreaRequest): RequestValidator =>
    async () => {
      if (!body) {
        console.error('POST area request received without body', body);
        throw new Error('Invalid Request');
      }

      const cragSlug = body.cragSlug;

      try {
        await crags.getCragBySlug(cragSlug, userSub);
        return true;
      } catch (error) {
        console.error('POST area request received for non-existing crag', event);
        throw error;
      }
    };

export const post = async (body: AreaRequest) => {
  try {
    const user = await auth();

    if (user === false) {
      return {
        success: false,
      };
    }

    const validationResponse = await validateRequest([
      cragExists(user.properties.sub, body),
    ]);

    if (validationResponse !== true) {
      return validationResponse;
    }

    const areaDetails = body;
    const resp = await areas.createArea(areaDetails, user.properties);

    return {
      success: true,
      ...resp,
    };
  } catch (error) {
    console.error('Error creating area', error);
  }
};
