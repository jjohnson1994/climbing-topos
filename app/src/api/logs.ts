import {useState} from "react";
import {LogRequest} from "../../../core/types";

export async function logRoutes(logs: LogRequest[], token: string) {
  console.log("logging", logs);
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
