import { topos } from "../models";
import { crags } from "../services";
import { UserPublicData, TopoPatch, TopoRequest } from "@climbingtopos/types";

export async function createTopo(topoDetails: TopoRequest, user: UserPublicData) {
  const crag = await crags.getCragBySlug(topoDetails.cragSlug, user.sub);
  const topoVerified = crag.managedBy.sub === user.sub;

  return topos.createTopo(topoDetails, user, topoVerified);
}

export const getTopoBySlug = async (slug: string) => {
  const topo = await topos.getTopoBySlug(slug);

  return topo;
}

export async function updateTopo(
  cragSlug: string,
  areaSlug: string,
  topoSlug: string,
  topoPatch: TopoPatch,
) {
  const expressionAttributeNames = Object.entries(topoPatch).reduce(
    (acc, [key]) => ({
      ...acc,
      [`#${key}`]: key,
    }),
    {}
  );

  const expressionAttributeValues = Object.entries(topoPatch).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [`:${key}`]: value,
    }),
    {}
  );

  const updateExpression = Object.entries(topoPatch).map(
    ([key]) => {
      return `#${key} = :${key}`;
    }
  ).join(', ');

  return topos.update(cragSlug, areaSlug, topoSlug, {
    UpdateExpression: `set ${updateExpression}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  });
}
