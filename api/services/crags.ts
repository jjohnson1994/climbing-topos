import { crags } from '../models';

import { Crag } from '../types';

export const createCrag = async (cragDetails: Crag) => {
  const newCrag = await crags.createCrag(cragDetails);
  return newCrag;
}

export const getAllCrags = async () => {
  const allCrags = await crags.getAllCrags();
  return allCrags;
}
