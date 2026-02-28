'use server';

import { auth } from '@/app/actions';
import { crags } from '@/app/data/services';
import { files } from '@/app/data/services';
import { RequestValidator } from '@/app/helpers/request-validator';
import { NewCragSchema } from '@climbingtopos/schemas';
import { Crag, CragRequest } from '@climbingtopos/types';

const validateBody =
  (body: Crag): RequestValidator =>
  async () => {
    const schema = NewCragSchema();
    try {
      await schema.validate(body, { stripUnknown: true });
      return true;
    } catch (error) {
      console.error(error);
      throw new Error('Invalid request: schema not valid');
    }
  };

export const post = async (request: FormData) => {
  const cragDetails = {
    acceptTerms: request.get('acceptTerms'),
    accessLink: request.get('accessLink'),
    accessDetails: request.get('accessDetails'),
    approachNotes: request.get('approachNotes'),
    carParks: JSON.parse(request.get('carParks') as string),
    access: request.get('access'),
    longitude: request.get('longitude'),
    latitude: request.get('latitude'),
    tags: JSON.parse(request.get('tags') as string),
    description: request.get('description'),
    title: request.get('title'),
    osmData: JSON.parse(request.get('osmData') as string),
    image: request.get('image') as File,
  };

  try {
    const user = await auth();

    const validation = await validateBody(cragDetails)();

    if (validation !== true) {
      return validation;
    }

    if (user === false) {
      return {
        success: false,
      };
    }

    // TODO image compression, compressjs does not work server side
    // const compressedFile = await new Promise<Blob>((resolve, reject) => {
    //   console.log('compressing');
    //   console.log(cragDetails.image);
    //   new Compressor(cragDetails.image, {
    //     quality: 0.6,
    //     success(result) {
    //       resolve(result);
    //     },
    //     error(error) {
    //       console.error('Error compressing topo image', error);
    //       reject(error);
    //     },
    //   });
    // });

    const { fileUrl } = await files.uploadFile(cragDetails.image);

    const resp = await crags.createCrag(
      {
        ...cragDetails,
        image: fileUrl,
      },
      user.properties,
    );

    return {
      ...resp,
    };
  } catch (error) {
    console.error('Error creating crag', error);

    throw error;
  }
};
