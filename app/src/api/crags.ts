import {Crag, CragBrief, CragRequest} from "core/types";

function generateQueryParams(params: object): string {
  const queryParams = Object
    .entries(params)
    .reduce((acc, [key, value]) => {
      if (typeof value === 'undefined' && value !== null) {
        return acc;
      }

      return `${acc}${key}=${value}&`
    }, '?');

  return queryParams;
}

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

export async function getCrags(
  token: string,
  sortBy?: string,
  sortOrder?: "desc" | "asc",
  limit?: number,
  offset?: number
): Promise<CragBrief[]> {
  const params = generateQueryParams({
    sortBy,
    sortOrder,
    limit,
    offset
  })

  const res = await fetch(`${process.env.REACT_APP_API_URL}/crags${params}`, {
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
