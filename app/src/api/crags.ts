import {Crag, CragBrief, CragRequest} from "core/types";

export async function createCrag(cragDetails: CragRequest, token: string): Promise<{ hk: string, slug: string }> {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/crags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(cragDetails)
  });
  const json = await res.json();

  if (res.status !== 200) {
    throw json;
  }

  return { hk: json.inserted.hk, slug: json.inserted.slug };
}

export async function getCrags(token: string): Promise<CragBrief[]> {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/crags`, {
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
