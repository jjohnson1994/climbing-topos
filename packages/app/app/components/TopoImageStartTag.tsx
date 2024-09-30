import React, {useEffect, useState} from "react";

interface PropTypes {
  content: string;
  x: number;
  y: number;
}

function TopoImageStartTag({ content, x, y }: PropTypes) {
  const [width, setWidth] = useState(30);
  const [height] = useState(30);

  useEffect(() => {
    setWidth(Math.max(30, content.split(", ").length * 30));
  }, [content]);

  return (
    <foreignObject
      x={ x - width / 2 }
      y={ y - height / 2 }
      width={ `${width}` }
      height={ `${height}px` }
    >
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div
          style={{
            background: "rgba(0, 0, 0, 0.8)",
            padding: "5px",
            borderRadius: "50em",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        ></div>
        <span style={{fontSize: "1.5rem", zIndex: 1, color: "#fff"}}>{ content }</span>
      </div>
    </foreignObject>
  )
}

export default TopoImageStartTag;
