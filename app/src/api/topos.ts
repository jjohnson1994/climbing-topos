import { Topo } from "../../../core/types";
import { uploads } from "../api";

const imageIsFile = (image: File) => image && image.name && image.type && image.size;

export async function createTopo(topoDetails: Topo, token: string) {
  let image = undefined;

  if (imageIsFile(topoDetails.image as File)) {
    const { url, objectUrl } = await uploads.getPresignedUploadURL(token);

    await fetch(url, {
      method: "PUT",
      body: topoDetails.image,
      headers: new Headers({
        'Content-Type': (topoDetails.image as File).type,
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

  const res = await fetch('http://localhost:3001/dev/topos', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      image: image,
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
  const res = await fetch( `http://localhost:3001/dev/topos/${topoSlug}`);
  const json = await res.json();

  if (res.status !== 200) {
    throw json;
  }

  return json;

}
