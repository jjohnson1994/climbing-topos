import { AccessType, GradingSystem, Orientation, RockType, RouteType, Tag } from "core/types";
import { useEffect, useState } from "react";

const GlobalsGetter = () => {
  let globals: {
    accessTypes: AccessType[],
    areaTags: Tag[],
    cragTags: Tag[],
    gradingSystems: GradingSystem[],
    orientations: Orientation[],
    rockTypes: RockType[],
    routeTags: Tag[],
    routeTypes: RouteType[]
  };

  return async () => {
    if (!globals) {
      const newGlobals = await fetch('http://localhost:3001/dev/globals')
        .then(res => res.json());
      globals = newGlobals;
    }

    return globals;
  }
}

const globalsGetter = GlobalsGetter();

export const useGlobals = () => {
  const [accessTypes, setAccessTypes] = useState<AccessType[]>([]);
  const [areaTags, setAreaTags] = useState<Tag[]>([]);
  const [cragTags, setCragTags] = useState<Tag[]>([]);
  const [gradingSystems, setGradingSystems] = useState<GradingSystem[]>([]);
  const [orientations, setOrientations] = useState<Orientation[]>([]);
  const [rockTypes, setRockTypes] = useState<RockType[]>([]);
  const [routeTags, setRouteTags] = useState<Tag[]>([]);
  const [routeTypes, setRouteTypes] = useState<RouteType[]>([]);

  useEffect(() => {
    const getGlobals = async () => {
      const {
        accessTypes,
        areaTags,
        cragTags,
        gradingSystems,
        orientations,
        rockTypes,
        routeTags,
        routeTypes
      } = await globalsGetter();

      setAccessTypes(accessTypes);
      setAreaTags(areaTags);
      setCragTags(cragTags);
      setGradingSystems(gradingSystems);
      setOrientations(orientations);
      setRockTypes(rockTypes);
      setRouteTags(routeTags);
      setRouteTypes(routeTypes);
    }

    getGlobals();
  }, []);

  const getOrientationsTitleById = (id: string) => {
    const orientation = orientations.find(({ id: _id }) => _id === id);
    return orientation && orientation.title;
  }

  const getRouteTypeTitleById = (id: string) => {
    const routeType = routeTypes.find(({ id: _id }) => _id === id);
    return routeType && routeType.title;
  }

  return {
    accessTypes,
    areaTags,
    cragTags,
    getOrientationsTitleById,
    getRouteTypeTitleById,
    gradingSystems,
    orientations,
    rockTypes,
    routeTags,
    routeTypes,
  }
}
