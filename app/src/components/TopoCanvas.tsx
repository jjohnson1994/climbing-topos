import { useEffect, useState } from "react";
import { Route } from "core/types";
import { domToSvgPoint, smoothPath } from "../helpers/svg";
import { RouteDrawing } from "core/types";

import "./TopoCanvas.css";
import TopoImageStartTag from "./TopoImageStartTag";

interface Props {
  backgroundImageURL: string;
  onDrawingChanged: Function;
  routes: Route[] | undefined;
}

function TopoCanvas({ backgroundImageURL, onDrawingChanged, routes }: Props) {
  const [hasFocus, setHasFocus] = useState<boolean>(false);
  const [pointerCoords, setPointerCoords] = useState<[number, number]>([0, 0]);
  const [newLine, setNewLine] = useState<RouteDrawing>({ points: [] });
  const [existingLineDrawing, setExistingLineDrawings] = useState<RouteDrawing[]>([]);

  useEffect(() => {
    setExistingLineDrawings([ ...routes || []].map(route => route.drawing));
  }, [routes]);

  const canvasOnPointerEnter = () => {
    setHasFocus(true);
  }

  const canvasOnPointerMove = ({ clientX, clientY }: PointerEvent) => {
    const canvasElement = document.querySelector('svg');

    if (!canvasElement) {
      throw new Error('Error: Canvas Element is Not on Page');
    }

    const { x, y } = domToSvgPoint({ clientX, clientY }, canvasElement);

    setPointerCoords([x, y]);
  }

  const canvasOnPointerUp = ({ clientX, clientY }: PointerEvent) => {
    const canvasElement = document.querySelector('svg');

    if (!canvasElement) {
      throw new Error('Error: Canvas Element is Not on Page');
    }

    const { x, y } = domToSvgPoint({ clientX, clientY }, canvasElement);

    const newNewLine: [number, number][] = [...newLine.points, [x, y]];
    setNewLine({ points: newNewLine });
    onDrawingChanged({ points: newNewLine });
  }

  const existingStationOnPointerUp = (event: PointerEvent, x: number, y: number) => {
    event.stopPropagation();

    const newNewLine: [number, number][] = [...newLine.points, [x, y]];
    setNewLine({ points: newNewLine });
    onDrawingChanged({ points: newNewLine });
  }

  const canvasOnPointerLeave = () => {
    setHasFocus(false);
  }

  const lines = () => {
    const existingLinePoints = existingLineDrawing.map(path => path.points);

    return [...existingLinePoints, hasFocus ? [...newLine.points, pointerCoords] : newLine.points].map((pathPoints, index) => (
      <path
        key={ index }
        d={ smoothPath(pathPoints as [number, number][]) }
        stroke="yellow"
        strokeWidth="4"
        fill="transparent"
      />
    ))
  }

  const existingStations = () => {
    const flatPathPoints = existingLineDrawing.flatMap(path => path.points);

    return flatPathPoints.map(([x, y], index) => (
      <ellipse
        key={ index }
        cx={ x }
        cy={ y }
        rx="5"
        ry="5"
        strokeWidth="2"
        stroke="red"
        fill="transparent"
        onPointerUp={ (event) => existingStationOnPointerUp(event as unknown as PointerEvent, x, y) }
      />
    ))
  }

  const newStations = () => {
    return newLine.points.map(([x, y], index, arr) => (
      <ellipse
        key={ index }
        cx={ x }
        cy={ y }
        rx="5"
        ry="5"
        strokeWidth="2"
        stroke="red"
        fill="transparent"
        style={{ ...(index as number) === arr.length - 1 && { pointerEvents: 'none' } }}
      />
    ))
  }

  const startTags = () => {
    const allLines = [...existingLineDrawing, newLine].filter(path => path.points.length > 0);

    const startStationTags: { [key: string]: number[] } = allLines.reduce<{ [key: string]: number[] }>((stationTags, line, index) => {
      const startStation = `${line.points[0][0]},${line.points[0][1]}`;

      return {
        ...stationTags,
        [startStation]: [ ...stationTags[startStation] || [], index ],
      }
    }, {});

    const endStationTags: { [key: string]: number[] } = allLines.reduce<{ [key: string]: number[] }>((stationTags, line, index) => {
      if (line.points.length > 1) {
        const endStation = `${line.points[line.points.length - 1][0]},${line.points[line.points.length - 1][1]}`;

        return {
          ...stationTags,
          [endStation]: [...stationTags[endStation] || [], index ],
        }
      } else {
        return stationTags;
      }
    }, {});

    return [
      ...Object.keys(startStationTags).map((station, index) => {
        const [x, y] = station.split(',');
        const text = startStationTags[station].join(', ');

        return (
          <TopoImageStartTag
            key={ `starttag${index}` }
            content={ text }
            x={ parseInt(x, 10) }
            y={ parseInt(y, 10) + 23 }
          />
        )
      }),
      ...Object.keys(endStationTags).map((station, index) => {
        const [x, y] = station.split(',');
        const text = endStationTags[station].join(', ');

        return (
          <TopoImageStartTag
            key={ `endtag${index}` }
            content={ text }
            x={ parseInt(x, 10) }
            y={ parseInt(y, 10) - 23 }
          />
        )
      }),
    ];
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
            width="100%"
            height="100%"
            viewBox="0 0 1000 1000"
            onPointerEnter={ canvasOnPointerEnter }
            onPointerUp={ event => canvasOnPointerUp(event as unknown as PointerEvent) }
            onPointerLeave={ canvasOnPointerLeave }
            onPointerMove={ event => canvasOnPointerMove(event as unknown as PointerEvent) }
          >
            { lines() }
            { existingStations() }
            { newStations() }
            { startTags() }
          </svg>
        </div>
      </div>
    </>
  );
}

export default TopoCanvas;
