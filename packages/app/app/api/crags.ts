import { Amplify } from "aws-amplify";
import { API } from "aws-amplify";
import Compressor from "compressorjs";
import { Area, Crag, CragBrief, CragRequest, Route, Topo } from "@climbingtopos/types";
import { uploads } from "../api";
import config from "@/app/config";

Amplify.configure({
  Auth: {
    mandatorySignIn: false,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  },
  // Storage: {
  //   region: config.s3.REGION,
  //   bucket: config.s3.BUCKET,
  //   identityPoolId: config.cognito.IDENTITY_POOL_ID,
  // },
  API: {
    endpoints: [
      {
        name: "climbingtopos2-api",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION,
      },
    ],
  },
});

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

    await fetch(url, {
      method: "PUT",
      body: compressedFile,
    }).then(async (res) => {
      if (res.status !== 200) {
        console.error("Error uploading topo image", res);
        throw res;
      }
    });

    image = objectUrl;
  }

  const createCragResponse = await API.post("climbingtopos2-api", `/crags`, {
    body: {
      ...cragDetails,
      image,
    },
  });

  return {
    hk: createCragResponse.inserted.hk,
    slug: createCragResponse.inserted.slug,
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

  return API.get("climbingtopos2-api", "/crags", {
    queryStringParameters: params,
  });
}

export async function getCragBySlug(slug: string): Promise<Crag> {
  return API.get("climbingtopos2-api", `/crags/${slug}`, {});
}

export async function getCragItemsAwaitingAproval(
  cragSlug: string
): Promise<Array<Route | Area | Topo>> {
  return API.get(
    "climbingtopos2-api",
    `/crags/${cragSlug}/items-awaiting-approval`,
    {}
  );
}
