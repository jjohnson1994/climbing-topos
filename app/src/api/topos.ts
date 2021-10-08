import Compressor from 'compressorjs';
import { Topo, TopoPatch, TopoRequest } from "core/types";
import { uploads } from "../api";

const imageIsFile = (image: File) => image && image.name && image.type && image.size;

export async function createTopo(topoDetails: TopoRequest, token: string) {
  const file = topoDetails.image as File;
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
      headers: new Headers({
        'Content-Type': file.type,
      })
    })
      .then(async res => {
        if (res.status !== 200) {
          console.error("Error uploading topo image", res);
          throw res;
        }
      });

    image = objectUrl;
  }

  const res = await fetch(`${process.env.REACT_APP_API_URL}/topos`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      image: image,
      imageFileName: topoDetails.imageFileName,
      orientation: topoDetails.orientation,
      areaSlug: topoDetails.areaSlug,
      cragSlug: topoDetails.cragSlug
    }),
  });

  const json = await res.json();

  if (res.status !== 200) {
    throw json;
  }

  return json
}

export async function getTopo(topoSlug: string): Promise<Topo> {
  const res = await fetch( `${process.env.REACT_APP_API_URL}/topos/${topoSlug}`);
  const json = await res.json();

  if (res.status !== 200) {
    throw json;
  }

  return json;

}

export async function updateTopo(
  topoSlug: string,
  patch: TopoPatch,
  token: string
): Promise<{ success: boolean }> {
  const res = await fetch(
    `${process.env.REACT_APP_API_URL}/topos/${topoSlug}`,
    {
      method: "PATCH",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(patch),
    }
  );
  const json = await res.json();

  if (res.status !== 200) {
    throw json;
  }

  return json;
}
