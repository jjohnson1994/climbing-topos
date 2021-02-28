import React, {useEffect, useState} from "react";
import "./TopoImage.css";
import { SmoothPath } from "../helpers/svg";
import { Route, RouteDrawing } from "../../../core/types";
import TopoImageStartTag from "./TopoImageStartTag";

interface PropTypes {
  routes: Route[];
  background: string;
  highlightedRouteSlug?: string;
}

function TopoImage({ routes, background, highlightedRouteSlug }: PropTypes) {
  const [joinedRoutePaths, setJoinedRoutePaths] = useState<number[][][]>([]);
  const [routeLabels, setRouteLabels] = useState<{ [key: string]: (string | number)[] }>({});

  useEffect(() => {
    const newJoinedRoutePaths = routes.map(route => {
      return joinLinkedRoutes(route.drawing, routes);
    });

    setJoinedRoutePaths(newJoinedRoutePaths);
  }, [routes]);

  useEffect(() => {
    const newRouteLabels = { ...routeLabels };

    joinedRoutePaths.forEach((path, index) => {
      const startX = Math.floor(path[0][0]);
      const startY = Math.floor(path[0][1]);
      const endX = Math.floor(path[path.length - 1][0]);
      const endY = Math.floor(path[path.length - 1][1]);

      newRouteLabels[`${startX},${startY}`] = Array.from(
        new Set([
          ...(newRouteLabels[`${startX},${startY}`] || []),
          index + 1
        ])
      );

      newRouteLabels[`${endX},${endY}`] = Array.from(
        new Set([
          ...(newRouteLabels[`${endX},${endY}`] || []),
          index + 1
        ])
      );
    });

    setRouteLabels(newRouteLabels);
  }, [joinedRoutePaths]);

  const getRouteStrokeOpacity = (routeSlug: string) => {
    if (highlightedRouteSlug && highlightedRouteSlug === routeSlug) {
      return 1;
    } else if (!highlightedRouteSlug) {
      return 1;
    }

    return 0.5;
  }

  const joinLinkedRoutes = (
    routeDrawing: RouteDrawing,
    routes: Route[],
  ) => {
    let joinedPathPoints: number[][] = [];

    if (routeDrawing.linkFrom?.routeSlug) {
      const linkFromPath = routes.find(route => route.slug === routeDrawing!.linkFrom!.routeSlug)!.drawing.path;
      const joinIndex = linkFromPath?.findIndex(([x, y]) => {
        return Math.abs(x - routeDrawing!.linkFrom!.x) <= 5 && Math.abs(y - routeDrawing!.linkFrom!.y) <= 5;
      });
      const slicedPath = linkFromPath!.slice(0, joinIndex);

      joinedPathPoints = [...joinedPathPoints, ...slicedPath];
    }

    joinedPathPoints = [...joinedPathPoints, ...routeDrawing.path];

    if (routeDrawing.linkTo?.routeSlug) {
      const linkToPath = routes.find(route => route.slug === routeDrawing!.linkTo!.routeSlug)!.drawing.path;
      const joinIndex = linkToPath?.findIndex(([x, y]) => {
        return Math.abs(x - routeDrawing!.linkTo!.x) <= 5 && Math.abs(y - routeDrawing!.linkTo!.y) <= 5;
      });
      const slicedPath = linkToPath!.slice(joinIndex);

      joinedPathPoints = [...joinedPathPoints, ...slicedPath];
    }

    return joinedPathPoints;
  }

  return (
    <div className="area-topo-image">
      <img src={ background } alt="topo"/>
      <div className="area-topo-image--canvas">
        <svg width="100%" height="100%" viewBox="0 0 1000 1000">
          {routes?.map((route) => (
            <path
              key={ route.slug }
              d={ SmoothPath(joinLinkedRoutes(route.drawing, routes)) }
              fill="transparent"
              stroke="yellow"
              strokeWidth="4"
              strokeOpacity={ getRouteStrokeOpacity(`${route.slug}`) }
            />
          ))}
          {Object.entries(routeLabels).map(([ coords, routes ], index) => (
            <TopoImageStartTag
              key={ index }
              content={ routes.join(", ") }
              x={ parseInt(coords.split(",")[0], 10) }
              y={ parseInt(coords.split(",")[1], 10) }
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

export default TopoImage;
