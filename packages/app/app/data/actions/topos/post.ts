'use server';

import { areas, topos, files } from '@/app/data/services';
import { RequestValidator } from '@/app/helpers/request-validator';
import { auth } from '@/app/actions';
import { TopoRequest } from '@climbingtopos/types';

const areaExists =
  (userSub: string, areaSlug: string): RequestValidator =>
    async () => {
      const area = await areas.getAreaBySlug(areaSlug, userSub);

      if (area) {
        return true;
      } else {
        throw new Error('invaid request');
      }
    };

export const post = async (formData: FormData) => {
  try {
    const user = await auth();

    if (user === false) {
      return {
        success: false,
      };
    }

    const areaExistsResponse = await areaExists(
      user.properties.sub,
      formData.get('areaSlug'),
    )();

    if (areaExistsResponse !== true) {
      return areaExistsResponse;
    }

    const { fileUrl } = await files.uploadFile(formData.get('image'));

    const topoDetails: TopoRequest = {
      orientation: formData.get('orientation'),
      image: fileUrl,
      imageFileName: formData.get('imageFileName'),
      cragSlug: formData.get('cragSlug'),
      areaSlug: formData.get('areaSlug'),
    };

    await topos.createTopo(topoDetails, user.properties);

    return { success: true };
  } catch (error) {
    console.error('Error getting Topo', error);

    throw error;
  }
};
