import { Area } from "../../../core/types";

export async function createArea(areaDescription: Area): Promise<{ slug: string }> {
  const res = await fetch('http://localhost:3001/dev/areas',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(areaDescription)
    });
  const json = await res.json();

  if (res.status !== 200) {
    throw json;
  }

  return { slug: "" };
}

export async function getArea(areaSlug: string): Promise<Area> {
  const res = await fetch(
    `http://localhost:3001/dev/areas/${areaSlug}`
  );
  const json = await res.json();

  if (res.status !== 200) {
    throw json;
  }

  return json;
}
