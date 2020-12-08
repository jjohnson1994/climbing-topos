import { images, topos } from "../models";
import { Topo } from "../../core/types";

export async function createTopo(topoDetails: Topo, imageFile) {
  const imageMeta = imageFile
    ? await images.newImage(imageFile)
    : { Location: "no image" };

  await topos.createTopo({ ...topoDetails, image: imageMeta.Location })
    .catch((error) => {
      if (imageMeta.Location !== "no image") {
        images.deleteImage(imageMeta.Key);
      }

      throw error;
    });
  return topos.createTopo(topoDetails);
}
