import { crags, areas } from '../models';
import { Crag } from '../types';

export const createCrag = async (cragDetails: Crag) => {
  const newCrag = await crags.createCrag(cragDetails);
  return newCrag;
}

export const getAllCrags = async () => {
  const allCrags = await crags.getAllCrags();
  return allCrags;
}

export const getCragBySlug = async (slug: string) => {
  const crag = await crags.getCragBySlug(slug);
  const cragAreas = await areas.getAreasByCragSlug(crag.slug);

  return {
    ...crag,
    areas: cragAreas
  };
}
