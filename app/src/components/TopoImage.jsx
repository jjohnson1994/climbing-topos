import React from "react";
import "./TopoImage.module.css";

function TopoImage({ climbs, background }) {
  return (
    <div className="area-topo-image">
      <img src={ background }/>
      <div className="area-topo-image--canvas">
        <svg width="100%" height="100%" viewBox="0 0 1000 1000">
          {climbs?.map((climb) => (
            <path
              key={ climb.slug }
              d={ climb.drawing.path }
              fill="transparent"
              stroke="yellow"
              stroke-width="4"
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

export default TopoImage;
