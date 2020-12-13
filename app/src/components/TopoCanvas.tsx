import React, { useEffect, useRef, useState } from "react";
import { Route } from "../../../core/types";
import { domToSvgPoint, pathCoordsToSmoothPath } from "../helpers/svg";

import "./TopoCanvas.css";

enum PointerState {
  up = "up",
  down = "down"
}

const strokeColor = "yellow";
const strokeWidth = "4";

function TopoCanvas({ backgroundImageURL, onDrawingChanged, routes }: { backgroundImageURL: string; onDrawingChanged: Function, routes: Route[] | undefined }) {
  const [finishXY, setFinishXY] = useState([-1, -1]);
  const [linkFrom, setLinkFrom] = useState<{ routeSlug: string; x: number; y: number; } | undefined>();
  const [linkTo, setLinkTo] = useState<{ routeSlug: string; x: number; y: number; } | undefined>();
  const [pointerState, setPointerState] = useState<PointerState>(PointerState.up);
  const [pathPoints, setPathPoints] = useState<number[][]>([]);
  const [existingRoutes, setExistingRoutes] = useState<Map<string, number[][]>>(new Map());

  const canvasElement = useRef<SVGSVGElement>(document.querySelector("svg") as SVGSVGElement);

  useEffect(() => {
    routes && routes.forEach(route => {
      const existingRouteCoordinatesArray = route.drawing?.path;

      if (existingRouteCoordinatesArray) {
        const newExistingRoute = new Map([ ...existingRoutes ]);
        newExistingRoute.set(`${route.slug}`, existingRouteCoordinatesArray);
        setExistingRoutes(newExistingRoute);
      }
    });
  }, [routes]);

  function findRouteUnderPointer(x: number, y: number): { x: number; y: number; parentRouteSlug: string } | undefined {
    let parentRoute;

    existingRoutes.forEach((pathPoints, routeSlug) => {
      pathPoints.forEach(([ x1, y1 ]) => {
        if (Math.abs(x - x1) <= 5 && Math.abs(y - y1) <= 5) {
          parentRoute = ({ x: x1, y: y1, parentRouteSlug: routeSlug });
        }
      });
    });

    return parentRoute;
  }

  function onPointerDown() {
    setPointerState(PointerState.down);
    setPathPoints([]);
    setFinishXY([ -1, -1 ]);
    setLinkTo(undefined);
  }

  function onPointerUp() {
    setPointerState(PointerState.up);
    onDrawingChanged({
      path: pathPoints,
      linkFrom: linkFrom,
      linkTo: linkTo
    });
  }

  function onPointerMove({ clientX, clientY }: PointerEvent) {
    if (pointerState === PointerState.down) {
      onPointerDrag({ clientX, clientY });
      return;
    }

    const { x, y } = domToSvgPoint({ x: clientX, y: clientY }, canvasElement.current);
    const targetRoute = findRouteUnderPointer(x, y);

    if (targetRoute) {
      setLinkFrom({
        x,
        y,
        routeSlug: targetRoute.parentRouteSlug
      });
    } else {
      setLinkFrom(undefined);
    }
  }

  function onPointerDrag({ clientX, clientY }: { clientX: number, clientY: number }) {
    const { x, y } = domToSvgPoint({ x: clientX, y: clientY }, canvasElement.current);
    const targetRoute = findRouteUnderPointer(x, y);

    setFinishXY([x, y]);

    if (targetRoute) {
      setLinkTo({
        x,
        y,
        routeSlug: targetRoute.parentRouteSlug
      });
    } else {
      setLinkTo(undefined);
    }

    setPathPoints([ ...pathPoints, [x, y] ]);
  }

  return (
    <div id="canvas-container">
      <img id="canvas-bg" src={ backgroundImageURL } alt="topo drawing canvas" />
      <div id="canvas">
        <svg
          ref={ canvasElement }
          width="100%"
          height="100%"
          viewBox="0 0 1000 1000"
          onPointerUp={ onPointerUp }
          onPointerMove={ e => onPointerMove(e as unknown as PointerEvent) }
          onPointerDown={ onPointerDown }
        >
          {existingRoutes && Array.from(existingRoutes).map(([ key, path ]) => (
            <path
              key={ key }
              d={ pathCoordsToSmoothPath(path) }
              strokeWidth={ strokeWidth }
              stroke={ strokeColor }
              strokeOpacity={ 0.5 }
              fill="none"
            />
          ))}
          {pathPoints && (
            <path
              d={ pathCoordsToSmoothPath(pathPoints) }
              stroke={ strokeColor }
              strokeWidth={ strokeWidth }
              fill="none"
            />
          )}
          {finishXY[0] !== -1 && finishXY[1] !== -1 && !linkFrom && !linkTo && (
            <foreignObject x={ finishXY[0] - 15 } y={ finishXY[1] - 30 } width="30px" height="30px">
              <div style={{ width: "30px", height: "30px", position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div style={{ background: "rgba(0, 0, 0, 0.8)", padding: "5px", borderRadius: "50em", position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}></div>
                <i style={{ fontSize: "1rem", zIndex: 1, color: "#fff" }} className="fas fa-flag"></i>
              </div>
            </foreignObject>
          )}
          {((linkFrom && pointerState === "up") || (linkTo && pointerState === "down")) && (
            <foreignObject x={ (pointerState === "up" ? linkFrom!.x : linkTo!.x) - 15 } y={ (pointerState === "up" ? linkFrom!.y : linkTo!.y) - 30 } width="30px" height="30px">
              <div style={{ width: "30px", height: "30px", position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div style={{ background: "rgba(0, 0, 0, 0.8)", padding: "5px", borderRadius: "50em", position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}></div>
                <i style={{ fontSize: "1rem", zIndex: 1, color: "#fff" }} className="fas fa-link"></i>
              </div>
            </foreignObject>
          )}
        </svg>
      </div>
    </div>
  );
}

export default TopoCanvas;
