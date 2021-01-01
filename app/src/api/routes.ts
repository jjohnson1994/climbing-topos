import { Route, RouteView } from "../../../core/types";

export async function createRoute(routeDescription: Route, token: string): Promise<{ routeSlug: string }> {
  const res = await fetch('http://localhost:3001/dev/routes',
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

export async function getRoute(cragSlug: string, areaSlug: string, topoSlug: string, routeSlug: string): Promise<RouteView> {
  const res = await fetch(
    `http://localhost:3001/dev/routes?cragSlug=${cragSlug}&areaSlug=${areaSlug}&topoSlug=${topoSlug}&routeSlug=${routeSlug}`
  );
  const json = await res.json();

  if (res.status !== 200) {
    throw json;
  }

  return json;
}
