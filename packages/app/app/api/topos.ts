import { API } from "aws-amplify";
import Compressor from "compressorjs";
import { Topo, TopoPatch, TopoRequest } from "core/types";
import { uploads } from "../api";

const imageIsFile = (image: File) =>
  image && image.name && image.type && image.size;

export async function createTopo(topoDetails: TopoRequest) {
  const file = topoDetails.image as File;
  let image = undefined;

  if (imageIsFile(file)) {
    // TODO replace with Amplify upload
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

    await fetch(url, {
      method: "PUT",
      body: compressedFile,
      headers: new Headers({
        "Content-Type": file.type,
      }),
    }).then(async (res) => {
      if (res.status !== 200) {
        console.error("Error uploading topo image", res);
        throw res;
      }
    });

    image = objectUrl;
  }

  return API.post("climbingtopos2-api", `/topos`, {
    method: "POST",
    body: {
      image: image,
      imageFileName: topoDetails.imageFileName,
      orientation: topoDetails.orientation,
      areaSlug: topoDetails.areaSlug,
      cragSlug: topoDetails.cragSlug,
    },
  });
}

export function getTopo(topoSlug: string): Promise<Topo> {
  return API.get(
    "climbingtopos2-api",
    `/topos/${topoSlug}`,
    {}
  );
}

export async function updateTopo(
  topoSlug: string,
  patch: TopoPatch
): Promise<{ success: boolean }> {
  return API.patch(
    "climbingtopos2-api",
    `/topos/${topoSlug}`,
    {
      body: patch,
    }
  );
}
