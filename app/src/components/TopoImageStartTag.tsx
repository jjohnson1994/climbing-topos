import React from "react";

interface PropTypes {
  content: string | number;
  x: number;
  y: number;
}

function TopoImageStartTag({ content, x, y }: PropTypes) {
  return (
    <foreignObject
      x={ x - 15 }
      y={ y - 30 }
      width="30px"
      height="30px"
    >
      <div
        style={{
          width: "30px",
          height: "30px",
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
        <span style={{fontSize: "1rem", zIndex: 1, color: "#fff"}}>{ content }</span>
      </div>
    </foreignObject>
  )
}

export default TopoImageStartTag;
