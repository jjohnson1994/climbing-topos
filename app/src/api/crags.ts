import Compressor from 'compressorjs';
import { Crag, CragBrief, CragRequest } from "core/types";
import { uploads } from "../api";

function generateQueryParams(params: object): string {
  const queryParams = Object
    .entries(params)
    .reduce((acc, [key, value]) => {
      if (typeof value === 'undefined' && value !== null) {
        return acc;
      }

      return `${acc}${key}=${value}&`
    }, '?');

  return queryParams;
}

const imageIsFile = (image: File) => image && image.name && image.type && image.size;

export async function createCrag(cragDetails: CragRequest, token: string): Promise<{ hk: string, slug: string }> {
  const file = cragDetails.image as File;
  let image = undefined;

  if (imageIsFile(file)) {
    const { url, objectUrl } = await uploads.getPresignedUploadURL(token);

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

    await fetch(url, {
      method: "PUT",
      body: compressedFile,
    })
      .then(async res => {
        if (res.status !== 200) {
          console.error("Error uploading topo image", res);
          throw res;
        }
      });

    image = objectUrl;
  }

  const res = await fetch(`${process.env.REACT_APP_API_URL}/crags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...cragDetails,
      image
    })
  });
  const json = await res.json();

  if (res.status !== 200) {
    throw json;
  }

  return { hk: json.inserted.hk, slug: json.inserted.slug };
}

export async function getCrags(
  token: string,
  sortBy?: string,
  sortOrder?: "desc" | "asc",
  limit?: number,
  offset?: number
): Promise<CragBrief[]> {
  const params = generateQueryParams({
    sortBy,
    sortOrder,
    limit,
    offset
  })

  const res = await fetch(`${process.env.REACT_APP_API_URL}/crags${params}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` })
    },
  });

  const json = await res.json();

  if (res.status !== 200) {
    throw json;
  }

  return json;
}

export async function getCragBySlug(slug: string, token: string): Promise<Crag> {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/crags/${slug}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });
  const json = await res.json();
  if (res.status !== 200) {
    throw json;
  }

  return json;
}
