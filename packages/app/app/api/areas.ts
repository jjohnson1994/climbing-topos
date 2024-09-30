import { API } from "aws-amplify";
import { AreaRequest, Area, AreaPatch } from "core/types";

export async function createArea(
  areaDescription: AreaRequest
): Promise<{ slug: string }> {
  return API.post("climbingtopos2-api", '/areas', {
    body: areaDescription,
  });
}

export async function getArea(areaSlug: string): Promise<Area> {
  return API.get(
    "climbingtopos2-api",
    `/areas/${areaSlug}`,
    {}
  );
}

export async function updateArea(
  areaSlug: string,
  patch: AreaPatch
): Promise<{ success: boolean }> {
  return API.patch(
    "climbingtopos2-api",
    `/areas/${areaSlug}`,
    {
      body: patch,
    }
  );
}
