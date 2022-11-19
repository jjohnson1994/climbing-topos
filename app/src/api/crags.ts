import { API } from "aws-amplify";
import Compressor from "compressorjs";
import { Area, Crag, CragBrief, CragRequest, Route, Topo } from "core/types";
import { uploads } from "../api";

function generateQueryParams(params: object): string {
  const queryParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (typeof value === "undefined" && value !== null) {
      return acc;
    }

    return `${acc}${key}=${value}&`;
  }, "?");

  return queryParams;
}

const imageIsFile = (image: File) =>
  image && image.name && image.type && image.size;

export async function createCrag(
  cragDetails: CragRequest
): Promise<{ hk: string; slug: string }> {
  const file = cragDetails.image as File;
  let image = undefined;

  if (imageIsFile(file)) {
    const { url, objectUrl } = await uploads.getPresignedUploadURL();

    const compressedFile = await new Promise<Blob>((resolve, reject) => {
      new Compressor(file, {
        quality: 0.6,
        success(result) {
          resolve(result);
        },
        error(error) {
          console.error("Error compressing topo image", error);
          reject(error);
        },
      });
    });

    await API.put("climbing-topos", url, {
      body: compressedFile,
    }).then(async (res) => {
      if (res.status !== 200) {
        console.error("Error uploading topo image", res);
        throw res;
      }
    });

    image = objectUrl;
  }

  const imageUploadResponse = await API.post("climbing-topos", `/crags`, {
    body: JSON.stringify({
      ...cragDetails,
      image,
    }),
  });

  return {
    hk: imageUploadResponse.inserted.hk,
    slug: imageUploadResponse.inserted.slug,
  };
}

export async function getCrags(
  sortBy?: string,
  sortOrder?: "desc" | "asc",
  limit?: number,
  offset?: number
): Promise<CragBrief[]> {
  const params = {
    ...(sortBy && { sortBy }),
    ...(sortOrder && { sortOrder }),
    ...(limit && { limit }),
    ...(offset && { offset }),
  }

  return API.get("climbing-topos", "/crags", {
    queryStringParameters: params,
  });
}

export async function getCragBySlug(slug: string): Promise<Crag> {
  return API.get("climbing-topos", `/crags/${slug}`, {});
}

export async function getCragItemsAwaitingAproval(
  cragSlug: string
): Promise<Array<Route | Area | Topo>> {
  return API.get(
    "climbing-topos",
    `/crags/${cragSlug}/items-awaiting-approval`,
    {}
  );
}
