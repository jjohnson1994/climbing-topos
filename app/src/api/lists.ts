import { List, Route } from "core/types";

export async function addList(token: string, title: string): Promise<List> {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/lists`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ title }),
  });

  const json = await res.json();

  if (res.status !== 200) {
    throw json;
  }

  return json
}

export async function addRoutesToList(
  token: string, 
  listSlug: string, 
  routes: { 
    cragSlug: string; 
    areaSlug: string; 
    topoSlug: string; 
    routeSlug: string 
  }[]
) {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/lists?listSlug=${listSlug}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ routes }),
  });

  const json = await res.json();

  if (res.status !== 200) {
    throw json;
  }

  return json
}

export async function getLists(token: string): Promise<List[]> {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/lists`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const json = await res.json();

  if (res.status !== 200) {
    throw json;
  }

  return json;
}

export async function getList(token: string, listSlug: string): Promise<List> {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/lists/${listSlug}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const json = await res.json();

  if (res.status !== 200) {
    throw json;
  }

  return json;
}
