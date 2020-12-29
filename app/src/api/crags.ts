import {CragView} from "../../../core/types";

export async function createCrag(cragDetails: object): Promise<{ hk: string, slug: string }> {
  const res = await fetch('http://localhost:3001/dev/crags', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cragDetails)
  });
  const json = await res.json();

  if (res.status !== 200) {
    throw json;
  }

  return { hk: json.inserted.hk, slug: json.inserted.slug };
}

export async function getCrags() {
  const res = await fetch('http://localhost:3001/dev/crags');
  const json = await res.json();
  if (res.status !== 200) {
    throw json;
  }

  return json;
}

export async function getCragBySlug(slug: string, token: string): Promise<CragView> {
  const res = await fetch(`http://localhost:3001/dev/crags/${slug}`, {
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
