import { Topo } from "../../../core/types";

export async function createTopo(topoDetails: Topo) {
  const formData = new FormData();
  console.log(topoDetails);

  formData.append("image", topoDetails.image as File);
  formData.append("description", topoDetails.description);
  formData.append("orientation", topoDetails.orientation);
  formData.append("areaSlug", topoDetails.areaSlug);
  formData.append("cragSlug", topoDetails.cragSlug);

  const res = await fetch('http://localhost:3001/dev/topos', {
    method: "POST",
    body: formData,
  });

  const json = await res.json();

  if (res.status !== 200) {
    throw json;
  }

  return json
}
