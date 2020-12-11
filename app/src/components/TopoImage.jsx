import React from "react";
import "./TopoImage.css";

function TopoImage({ routes, background }) {
  return (
    <div className="area-topo-image">
      <img src={ background }/>
      <div className="area-topo-image--canvas">
        <svg width="100%" height="100%" viewBox="0 0 1000 1000">
          {routes?.map((route) => (
            <path
              key={ route.slug }
              d={ route.drawing.path }
              fill="transparent"
              stroke="yellow"
              strokeWidth="4"
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

export default TopoImage;
