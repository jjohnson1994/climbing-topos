import { Route } from "../../../core/types";

export async function createRoute(routeDescription: Route): Promise<{ routeSlug: string }> {
  const res = await fetch('http://localhost:3001/dev/routes',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(routeDescription)
    });

  const json = await res.json();

  if (res.status !== 200) {
    throw json;
  }

  return { routeSlug: json.routeSlug };
}
