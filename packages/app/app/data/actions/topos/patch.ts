'use server';
import { TopoPatch } from '@climbingtopos/types';
import { UpdateTopoSchema } from '@climbingtopos/schemas';
import { crags, topos } from '@/app/data/services';
import {
  RequestValidator,
  validateRequest,
} from '@/app/helpers/request-validator';
import { auth, login } from '@/app/actions';

const isValidSchema =
  (body: TopoPatch): RequestValidator =>
    async () => {
      if (!body) {
        throw new Error('invalid request');
      }

      const schema = UpdateTopoSchema();
      const isValid = await schema.isValid(body, {
        strict: true,
      });

      if (!isValid) {
        throw new Error('invalid request');
      }

      return true;
    };

export const patch = async (topoSlug: string, body: TopoPatch) => {
  const user = await auth();

  try {
    if (!user) {
      return login();
    }

    const validationResponse = await validateRequest([isValidSchema(body)]);

    if (validationResponse !== true) {
      return validationResponse;
    }

    const topoPatch = body;
    const userSub = user.properties.sub;
    const topo = await topos.getTopoBySlug(topoSlug);
    const crag = await crags.getCragBySlug(topo.cragSlug, userSub);

    if (crag.managedBy.sub !== userSub) {
      throw new Error(
        'Permission Error: You Do Not Have Permission to Patch this Topo',
      );
    }

    await topos.updateTopo(topo.cragSlug, topo.areaSlug, topoSlug, topoPatch);

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error updating topo', error);
    throw error;
  }
};
