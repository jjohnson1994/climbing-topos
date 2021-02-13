import { RouteRequest, Route } from "../../../core/types";

export async function createRoute(routeDescription: RouteRequest, token: string): Promise<{ routeSlug: string }> {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/routes`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(routeDescription)
    });

  const json = await res.json();

  if (res.status !== 200) {
    throw json;
  }

  return { routeSlug: json.routeSlug };
}

export async function getRoute(token: string, routeSlug: string): Promise<Route> {
  const res = await fetch(
    `${process.env.REACT_APP_API_URL}/routes?routeSlug=${routeSlug}`,
    {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      }
    }
  );
  const json = await res.json();

  if (res.status !== 200) {
    throw json;
  }

  return json;
}
