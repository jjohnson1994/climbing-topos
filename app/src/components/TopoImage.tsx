import React from "react";
import "./TopoImage.css";
import { SmoothPath } from "../helpers/svg";
import { Route } from "../../../core/types";
import TopoImageStartTag from "./TopoImageStartTag";

interface PropTypes {
  routes: Route[];
  background: string;
  highlightedRouteSlug?: string;
}

function TopoImage({ routes, background, highlightedRouteSlug }: PropTypes) {
  const getRouteStrokeOpacity = (routeSlug: string) => {
    if (highlightedRouteSlug && highlightedRouteSlug === routeSlug) {
      return 1;
    } else if (!highlightedRouteSlug) {
      return 1;
    }

    return 0.5;
  }

  // TODO 99% the same as in TopoCanvas.tsx
  const joinLinkedRoutes = (
    routePath: number[][],
    linkFrom: { routeSlug: string, x: number; y: number } | undefined,
    linkTo: { routeSlug: string; x: number; y: number } | undefined,
  ) => {
    let joinedPathPoints: number[][] = [];

    if (linkFrom) {
      const linkFromPath = routes.find(route => route.slug === linkFrom.routeSlug)!.drawing.path;
      const joinIndex = linkFromPath?.findIndex(([x, y]) => {
        return Math.abs(x - linkFrom.x) <= 5 && Math.abs(y - linkFrom.y) <= 5;
      });
      const slicedPath = linkFromPath!.slice(0, joinIndex);

      joinedPathPoints = [...joinedPathPoints, ...slicedPath];
    }

    joinedPathPoints = [...joinedPathPoints, ...routePath];

    if (linkTo) {
      const linkToPath = routes.find(route => route.slug === linkTo.routeSlug)!.drawing.path;
      const joinIndex = linkToPath?.findIndex(([x, y]) => {
        return Math.abs(x - linkTo.x) <= 5 && Math.abs(y - linkTo.y) <= 5;
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
              d={ SmoothPath(joinLinkedRoutes(route.drawing.path, route.drawing.linkFrom, route.drawing.linkTo)) }
              fill="transparent"
              stroke="yellow"
              strokeWidth="4"
              strokeOpacity={ getRouteStrokeOpacity(`${route.slug}`) }
            />
          ))}
          {routes?.map((route, index) => (
            <TopoImageStartTag
              content={ index + 1 }
              x={ route.drawing.path[0][0] }
              y={ route.drawing.path[0][1] }
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

export default TopoImage;
