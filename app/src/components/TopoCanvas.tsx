import React, { useEffect } from "react";
import "./TopoCanvas.css";

const strokeColor = "yellow";
const strokeDashArray = "10 5";
const strokeWidth = "4";

function TopoCanvas({ backgroundImageURL, onDrawingChanged }: { backgroundImageURL: string; onDrawingChanged: Function }) {
  function initCanvas() {
    const canvasElement = document.querySelector('#canvas');

    if (!canvasElement) {
      throw new Error("Could not find canvas element");
    }

    canvasElement.innerHTML = "";

    const canvasSvg = canvasElement.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
    const path = canvasSvg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'path'));

    canvasSvg.setAttribute('width', '100%');
    canvasSvg.setAttribute('height', '100%');
    canvasSvg.setAttribute('viewBox', '0 0 1000 1000');

    const domToSvgPoint = ({ x, y }: { x: number, y: number }) => {
      const point = canvasSvg.createSVGPoint();

      point.x = x;
      point.y = y;

      if (!canvasSvg) {
        throw new Error("No Canvas SVG Element");
      }

      return point.matrixTransform(canvasSvg.getScreenCTM()!.inverse());
    }

    canvasSvg.addEventListener('pointerdown', ({ clientX, clientY }) => {
      const { x, y } = domToSvgPoint({ x: clientX, y: clientY });

      let pathPoints = `M ${x} ${y},`;
      path.setAttribute('d', pathPoints); 

      const onPointerMove = ({ clientX, clientY }: PointerEvent) => {
        const { x, y } = domToSvgPoint({ x: clientX, y: clientY });

        pathPoints += `${x} ${y},`;
        path.setAttribute('d', pathPoints); 

        path.setAttribute('fill', 'transparent'); 
        path.setAttribute('stroke', strokeColor); 
        path.setAttribute('stroke-width', strokeWidth); 
      };

      const onPointerUp = () => {
        canvasSvg.removeEventListener('pointermove', onPointerMove);
        canvasSvg.removeEventListener('pointerup', onPointerUp);
        onDrawingChanged({ path: pathPoints });
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
      <div id="canvas"></div>
    </div>
  );
}

export default TopoCanvas;
