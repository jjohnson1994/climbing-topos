import { API } from "aws-amplify";
import { AreaRequest, Area, AreaPatch } from "core/types";

export async function createArea(
  areaDescription: AreaRequest
): Promise<{ slug: string }> {
  return API.post("climbing-topos", '/areas', {
    body: areaDescription,
  });
}

export async function getArea(areaSlug: string): Promise<Area> {
  return API.get(
    "climbing-topos",
    `/areas/${areaSlug}`,
    {}
  );
}

export async function updateArea(
  areaSlug: string,
  patch: AreaPatch
): Promise<{ success: boolean }> {
  return API.patch(
    "climbing-tops",
    `/areas/${areaSlug}`,
    {
      body: patch,
    }
  );
}
