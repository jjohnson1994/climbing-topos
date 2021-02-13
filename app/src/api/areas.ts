import { AreaRequest, Area } from "../../../core/types";

export async function createArea(areaDescription: AreaRequest, token: string): Promise<{ slug: string }> {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/areas`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(areaDescription)
    });
  const json = await res.json();

  if (res.status !== 200) {
    throw json;
  }

  return json;
}

export async function getArea(areaSlug: string, token: string): Promise<Area> {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/areas/${areaSlug}`, {
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
