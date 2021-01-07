import {useState} from "react";
import {Log, LogRequest} from "../../../core/types";
import {queryStringFromObject} from "../helpers/queryString";

export async function logRoutes(logs: LogRequest[], token: string) {
  const res = await fetch('http://localhost:3001/dev/logs', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(logs),
  });

  const json = await res.json();

  if (res.status !== 200) {
    throw json;
  }

  return json
}

export async function getProfileLogs(token: string, cragSlug?: string, areaSlug?: string, topoSlug?: string, routeSlug?: string): Promise<Log[]> {
  const queryString = queryStringFromObject({
    cragSlug,
    areaSlug,
    topoSlug,
    routeSlug
  });

  const res = await fetch(`http://localhost:3001/dev/profile/logs${queryString}`, {
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

export async function getUserLogs(userSub: string, token: string, cragSlug?: string, areaSlug?: string, topoSlug?: string, routeSlug?: string): Promise<Log[]> {
  const res = await fetch(`http://localhost:3001/dev/${userSub}?cragSlug=${cragSlug}&areaSlug=${areaSlug}&topoSlug=${topoSlug}&routeSlug=${routeSlug}`, {
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

export function useLogRoutes() {
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);
  const [isSelectingMultipleRoutes, setIsSelectingMultipleRoutes] = useState(false);

  const onInitSelectMultipleRoutes = (selectMultiple: boolean, routeSlug: string) => {
    setIsSelectingMultipleRoutes(selectMultiple);
    setSelectedRoutes([ routeSlug ]);
  }

  const onRouteSelected = (routeSlug: string) => {
    const newSelectedRoutes = Array.from(new Set([ ...selectedRoutes, routeSlug ]));
    setSelectedRoutes(newSelectedRoutes);
  }
  
  const onRouteDeselected = (routeSlug: string) => {
    const newSelectedRoutes = selectedRoutes.filter(_routeSlug => _routeSlug !== routeSlug)
    setSelectedRoutes(newSelectedRoutes);

    if (newSelectedRoutes.length === 0) {
      setIsSelectingMultipleRoutes(false);
    }
  } 

  return {
    selectedRoutes,
    isSelectingMultipleRoutes,
    onInitSelectMultipleRoutes,
    onRouteSelected,
    onRouteDeselected
  }
}
