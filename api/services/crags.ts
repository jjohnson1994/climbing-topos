import { Crag, CragBrief } from '../../core/types';
import { algolaIndex } from "../db/algolia";
import { crags, globals } from '../repositories';

export const createCrag = async (cragDetails: Crag, userSub: string) => {
  const newCrag = await crags.createCrag(cragDetails, userSub);

  try {
    const { cragTags } = await globals.getAllGlobals();

    algolaIndex
      .saveObject({
        title: cragDetails.title,
        osmData: cragDetails.osmData,
        tags: cragTags
          .filter(({ id }) => cragDetails.tags.includes(`${id}`))
          .map(({ title }) => title),
        model: "crag" ,
        objectID: newCrag.slug,
        slug: newCrag.slug
      })
      .catch(error => {
        console.error("Error saving new crag to algolia", error);
      });
  } catch(error) {
    console.error("Error saving new route to algolia", error);
  }

  return newCrag;
}

export async function getAllCrags(user: string): Promise<CragBrief[]> {
  return crags.getAllCrags(user);
}

export async function getCragBySlug(slug: string, userSub: string): Promise<Crag> {
  return crags.getCragBySlug(slug, userSub);
}

export async function incrementAreaCount(cragSlug: string) {
  return crags.update(cragSlug, {
    UpdateExpression: "set #areaCount = #areaCount + :inc",
    ExpressionAttributeNames: { 
      "#areaCount": "areaCount",
    },
    ExpressionAttributeValues: {
      ":inc": 1
    },
  });
}

export async function incrementRouteCount(cragSlug: string) {
  return crags.update(cragSlug, {
    UpdateExpression: "set #routeCount = #routeCount + :inc",
    ExpressionAttributeNames: { 
      "#routeCount": "routeCount",
    },
    ExpressionAttributeValues: {
      ":inc": 1
    },
  });
}
