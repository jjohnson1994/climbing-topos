import React from "react";
import {popupError, toastSuccess} from "../helpers/alerts";
import {clipboardWriteText} from "../helpers/clipboard";

interface Props {
  latitude: string;
  longitude: string;
}

function ButtonCopyCoordinates({ latitude, longitude }: Props) {

  const copyCoordinatedToClipboard = async () => {
    try {
      await clipboardWriteText(`${latitude}, ${longitude}`);
      toastSuccess("Coordinates copied");
    } catch (error) {
      console.error("Error copying crag coordinates to clipboard", error);
      popupError("Coordinates could not be copied. Check permissions and try again");
    }
  }

  return (
    <button className="button is-rounded" onClick={ copyCoordinatedToClipboard }>
      <span>{ `${latitude}`.substring(0, 9) }, { `${longitude}`.substring(0, 9) }</span>
      <span className="icon is-small">
        <i className="far fa-copy"></i>
      </span>
    </button>
  );
}

export default ButtonCopyCoordinates;
