import "./TopoImage.css";
import { smoothPath } from "../helpers/svg";
import { Route } from "core/types";
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
    }

    if (!highlightedRouteSlug) {
      return 1;
    }

    return 0;
  }

  const startTags = () => {
    const allDrawings = routes
      .filter(route => highlightedRouteSlug && route.slug === highlightedRouteSlug)
      .map(route => route.drawing)
      .filter(drawing => drawing.points.length > 0);

    const startStationTags: { [key: string]: number[] } = allDrawings.reduce<{ [key: string]: number[] }>((stationTags, line, index) => {
      const startStation = `${line.points[0][0]},${line.points[0][1]}`;

      return {
        ...stationTags,
        [startStation]: [ ...stationTags[startStation] || [], index + 1 ],
      }
    }, {});

    const endStationTags: { [key: string]: number[] } = allDrawings.reduce<{ [key: string]: number[] }>((stationTags, line, index) => {
      if (line.points.length > 1) {
        const endStation = `${line.points[line.points.length - 1][0]},${line.points[line.points.length - 1][1]}`;

        return {
          ...stationTags,
          [endStation]: [...stationTags[endStation] || [], index + 1 ],
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
    <div className="area-topo-image">
      <img src={ background } alt="topo"/>
      <div className="area-topo-image--canvas">
        <svg width="100%" height="100%" viewBox="0 0 1000 1000">
          {routes?.map((route) => (
            <path
              key={ route.slug }
              d={ smoothPath(route.drawing.points) }
              fill="transparent"
              stroke="yellow"
              strokeWidth="4"
              strokeOpacity={ getRouteStrokeOpacity(`${route.slug}`) }
            />
          ))}
          { startTags() }
        </svg>
      </div>
    </div>
  );
}

export default TopoImage;
