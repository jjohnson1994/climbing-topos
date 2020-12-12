import React, { useEffect, useState } from "react";
import { Route } from "../../../core/types";
import { domToSvgPoint } from "../helpers/svg";

import "./TopoCanvas.css";

const strokeColor = "yellow";
const strokeDashArray = "10 5";
const strokeWidth = "4";

const existingRoutes = new Map<string, string[][]>();

function TopoCanvas({ backgroundImageURL, onDrawingChanged, routes }: { backgroundImageURL: string; onDrawingChanged: Function, routes: Route[] | undefined }) {
  const [finishX, setFinishX] = useState(-1);
  const [finishY, setFinishY] = useState(-1);
  const [showLinkSymbol, setShowLinkSymbol] = useState(false);

  useEffect(() => {
    const canvasSvg = document.querySelector("#canvasSvg") as SVGSVGElement;

    routes && routes.forEach(route => {
      console.log(route);
      const existingRoutePath = canvasSvg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'path'));

      existingRoutePath.setAttribute("d", `${route?.drawing?.path}`);
      existingRoutePath.setAttribute('fill', 'transparent'); 
      existingRoutePath.setAttribute('stroke', strokeColor); 
      existingRoutePath.setAttribute('stroke-width', strokeWidth);

      const existingRouteCoordinatesArray = route.drawing?.path?.replace("M ", "").split(",").map(pair => pair.split(" "));

      if (existingRouteCoordinatesArray) {
        existingRoutes.set(`${route.slug}`, existingRouteCoordinatesArray);
      }
    });
  }, [routes]);

  function findParentRoute(x: number, y: number): { x: number; y: number; parentRouteSlug: string } | undefined {
    let parentRoute;

    existingRoutes.forEach((pathPoints, routeSlug) => {
      pathPoints.forEach(([ x1, y1 ]) => {
        if (Math.abs(x - parseFloat(x1)) <= 5 && Math.abs(y - parseFloat(y1)) <= 5) {
          parentRoute = ({ x: x1, y: y1, parentRouteSlug: routeSlug });
        }
      });
    });

    return parentRoute;
  }

  function initCanvas() {
    const canvasSvg = document.querySelector("#canvasSvg") as SVGSVGElement;

    if (!canvasSvg) {
      throw new Error("Could not find canvas elements");
    }

    canvasSvg.setAttribute('width', '100%');
    canvasSvg.setAttribute('height', '100%');
    canvasSvg.setAttribute('viewBox', '0 0 1000 1000');

    const path = canvasSvg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'path'));

    canvasSvg.addEventListener('pointerdown', ({ clientX, clientY }) => {
      const { x, y } = domToSvgPoint({ x: clientX, y: clientY }, canvasSvg);
      let parentRoute = {};
      let pathPoints = `M ${x} ${y},`;
      path.setAttribute('d', pathPoints); 
      setFinishX(-1);
      setFinishY(-1);
      setShowLinkSymbol(false);

      const onPointerMove = ({ clientX, clientY }: PointerEvent) => {
        const { x, y } = domToSvgPoint({ x: clientX, y: clientY }, canvasSvg);
        const _parentRoute = findParentRoute(x, y);

        if (_parentRoute) {
          parentRoute = _parentRoute;
          setShowLinkSymbol(true);
        } else {
          pathPoints += `${x} ${y},`;
          path.setAttribute('d', pathPoints); 
          parentRoute = {};
          setFinishX(x);
          setFinishY(y);
          setShowLinkSymbol(false);
        }

        path.setAttribute('fill', 'transparent'); 
        path.setAttribute('stroke', strokeColor); 
        path.setAttribute('stroke-width', strokeWidth); 
      };

      const onPointerUp = () => {
        canvasSvg.removeEventListener('pointermove', onPointerMove);
        canvasSvg.removeEventListener('pointerup', onPointerUp);
        onDrawingChanged({ path: pathPoints, parentRoute });
      };

      canvasSvg.addEventListener('pointermove', onPointerMove);
      canvasSvg.addEventListener('pointerup', onPointerUp);
    });
  }

  useEffect(() => {
    initCanvas();
  }, []);

  return (
    <div id="canvas-container">
      <img id="canvas-bg" src={ backgroundImageURL } alt="topo drawing canvas" />
      <div id="canvas">
        <svg id="canvasSvg" width="100%" height="100%" viewBox="0 0 1000 1000">
          {finishX !== -1 && finishY !== -1 && !showLinkSymbol && (
            <foreignObject x={ finishX - 15 } y={ finishY - 30 } width="30px" height="30px">
              <div style={{ width: "30px", height: "30px", position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div style={{ background: "rgba(0, 0, 0, 0.8)", padding: "5px", borderRadius: "50em", position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}></div>
                <i style={{ fontSize: "1rem", zIndex: 1, color: "#fff" }} className="fas fa-flag"></i>
              </div>
            </foreignObject>
          )}
          {showLinkSymbol && (
            <foreignObject x={ finishX - 15 } y={ finishY - 30 } width="30px" height="30px">
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
