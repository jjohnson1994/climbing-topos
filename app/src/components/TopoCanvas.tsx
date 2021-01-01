import React, {useEffect, useRef, useState} from "react";
import {Route} from "../../../core/types";
import { domToSvgPoint, ReducePath, SmoothPath } from "../helpers/svg";
import { RouteDrawing } from "../../../core/types";

import "./TopoCanvas.css";

enum PointerState {
  up = "up",
  down = "down"
}

const strokeColor = "yellow";
const strokeWidth = "4";

function TopoCanvas({backgroundImageURL, onDrawingChanged, routes}: {backgroundImageURL: string; onDrawingChanged: Function, routes: Route[] | undefined}) {
  const [finishXY, setFinishXY] = useState([-1, -1]);
  const [linkFrom, setLinkFrom] = useState<{routeSlug: string; x: number; y: number;} | undefined>();
  const [linkTo, setLinkTo] = useState<{routeSlug: string; x: number; y: number;} | undefined>();
  const [pointerState, setPointerState] = useState<PointerState>(PointerState.up);
  const [existingRoutes, setExistingRoutes] = useState<Map<string, number[][]>>(new Map());
  const [routePath, setRoutePath] = useState<number[][]>();
  const [completePath, setCompletePath] = useState<number[][]>([]);
  const [routeDrawing, setRouteDrawing] = useState<RouteDrawing>();

  const canvasElement = useRef<SVGSVGElement>(document.querySelector("svg") as SVGSVGElement);

  useEffect(() => {
    if (routes) {
      routes.forEach(route => {
        const existingRouteCoordinatesArray = route.drawing?.path;

        if (existingRouteCoordinatesArray) {
          const newExistingRoutes = new Map(existingRoutes);
          newExistingRoutes.set(`${route.slug}`, existingRouteCoordinatesArray);
          setExistingRoutes(newExistingRoutes);
        }
      });
    }
  }, [routes]);

  function findRouteUnderPointer(x: number, y: number): {x: number; y: number; parentRouteSlug: string} | undefined {
    let parentRoute;

    existingRoutes.forEach((pathPoints, routeSlug) => {
      pathPoints.forEach(([x1, y1]) => {
        if (Math.abs(x - x1) <= 5 && Math.abs(y - y1) <= 5) {
          parentRoute = ({x: x1, y: y1, parentRouteSlug: routeSlug});
        }
      });
    });

    return parentRoute;
  }

  // TODO 99% the same as in TopoImage.tsx
  function joinLinkedRoutes(
    routePath: number[][],
    linkFrom: { routeSlug: string, x: number; y: number } | undefined,
    linkTo: { routeSlug: string; x: number; y: number } | undefined,
    routes: Map<string, number[][]>
  ) {
    let joinedPathPoints: number[][] = [];

    if (linkFrom) {
      const linkFromPath = routes.get(linkFrom.routeSlug);
      const joinIndex = linkFromPath?.findIndex(([x, y]) => {
        return Math.abs(x - linkFrom.x) <= 5 && Math.abs(y - linkFrom.y) <= 5;
      });
      const slicedPath = linkFromPath!.slice(0, joinIndex);

      joinedPathPoints = [...joinedPathPoints, ...slicedPath];
    }

    joinedPathPoints = [...joinedPathPoints, ...routePath];

    if (linkTo) {
      const linkToPath = routes.get(linkTo.routeSlug);
      const joinIndex = linkToPath?.findIndex(([x, y]) => {
        return Math.abs(x - linkTo.x) <= 5 && Math.abs(y - linkTo.y) <= 5;
      });
      const slicedPath = linkToPath!.slice(joinIndex);

      joinedPathPoints = [...joinedPathPoints, ...slicedPath];
    }

    return joinedPathPoints;
  }

  function onPointerDown() {
    setPointerState(PointerState.down);
    setFinishXY([ -1, -1 ]);
    setLinkTo(undefined);
    setRoutePath(undefined);
    setRouteDrawing({
      path: [],
      linkFrom,
      linkTo
    });
  }

  function onPointerUp() {
    setPointerState(PointerState.up);
    onDrawingChanged(routeDrawing);
  }

  function onPointerMove({clientX, clientY}: PointerEvent) {
    if (pointerState === PointerState.down) {
      onPointerDrag({clientX, clientY});
      return;
    }

    const {x, y} = domToSvgPoint({x: clientX, y: clientY}, canvasElement.current);
    const targetRoute = findRouteUnderPointer(x, y);

    if (targetRoute && pointerState === PointerState.up) {
      setLinkFrom({
        x: Math.round(x * 100) / 100,
        y: Math.round(y * 100) / 100,
        routeSlug: targetRoute.parentRouteSlug
      });
    } else {
      setLinkFrom(undefined);
    }
  }

  function onPointerDrag({clientX, clientY}: {clientX: number, clientY: number}) {
    const {x, y} = domToSvgPoint({x: clientX, y: clientY}, canvasElement.current);
    const targetRoute = findRouteUnderPointer(x, y);

    if (targetRoute && pointerState === PointerState.down) {
      setLinkTo({
        x,
        y,
        routeSlug: targetRoute.parentRouteSlug
      });
    } else {
      setLinkTo(undefined);
    }

    setRoutePath(routePath
      ? [...routePath, [x, y]]
      : [[x, y]]
    );

    setRouteDrawing({
      path: routePath || [],
      linkFrom: routeDrawing?.linkFrom,
      linkTo
    });

    if (routePath) {
      const completePath = joinLinkedRoutes(
        routePath,
        routeDrawing?.linkFrom,
        routeDrawing?.linkTo,
        existingRoutes
      );

      setFinishXY(completePath.slice(-1)[0]);
      setCompletePath(ReducePath(completePath));
    }
  }

  return (
    <>
      <div className="notification is-primary">
        Make sure to draw route lines from <strong>start to finish</strong>
      </div>
      <div id="canvas-container">
        <img id="canvas-bg" src={backgroundImageURL} alt="topo drawing canvas" />
        <div id="canvas">
          <svg
            ref={canvasElement}
            width="100%"
            height="100%"
            viewBox="0 0 1000 1000"
            onPointerUp={onPointerUp}
            onPointerMove={e => onPointerMove(e as unknown as PointerEvent)}
            onPointerDown={onPointerDown}
          >
            {existingRoutes && [...existingRoutes.keys()].map(key => (
              <path
                key={key}
                d={SmoothPath(existingRoutes.get(key) as number[][])}
                strokeWidth={strokeWidth}
                stroke={strokeColor}
                strokeOpacity={0.5}
                fill="none"
              />
            ))}
            {routeDrawing?.path?.length && (
              <path
                d={SmoothPath(completePath)}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                fill="none"
              />
            )}
            {finishXY[0] !== -1 && finishXY[1] !== -1 && routeDrawing?.path?.length && (
              <foreignObject x={finishXY[0] - 15} y={finishXY[1] - 30} width="30px" height="30px">
                <div style={{width: "30px", height: "30px", position: "relative", display: "flex", justifyContent: "center", alignItems: "center"}}>
                  <div style={{background: "rgba(0, 0, 0, 0.8)", padding: "5px", borderRadius: "50em", position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}></div>
                  <i style={{fontSize: "1rem", zIndex: 1, color: "#fff"}} className="fas fa-flag"></i>
                </div>
              </foreignObject>
            )}
            {((linkFrom && pointerState === "up") || (linkTo && pointerState === "down")) && (
              <foreignObject x={(pointerState === "up" ? linkFrom!.x : linkTo!.x) - 15} y={(pointerState === "up" ? linkFrom!.y : linkTo!.y) - 30} width="30px" height="30px">
                <div style={{width: "30px", height: "30px", position: "relative", display: "flex", justifyContent: "center", alignItems: "center"}}>
                  <div style={{background: "rgba(0, 0, 0, 0.8)", padding: "5px", borderRadius: "50em", position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}></div>
                  <i style={{fontSize: "1rem", zIndex: 1, color: "#fff"}} className="fas fa-link"></i>
                </div>
              </foreignObject>
            )}
          </svg>
        </div>
      </div>
    </>
  );
}

export default TopoCanvas;
