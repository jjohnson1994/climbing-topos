import { useState } from "react";
import { Log, LogRequest } from "core/types";
import { queryStringFromObject } from "../helpers/queryString";
import { API } from "aws-amplify";

export function logRoutes(logs: LogRequest[]) {
  return API.post("climbing-topos", `/logs`, {
    body: { logs },
  });
}

export function getProfileLogs(
  cragSlug?: string,
  areaSlug?: string,
  topoSlug?: string,
  routeSlug?: string
): Promise<Log[]> {
  const queryString = queryStringFromObject({
    cragSlug,
    areaSlug,
    topoSlug,
    routeSlug,
  });

  return API.get("climbing-topos", `/profile/logs${queryString}`, {});
}

export function getUserLogs(
  userSub: string,
  cragSlug?: string,
  areaSlug?: string,
  topoSlug?: string,
  routeSlug?: string
): Promise<Log[]> {
  return API.get(
    "climbing-topos",
    `/${userSub}?cragSlug=${cragSlug}&areaSlug=${areaSlug}&topoSlug=${topoSlug}&routeSlug=${routeSlug}`,
    {}
  );
}

export function getRouteLogs(
  cragSlug?: string,
  areaSlug?: string,
  topoSlug?: string,
  routeSlug?: string
): Promise<Log[]> {
  return API.get("climbing-topos", "/routes/logs", {
    queryStringParameters: { cragSlug, areaSlug, topoSlug, routeSlug },
  });
}

// TODO can delete?
export function useLogRoutes() {
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);
  const [isSelectingMultipleRoutes, setIsSelectingMultipleRoutes] =
    useState(false);

  const clearSelectedRoutes = () => {
    setSelectedRoutes([]);
  };

  const onInitSelectMultipleRoutes = (
    selectMultiple: boolean,
    routeSlug: string
  ) => {
    setIsSelectingMultipleRoutes(selectMultiple);
    setSelectedRoutes([routeSlug]);
  };

  const onRouteSelected = (routeSlug: string) => {
    const newSelectedRoutes = Array.from(
      new Set([...selectedRoutes, routeSlug])
    );
    setSelectedRoutes(newSelectedRoutes);
  };

  const onRouteDeselected = (routeSlug: string) => {
    const newSelectedRoutes = selectedRoutes.filter(
      (_routeSlug) => _routeSlug !== routeSlug
    );
    setSelectedRoutes(newSelectedRoutes);

    if (newSelectedRoutes.length === 0) {
      setIsSelectingMultipleRoutes(false);
    }
  };

  const onSingleRouteDone = (routeSlug: string) => {
    const newSelectedRoutes = [routeSlug];
    setSelectedRoutes(newSelectedRoutes);
  };

  return {
    clearSelectedRoutes,
    selectedRoutes,
    isSelectingMultipleRoutes,
    onInitSelectMultipleRoutes,
    onRouteSelected,
    onRouteDeselected,
    onSingleRouteDone,
  };
}
