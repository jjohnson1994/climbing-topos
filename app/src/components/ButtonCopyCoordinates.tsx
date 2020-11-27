import React from "react";

function ButtonCopyCoordinates(props: { latitude: string, longitude: string }) {
  return <button>{ props.latitude }{ props.longitude }</button>
}

export default ButtonCopyCoordinates;
